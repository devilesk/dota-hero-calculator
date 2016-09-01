var $ = require('jquery');
var HEROCALCULATOR = require('./app/main');
hc = new HEROCALCULATOR();
var lastUpdate = "#DEV_BUILD";
$('#last-update').text(lastUpdate);
hc.init("/media/js/herodata.json","/media/js/itemdata.json","/media/js/unitdata.json", hc.run);