require.config({
    packages: ["herocalc", "components"],
    paths: {
        'knockout': 'lib/knockout-min',
        //'underscore': '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min',
        'jquery': 'lib/jquery.min',
        'knockout-mapping': 'lib/knockout.mapping',
        'chartjs': 'lib/Chart.min',
        'bootstrap': 'lib/bootstrap.min',
        'jquery-ui': 'lib/jquery-ui',
        'domReady': 'lib/domReady',
        'chartjs-scatter': 'lib/Chart.scatter',
        'text': 'lib/text',
        'polyfill': 'herocalc/polyfill',
        'herocalc_knockout': 'herocalc/herocalc_knockout',
        'jquery-ui.custom': 'herocalc/jquery-ui.custom',
        'rollbar': 'lib/rollbar.umd.nojson.min'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery']
        }
    },
    waitSeconds: 7
});

require(['rollbar', 'polyfill'], function (errorTracker) {
    var rollbarConfig = {
      accessToken: 'de1980fcab4849d6a7a066cf098a6521',
      captureUncaught: true,
      payload: {
        environment: 'development',
        client: {
          javascript: {
            source_map_enabled: true,
            code_version: "#code_version",
            // Optionally have Rollbar guess which frames the error was thrown from
            // when the browser does not provide line and column numbers.
            guess_uncaught_frames: true
          }
        }
      }
    };
    
    var rollbar = Rollbar.init(rollbarConfig);

    require(['jquery', 'herocalc', 'domReady!'], function ($, HEROCALCULATOR) {
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
        
        callbackWrap(Element.prototype, "addEventListener", 1, actionTrackWrapper, ['click', 'focus', 'blur', 'change', 'dblclick']);

        $('.top-nav-menu .dropdown-toggle').click(function() {
          if ($('.mobile-only').css('display') == 'none') {
            var location = $(this).attr('href');
            window.location.href = location;
            return false;
          }
        });
        var cssPath = "css/hero-calculator.theme";
        if (readCookie('theme') == 'light') {
            if ($('#theme-css').attr('href') !== '/media/css/site-light.css') $('#theme-css').attr('href','/media/css/site-light.css');
            if ($('#hero-css').attr('href') !== cssPath + '.light.css') $('#hero-css').attr('href', cssPath + '.light.css');
            $("#theme-select").val('light');
        }
        else {
            if ($('#theme-css').attr('href') !== '/media/css/site.css') $('#theme-css').attr('href','/media/css/site.css');
            if ($('#hero-css').attr('href') !== cssPath + '.dark.css') $('#hero-css').attr('href', cssPath + '.dark.css');
            $("#theme-select").val('dark');
        }
        $('#theme-select').change( function() {
            var expiration_date = 365*24*60*60*1000;
            if ($(this).val() == 'light') {
                $('#theme-css').attr('href','/media/css/site-light.css');
                $('#hero-css').attr('href', cssPath + '.light.css');
                var d = new Date();
                d.setTime(d.getTime() + expiration_date);
                document.cookie = 'theme=light;path=/;expires='+d.toGMTString()+';max-age='+expiration_date+';';
            }
            else {
                $('#theme-css').attr('href','/media/css/site.css');
                $('#hero-css').attr('href', cssPath + '.dark.css');
                var d = new Date();
                d.setTime(d.getTime() + expiration_date);
                document.cookie = 'theme=dark;path=/;expires='+d.toGMTString()+';max-age='+expiration_date+';';
            }
        });
        function readCookie(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
        }
        
        hc = new HEROCALCULATOR.HEROCALCULATOR();
        var lastUpdate = "#DEV_BUILD";
        $('#last-update').text(lastUpdate);
        hc.init("/media/js/herodata.json","/media/js/itemdata.json","/media/js/unitdata.json");
   
        $('.error-warning-view, .error-warning-close').click(function () {
            $('.error-warning').fadeOut(200);
        });

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

                if (hc && hc.heroCalculator) {
                    try {
                        payload.heroCalcState = hc.heroCalculator.getSaveData();
                    }
                    catch (e) {
                        rollbar.error("window.onerror getSaveData failed.", e);
                    }
                    try {
                        payload.appState = hc.heroCalculator.getAppState();
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
    });
});