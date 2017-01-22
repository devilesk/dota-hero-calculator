require("./app/polyfill");
var $ = require('jquery');
var getParameterByName = require("./app/getParameterByName");
var HeroCalc = require("dota-hero-calculator-library");
var HeroCalculatorViewModel;
var viewModel;

var App = function (appConfig) {
    
    HeroCalc.init(HeroCalcData.heroData, HeroCalcData.itemData, HeroCalcData.unitData, function () {
        HeroCalculatorViewModel = require('./app/HeroCalculatorViewModel');
        viewModel = new HeroCalculatorViewModel(appConfig.abilityTooltipPath);
        ko.options.deferUpdates = true;
        ko.applyBindings(viewModel);
        $('#spinner').hide();
        $('.initial-hidden').css('display', 'inline-block');
        $('#popHero0').addClass('active');
        $('#heroPane0').addClass('active');
        $('[data-toggle="tooltip"]').tooltip();
        var saveId = getParameterByName('id');
        if (saveId) {
            $.get('save/' + saveId + '.json', function (data) {
                viewModel.load(data);
            });
        }
    });

    var lastUpdate = "#build_date";
    $('#last-update').text(lastUpdate);

    var rollbar = require('./rollbar');

    $('.error-warning-view, .error-warning-close').click(function () {
        $('.error-warning').fadeOut(200);
    });

    var userActions = [];
    function addUserAction(o) {
        if (userActions.length > 10) {
            userActions.shift();
        }
        userActions.push(o);
    }

    function actionTrackWrapper(func, eventName) {
        return function() {
            var el = this;
            var data = {
                eventName: eventName
            };
            if (el.id) data.id = el.id;
            if (el.src) data.src = el.src;
            if (el.className) data.className = el.className;
            if (el.textContent) data.textContent = el.textContent;
            if (el.nodeName) data.nodeName = el.nodeName;
            if (el.getAttribute('data-bind')) data['data-bind'] = el.getAttribute('data-bind');
            
            for (var property in data) {
                if (data.hasOwnProperty(property)) {
                    data[property] = data[property].substring(0, Math.min(200, data[property].length));
                }
            }
            addUserAction(data);
            return func.apply(this, arguments);
        }
    }

    function callbackWrap(object, property, argumentIndex, wrapperFactory, eventFilter) {
        var original = object[property];
        object[property] = function() {
            if (eventFilter.indexOf(arguments[0]) != -1) {
                arguments[argumentIndex] = wrapperFactory(arguments[argumentIndex], arguments[0]);
            }
            return original.apply(this, arguments);
        }
        return original;
    }

    callbackWrap(Element.prototype, "addEventListener", 1, actionTrackWrapper, ['click', 'focus', 'blur', 'change', 'dblclick'])

    window.onerror = (function (old) {
        return function () {
            var payload = {};
            var logEl = document.querySelector('#log');

            if (logEl) {
                try {
                    var msg = arguments[0];
                    var el = document.createElement('div');
                    el.classList.add('alert');
                    el.classList.add('alert-danger');
                    el.classList.add('error-log');
                    el.classList.add('col-md-12');
                    el.textContent = 'error: ' + msg;
                    
                    var closeBtn = document.createElement('div');
                    closeBtn.classList.add('error-log-close');
                    closeBtn.innerHTML = "&times;";
                    closeBtn.onclick = function () {
                        logEl.removeChild(el);
                    }
                    el.appendChild(closeBtn);
                    
                    var reportEl = document.createElement('a');
                    reportEl.classList.add('error-log-link');
                    reportEl.innerHTML = "Send error report";
                    reportEl.href = "#"
                    reportEl.onclick = function () {
                        $('#myModal').modal('show');
                        $('#BugReportFormText').text('error: ' + msg + '\n\nDescribe what you were doing. Try to be as detailed as possible.');
                    }
                    el.appendChild(reportEl);
                    
                    logEl.appendChild(el);
                    
                    $('.error-warning').fadeOut(200).fadeIn(100);
                }
                catch (e) {
                    rollbar.error("window.onerror create error log failed.", e);
                }
            }
            else {
                payload.clientLogCreated = false;
            }

            if (HeroCalculatorViewModel && viewModel) {
                try {
                    payload.heroCalcState = viewModel.getSaveData();
                }
                catch (e) {
                    rollbar.error("window.onerror getSaveData failed.", e);
                }
                try {
                    payload.appState = viewModel.getAppState();
                }
                catch (e) {
                    rollbar.error("window.onerror getAppState failed.", e);
                }
            }
            else {
                payload.appState = "load failed"
            }
            payload.userActions = userActions;
            rollbar.configure({
              payload: {custom: payload}
            });
            
            return old.apply(this, arguments);
        }
    })(window.onerror);
    
};

module.exports = App;