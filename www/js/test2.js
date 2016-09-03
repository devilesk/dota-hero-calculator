'use strict';
var ko = require('./app/herocalc_knockout');
var $ = require('jquery');
global.jQuery = $;
require('bootstrap');

var HeroCalc = require("./herocalc/main");
var hc = new HeroCalc();
hc.init("/media/js/herodata.json","/media/js/itemdata.json","/media/js/unitdata.json", function () {
    console.log('HeroCalc', HeroCalc.prototype);
    
    function ViewModel() {
        var self = this;
        self.selectedHeroLevel = ko.observable(1);
        self.selectedHeroLevel.subscribe(function (newValue) {
                console.log('newValue', newValue);
                self.hero.selectedHeroLevel(parseInt(newValue));
        });
        self.hero = new HeroCalc.prototype.HeroModel('axe');
        console.log('hero', self.hero);
        self.test = ko.computed(function () {
            return 'test';
        });
        console.log('test', self.test);
        console.log('totalAgi', self.hero.totalAgi);
    }
    
    var vm = new ViewModel();
    console.log('vm', vm);
    ko.applyBindings(vm);
    console.log('done');
});
