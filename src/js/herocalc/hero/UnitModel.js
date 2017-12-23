'use strict';
var ko = require('../herocalc_knockout');

var AbilityModel = require("../AbilityModel");
var HeroModel = require("./HeroModel");
var StatModel = require("../StatModel");

var UnitModel = function (heroData, itemData, unitData, h, p) {
    var self = this;
    HeroModel.call(this, heroData, itemData, 'abaddon');
    self.parent = p;
    self.unitId = ko.observable(h);
    self.unitLevel = ko.observable(1);

    self.heroData = ko.pureComputed(function() {
        return unitData[self.unitId()];
    });
    self.getAbilityLevelMax = function(data) {
        if (data.abilitytype == 'DOTA_ABILITY_TYPE_ATTRIBUTES') {
            return 10;
        }
        else if (data.name == 'necronomicon_archer_mana_burn' || data.name == 'necronomicon_archer_aoe'
            || data.name == 'necronomicon_warrior_mana_burn' || data.name == 'necronomicon_warrior_last_will') {
            return 3;
        }
        else if (data.name == 'necronomicon_warrior_sight') {
            return 1;
        }
        else {
            return 4;
        }
    };
    self.availableSkillPoints.dispose();
    self.ability = ko.computed(function() {
        var a = new AbilityModel(ko.observableArray(JSON.parse(JSON.stringify(self.heroData().abilities))), self);
        a.hasScepter = self.inventory.hasScepter
        switch (self.unitId()) {
            case 'npc_dota_necronomicon_archer_1':
            case 'npc_dota_necronomicon_warrior_1':
                a.abilities()[0].level(1);
                a.abilities()[1].level(1);
            break;
            case 'npc_dota_necronomicon_archer_2':
            case 'npc_dota_necronomicon_warrior_2':
                a.abilities()[0].level(2);
                a.abilities()[1].level(2);
            break;
            case 'npc_dota_necronomicon_archer_3':
                a.abilities()[0].level(3);
                a.abilities()[1].level(3);
            break;
            case 'npc_dota_necronomicon_warrior_3':
                a.abilities()[0].level(3);
                a.abilities()[1].level(3);
                a.abilities()[2].level(1);
            break;
        }
        a.levelUpAbility = function(index, data, event, hero) {
            var i = ko.utils.unwrapObservable(index);
            switch (a.abilities()[i].name) {
                case 'necronomicon_archer_mana_burn':
                case 'necronomicon_archer_aoe':
                case 'necronomicon_warrior_mana_burn':
                case 'necronomicon_warrior_last_will':
                case 'necronomicon_warrior_sight':
                break;
                default:
                    if (a.abilities()[i].level() < hero.getAbilityLevelMax(data)) {
                        a.abilities()[i].level(a.abilities()[i].level()+1);
                    }                    
                break;
            }

        };
        a.levelDownAbility = function(index, data, event, hero) {            
            var i = ko.utils.unwrapObservable(index);
            switch (a.abilities()[i].name) {
                case 'necronomicon_archer_mana_burn':
                case 'necronomicon_archer_aoe':
                case 'necronomicon_warrior_mana_burn':
                case 'necronomicon_warrior_last_will':
                case 'necronomicon_warrior_sight':
                break;
                default:
                    if (a.abilities()[i].level()>0) {
                        a.abilities()[i].level(a.abilities()[i].level()-1);
                    }
                break;
            }
        };
        return a;
    });        
    self.primaryAttribute = ko.computed(function() {
        //var v = unitData[self.unitId()].attributeprimary;
        var v = 0;
        if (v == 'DOTA_ATTRIBUTE_AGILITY') {
            return 'agi'
        }
        else if (v == 'DOTA_ATTRIBUTE_INTELLECT') {
            return 'int'
        }
        else if (v == 'DOTA_ATTRIBUTE_STRENGTH') {
            return 'str'
        }
        else {
            return ''
        }
    });
    self.totalAttribute = function(a) {
        if (a == 'agi') {
            return parseFloat(self.totalAgi().total);
        }
        if (a == 'int') {
            return parseFloat(self.totalInt().total);
        }
        if (a == 'str') {
            return parseFloat(self.totalStr().total);
        }
        return 0;
    };
    self.totalAgi = ko.computed(function() {
        var s = new StatModel(unitData[self.unitId()].attributebaseagility, 'Base');
        s.add(unitData[self.unitId()].attributeagilitygain * (self.selectedHeroLevel() - 1), 'Level')
            .concat(self.ability().getAgility())
            .concat(self.enemy().ability().getAllStatsReduction())
            .concat(self.debuffs.getAllStatsReduction())
        return s;
    });
    self.totalInt = ko.computed(function() {
        var s = new StatModel(unitData[self.unitId()].attributebaseintelligence, 'Base');
        s.add(unitData[self.unitId()].attributeintelligencegain * (self.selectedHeroLevel() - 1), 'Level')
            .concat(self.ability().getIntelligence())
            .concat(self.enemy().ability().getAllStatsReduction())
            .concat(self.debuffs.getAllStatsReduction())
        return s;
    });
    self.totalStr = ko.computed(function() {
        var s = new StatModel(unitData[self.unitId()].attributebasestrength, 'Base');
        s.add(unitData[self.unitId()].attributestrengthgain * (self.selectedHeroLevel() - 1), 'Level')
            .concat(self.ability().getStrength())
            .concat(self.enemy().ability().getStrengthReduction())
            .concat(self.enemy().ability().getAllStatsReduction())
            .concat(self.debuffs.getAllStatsReduction())
        return s;
    });
    self.baseDamage = ko.computed(function() {
        return [Math.floor(unitData[self.unitId()].attackdamagemin + self.totalAttribute(self.primaryAttribute()) + self.ability().getBaseDamage().total),
                Math.floor(unitData[self.unitId()].attackdamagemax + self.totalAttribute(self.primaryAttribute()) + self.ability().getBaseDamage().total)];
    });
    self.totalMagicResistanceProduct = ko.computed(function() {
        return (1 - unitData[self.unitId()].magicalresistance / 100) 
                   * (1 - self.inventory.getMagicResist() / 100) 
                   * (1 - self.ability().getMagicResist() / 100) 
                   * (1 - self.buffs.getMagicResist() / 100) 
                   * self.enemy().inventory.getMagicResistReduction()
                   * self.enemy().ability().getMagicResistReduction() 
                   * self.debuffs.getMagicResistReduction();
    });
    self.totalMagicResistance = ko.computed(function() {
        return (1 - self.totalMagicResistanceProduct());
    });
    self.bat = ko.computed(function() {
        var abilityBAT = self.ability().getBAT();
        if (abilityBAT > 0) {
            return abilityBAT;
        }
        return unitData[self.unitId()].attackrate;
    });
    self.attackTime = ko.computed(function() {
        return (self.bat() / (1 + self.ias() / 100)).toFixed(2);
    });
    self.attacksPerSecond = ko.computed(function() {
        return (1 + self.ias() / 100) / self.bat();
    });
    self.evasion = ko.computed(function() {
        var e = self.ability().setEvasion();
        if (e) {
            return (e * 100).toFixed(2) + '%';
        }
        else {
            return ((1-(self.inventory.getEvasion() * self.ability().getEvasion())) * 100).toFixed(2) + '%';
        }
    });
    self.ehpPhysical = ko.computed(function() {
        return ((self.health().total * (1 + .06 * self.totalArmorPhysical())) / (1-(1-(self.inventory.getEvasion() * self.ability().getEvasion())))).toFixed(2);
    });
    self.ehpMagical = ko.computed(function() {
        return (self.health().total / self.totalMagicResistanceProduct()).toFixed(2);
    });
    self.heroId(h);
    self.unitId.subscribe(function (newValue) {
        self.heroId(newValue);
    });
    return self;
}
UnitModel.prototype = Object.create(HeroModel.prototype);
UnitModel.prototype.constructor = UnitModel;

module.exports = UnitModel;