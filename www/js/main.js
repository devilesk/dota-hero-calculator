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

require(['rollbar'], function (Rollbar) {
    var rollbar = Rollbar.init(rollbarConfig);
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
    });
});