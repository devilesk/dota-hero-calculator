"use strict";
var ko = require('knockout');
var HeroCalc = require("dota-hero-calculator-library");
var DamageAmpViewModel = require("./DamageAmpViewModel");
var BuildExplorerViewModel = require("./BuildExplorerViewModel");
var HeroDamageAmpMixin = require("./HeroDamageAmpMixin");
var illusionOptionsArray = require("dota-hero-calculator-library/src/herocalc/illusion/illusionOptionsArray");
var illusionData = require("dota-hero-calculator-library/src/herocalc/illusion/illusionData");
var IllusionViewModel = require("./IllusionViewModel");

var HeroOption2 = function (hero) {
    this.heroName = ko.computed(function () {
        return hero.selectedHero().heroName;
    });
    this.heroDisplayName = ko.computed(function () {
        return hero.selectedHero().heroDisplayName;
    });
    this.hero = hero;
};

var HeroViewModel = function (h) {
    var self = this;
    self.index = ko.observable(h);
    self.availableHeroes = ko.observableArray(HeroCalc.HeroOptions);
    self.availableHeroes.sort(function (left, right) {
        return left.heroDisplayName == right.heroDisplayName ? 0 : (left.heroDisplayName < right.heroDisplayName ? -1 : 1);
    });
    self.selectedHero = ko.observable(self.availableHeroes()[h]);
    
    HeroCalc.HeroModel.call(this, self.selectedHero().heroName);
    
    self.selectedHero.subscribe(function (newValue) {
        self.heroId(newValue.heroName);
    });
    
    self.illusions = ko.observableArray([]);
    self.availableIllusions = ko.observableArray(illusionOptionsArray);
    self.selectedIllusion = ko.observable(self.availableIllusions()[0]);
    self.illusionAbilityLevel = ko.observable(1);
    self.illusionAbilityMaxLevel = ko.computed(function () {
        return illusionData[self.selectedIllusion().illusionName].max_level;
    });
    self.addIllusion = function (data, event) {
        self.illusions.push(ko.observable(new IllusionViewModel(0, self, self.illusionAbilityLevel())));
    };
    
    self.bound = ko.observable(false);
    self.playerColorCss = ko.computed(function () {
        return 'player-color-' + self.index();
    });
    self.heroOption = new HeroOption2(self);
    self.otherHeroes = ko.observableArray([]);
    self.availableCompare = ko.computed(function () {
        return self.otherHeroes().map(function (o) {
            return o.heroOption;
        });
    });
    self.selectedCompare = ko.observable();
    self.selectedCompare.subscribe(function (newValue) {
        self.heroCompare(newValue.hero);
    });
    self.enemies = ko.observableArray([]);
    self.availableEnemies = ko.computed(function () {
        return self.enemies().map(function (o) {
            return o.heroOption;
        });
    });
    self.selectedEnemy = ko.observable();
    self.selectedEnemy.subscribe(function (newValue) {
        self.enemy(newValue.hero);
    });
    self.setHeroOptionStyling = function(option, item) {
        ko.applyBindingsToNode(option, {css: item.hero.playerColorCss() }, item);
    }
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
    
    self.damageAmplification = new DamageAmpViewModel();
    self.damageReduction = new DamageAmpViewModel();
    self.buildExplorer = new BuildExplorerViewModel(self);
    HeroDamageAmpMixin(self);
}
HeroViewModel.prototype = Object.create(HeroCalc.HeroModel.prototype);
HeroViewModel.prototype.constructor = HeroViewModel;

module.exports = HeroViewModel;