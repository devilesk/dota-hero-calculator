var ko = require('knockout');
var my = require("../herocalc/main");
require("./herocalc_hero_damageamp");
require("./herocalc_buffs.amplification.reduction");

my.prototype.HeroOption2 = function (hero) {
    this.heroName = ko.computed(function () {
        return hero.selectedHero().heroName;
    });
    this.heroDisplayName = ko.computed(function () {
        return hero.selectedHero().heroDisplayName;
    });
    this.hero = hero;
};

my.prototype.HeroCalculatorModel = function (h) {
    var self = this;
    self.index = ko.observable(h);
    self.availableHeroes = ko.observableArray(my.prototype.HeroOptions);
    self.availableHeroes.sort(function (left, right) {
        return left.heroDisplayName == right.heroDisplayName ? 0 : (left.heroDisplayName < right.heroDisplayName ? -1 : 1);
    });
    self.selectedHero = ko.observable(self.availableHeroes()[h]);
    
    my.prototype.HeroModel.call(this, self.selectedHero().heroName);
    
    self.selectedHero.subscribe(function (newValue) {
        self.heroId(newValue.heroName);
    });
    
    
    self.bound = ko.observable(false);
    self.playerColorCss = ko.computed(function () {
        return 'player-color-' + self.index();
    });
    self.heroOption = new my.prototype.HeroOption2(self);
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
    
    self.damageAmplification = new my.prototype.DamageAmpViewModel();
    self.damageReduction = new my.prototype.DamageAmpViewModel();
    
    my.prototype.HeroDamageAmpMixin(self);
}
my.prototype.HeroCalculatorModel.prototype = Object.create(my.prototype.HeroModel.prototype);
my.prototype.HeroCalculatorModel.prototype.constructor = my.prototype.HeroCalculatorModel;