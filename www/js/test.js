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
        'QUnit': 'lib/qunit-2.0.1'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery']
        },
        'QUnit': {
            exports: 'QUnit',
            init: function() {
                QUnit.config.autoload = false;
                QUnit.config.autostart = false;
        }
       } 
    },
    waitSeconds: 7
});

require(['QUnit', 'herocalc'], function (QUnit, HEROCALCULATOR) {

    hc = new HEROCALCULATOR.HEROCALCULATOR();
    hc.init("/media/js/herodata.json","/media/js/itemdata.json","/media/js/unitdata.json", function () {
        require(['tests/abilityDataTest'], function (abilityDataTest) {
            abilityDataTest.run();

            QUnit.load();
            QUnit.start();
        });
    });
});