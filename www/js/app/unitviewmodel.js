var ko = require('knockout');
var my = require("../herocalc/main");

my.prototype.UnitViewModel = function (h, p) {
    var self = this;
    self.index = ko.observable(h);
    self.selectedUnitLevel = ko.observable(1);
    self.availableUnits = ko.observableArray([
        new my.prototype.UnitOption('npc_dota_lone_druid_bear', 'Lone Druid Spirit Bear',4,'/media/images/units/spirit_bear.png', self.selectedUnitLevel),
        new my.prototype.UnitOption('npc_dota_brewmaster_earth_','Brewmaster Earth Warrior',3,'/media/images/units/npc_dota_brewmaster_earth.png', self.selectedUnitLevel),
        new my.prototype.UnitOption('npc_dota_brewmaster_fire_','Brewmaster Fire Warrior',3,'/media/images/units/npc_dota_brewmaster_fire.png', self.selectedUnitLevel),
        new my.prototype.UnitOption('npc_dota_brewmaster_storm_','Brewmaster Storm Warrior',3,'/media/images/units/npc_dota_brewmaster_storm.png', self.selectedUnitLevel),
        new my.prototype.UnitOption('npc_dota_necronomicon_archer_','Necronomicon Archer',3,'/media/images/units/npc_dota_necronomicon_archer.png', self.selectedUnitLevel),
        new my.prototype.UnitOption('npc_dota_necronomicon_warrior_','Necronomicon Warrior',3,'/media/images/units/npc_dota_necronomicon_warrior.png', self.selectedUnitLevel),
        new my.prototype.UnitOption('npc_dota_lycan_wolf','Lycan Wolf',4,'/media/images/units/npc_dota_lycan_wolf.png', self.selectedUnitLevel),
        new my.prototype.UnitOption('npc_dota_visage_familiar','Visage Familiar',3,'/media/images/units/npc_dota_visage_familiar.png', self.selectedUnitLevel)
    ]);
    self.selectedUnit = ko.observable(self.availableUnits()[0]);
    my.prototype.UnitModel.call(this, self.selectedUnit().heroName());
    
    self.selectedUnitLevel.subscribe(function(newValue) {
        self.unitLevel(newValue);
        self.unitId(self.selectedUnit().heroName());
    });
    self.selectedUnit.subscribe(function(newValue) {
        if (newValue.heroName().indexOf('npc_dota_lone_druid_bear') != -1) {
            self.inventory.hasInventory(true);
            self.inventory.items.removeAll();
            self.inventory.activeItems.removeAll();
        }
        else {
            self.inventory.hasInventory(false);
            self.inventory.items.removeAll();
            self.inventory.activeItems.removeAll();
        }
        self.unitId(newValue.heroName());
    });
    
    
    self.bound = ko.observable(false);
    self.playerColorCss = ko.computed(function () {
        return 'player-color-' + self.index();
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

}
my.prototype.UnitViewModel.prototype = Object.create(my.prototype.UnitModel.prototype);
my.prototype.UnitViewModel.prototype.constructor = my.prototype.UnitViewModel;