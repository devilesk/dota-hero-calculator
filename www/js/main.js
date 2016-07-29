require.config({
    packages: ["herocalc", "components"],
    paths: {
        'knockout': '//cdnjs.cloudflare.com/ajax/libs/knockout/3.4.0/knockout-min',
        'underscore': '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min',
        'jquery': '//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min',
        'knockout-mapping': '//cdnjs.cloudflare.com/ajax/libs/knockout.mapping/2.4.1/knockout.mapping',
        'chartjs': '//cdnjs.cloudflare.com/ajax/libs/Chart.js/1.0.1/Chart.min',
        'bootstrap': '//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min',
        'jquery-ui': 'lib/jquery-ui',
        'chartjs-scatter': 'lib/Chart.scatter',
        'text': 'lib/text',
        'polyfill': 'herocalc/polyfill',
        'errorTracker': 'errorTracker',
        'herocalc_knockout': 'herocalc/herocalc_knockout',
        'jquery-ui.custom': 'herocalc/jquery-ui.custom',
        'rollbar': 'lib/rollbar.umd.nojson.min'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery']
        }
    }
});

require(['errorTracker'], function (errorTracker) {
    var rollbar = errorTracker.rollbar;
    require(['jquery', 'herocalc'], function ($, HEROCALCULATOR) {
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
                try {
                    var log = document.querySelector('#log');
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
                        log.removeChild(el);
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
                    
                    log.appendChild(el);
                    
                    $('.error-warning').fadeOut(200).fadeIn(100);
                }
                catch (e) {
                    rollbar.error("window.onerror create error log failed.", e);
                }
                
                var payload = {};
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
                payload.userActions = errorTracker.userActions;
                rollbar.configure({
                  payload: {custom: payload}
                });
                
                return old.apply(this, arguments);
            }
        })(window.onerror);
    });
});