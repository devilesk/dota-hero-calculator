var Rollbar = require("rollbar-browser");
var $ = require('jquery');
var HEROCALCULATOR = require('./app/main');
hc = new HEROCALCULATOR();
var lastUpdate = "#DEV_BUILD";
$('#last-update').text(lastUpdate);
hc.init("/media/js/herodata.json","/media/js/itemdata.json","/media/js/unitdata.json", hc.run);

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