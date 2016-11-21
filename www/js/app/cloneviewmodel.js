var ko = require('knockout');
var my = require("dota-hero-calculator-library");

my.prototype.CloneViewModel = function (h, p) {
    var self = this;
    my.prototype.CloneModel.call(this, h, p);
    self.bound = ko.observable(false);
    
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
my.prototype.CloneViewModel.prototype = Object.create(my.prototype.CloneModel.prototype);
my.prototype.CloneViewModel.prototype.constructor = my.prototype.CloneViewModel;