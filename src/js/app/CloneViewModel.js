"use strict";
var ko = require('knockout');
var HeroCalc = require("dota-hero-calculator-library");
var DamageAmpViewModel = require("./DamageAmpViewModel");
var HeroDamageAmpMixin = require("./HeroDamageAmpMixin");

var CloneViewModel = function (heroData, itemData, unitData, h, p) {
    var self = this;
    HeroCalc.CloneModel.call(this, heroData, itemData, h, p);
    self.bound = ko.observable(false);
    self.inventory = p.inventory;
    self.sectionDisplay = ko.observable({
        'inventory': ko.observable(true),
        'ability': ko.observable(true),
        'buff': ko.observable(true),
        'debuff': ko.observable(true),
        'damageamp': ko.observable(false),
        'illusion': ko.observable(false),
        'skillbuild': ko.observable(false),
        'skillbuild-skills': ko.observable(true),
        'skillbuild-items': ko.observable(true)
    });
    self.sectionDisplayToggle = function (section) {
        self.sectionDisplay()[section](!self.sectionDisplay()[section]());
    }
    self.showUnitTab = ko.observable(false);
    self.showDiff = ko.observable(false);
    self.showCriticalStrikeDetails = ko.observable(false);
    self.showDamageDetails = ko.observable(false);
    self.showStatDetails = ko.observable(false);
    self.showDamageAmpCalcDetails = ko.observable(false);
    
    self.damageAmplification = new DamageAmpViewModel(heroData, itemData, unitData);
    self.damageReduction = new DamageAmpViewModel(heroData, itemData, unitData);
    HeroDamageAmpMixin(self);
}
CloneViewModel.prototype = Object.create(HeroCalc.CloneModel.prototype);
CloneViewModel.prototype.constructor = CloneViewModel;

module.exports = CloneViewModel;