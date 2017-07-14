'use strict';
var ko = require('./herocalc_knockout');

var BuffViewModel = require("../herocalc/BuffViewModel");
var BuffModel = require("../herocalc/buffs/BuffModel");
var findWhere = require("../herocalc/util/findWhere");

var DamageAmpViewModel = function (heroData, itemData, unitData, a) {
    var self = this;
    BuffViewModel.call(this, itemData, ko.observableArray([]));
    self.availableBuffs = ko.observableArray([
        new BuffModel(heroData, unitData, 'slardar', 'slardar_sprint'),
        new BuffModel(heroData, unitData, 'undying', 'undying_flesh_golem'),
        new BuffModel(heroData, unitData, 'chen', 'chen_penitence'),
        new BuffModel(heroData, unitData, 'medusa', 'medusa_stone_gaze'),
        new BuffModel(heroData, unitData, 'shadow_demon', 'shadow_demon_soul_catcher')
    ]);
    self.availableDebuffs = ko.observableArray([
        new BuffModel(heroData, unitData, 'medusa', 'medusa_mana_shield'),
        //new BuffModel(heroData, unitData, 'templar_assassin', 'templar_assassin_refraction'),
        //new BuffModel(heroData, unitData, 'faceless_void', 'faceless_void_backtrack'),
        //new BuffModel(heroData, unitData, 'nyx_assassin', 'nyx_assassin_spiked_carapace'),
        new BuffModel(heroData, unitData, 'spectre', 'spectre_dispersion'),
        new BuffModel(heroData, unitData, 'wisp', 'wisp_overcharge'),
        new BuffModel(heroData, unitData, 'bristleback', 'bristleback_bristleback'),
        //new BuffModel(heroData, unitData, 'abaddon', 'abaddon_borrowed_time'),
        //new BuffModel(heroData, unitData, 'abaddon', 'abaddon_aphotic_shield'),
        //new BuffModel(heroData, unitData, 'dazzle', 'dazzle_shallow_grave'),
        //new BuffModel(heroData, unitData, 'treant', 'treant_living_armor'),
        new BuffModel(heroData, unitData, 'kunkka', 'kunkka_ghostship')
    ]);
    self.selectedBuff = ko.observable(self.availableBuffs()[0]);
    
    self.buffs = ko.observableArray([]);

    self.getAbilityDamageAmpValue = function (abilityName, attributeName) {
        var a = findWhere(self.buffs(), {name: abilityName});
        if (a == undefined) {
            return 0;
        }
        else {
            var ability = a.data;
            return self.getAbilityAttributeValue(ability.attributes, attributeName, ability.level());
        }
    }
    
    self.getDamageMultiplierSources = ko.computed(function () {
        var sources = {};
        for (var i = 0; i < self.abilities().length; i++) {
            var ability = self.abilities()[i];
                if (ability.level() > 0 && (ability.isActive() || (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                    switch (ability.name) {
                        case 'bristleback_bristleback':
                            sources[ability.name] = {
                                'multiplier': ability.damageReduction() / 100,
                                'damageType': 'physical',
                                'displayname': ability.displayname
                            }
                        break;
                        case 'slardar_sprint':
                            sources[ability.name] = {
                                'multiplier': self.getAbilityAttributeValue(ability.attributes, 'bonus_damage', ability.level()) / 100,
                                'damageType': 'physical',
                                'displayname': ability.displayname
                            }
                        break;
                        case 'undying_flesh_golem':
                            sources[ability.name] = {
                                'multiplier': ability.damageAmplification() / 100,
                                'damageType': 'physical',
                                'displayname': ability.displayname
                            }
                        break;
                        case 'medusa_stone_gaze':
                            sources[ability.name] = {
                                'multiplier': self.getAbilityAttributeValue(ability.attributes, 'bonus_physical_damage', ability.level()) / 100,
                                'damageType': 'physical',
                                'displayname': ability.displayname
                            }
                        break;
                        case 'chen_penitence':
                            sources[ability.name] = {
                                'multiplier': self.getAbilityAttributeValue(ability.attributes, 'bonus_damage_taken', ability.level()) / 100,
                                'damageType': 'physical',
                                'displayname': ability.displayname
                            }
                        break;
                        case 'shadow_demon_soul_catcher':
                            sources[ability.name] = {
                                'multiplier': self.getAbilityAttributeValue(ability.attributes, 'bonus_damage_taken', ability.level()) / 100,
                                'damageType': 'pure',
                                'displayname': ability.displayname
                            }
                        break;
                        case 'medusa_mana_shield':
                            sources[ability.name] = {
                                'multiplier': ability.damageReduction() / 100,
                                'damageType': 'physical',
                                'displayname': ability.displayname
                            }                            
                        break;
                        case 'spectre_dispersion':
                            sources[ability.name] = {
                                'multiplier': -self.getAbilityAttributeValue(ability.attributes, 'damage_reflection_pct', ability.level()) / 100,
                                'damageType': 'percentreduction',
                                'displayname': ability.displayname
                            }                                
                        break;
                        case 'abaddon_aphotic_shield':
                            sources[ability.name] = {
                                'multiplier': self.getAbilityAttributeValue(ability.attributes, 'damage_absorb', ability.level()),
                                'damageType': 'flatreduction',
                                'displayname': ability.displayname
                            }                                
                        break;
                        case 'kunkka_ghostship':
                            sources[ability.name] = {
                                'multiplier': -50 / 100,
                                'damageType': 'percentreduction',
                                'displayname': ability.displayname
                            }                                
                        break;
                        case 'wisp_overcharge':
                            sources[ability.name] = {
                                'multiplier': self.getAbilityAttributeValue(ability.attributes, 'bonus_damage_pct', ability.level()) / 100,
                                'damageType': 'percentreduction',
                                'displayname': ability.displayname
                            }                                
                        break;
                        /*case 'faceless_void_backtrack':
                            sources[ability.name] = {
                                'multiplier': -self.getAbilityAttributeValue(ability.attributes, 'dodge_chance_pct', ability.level()) / 100,
                                'damageType': 'percentreduction',
                                'displayname': ability.displayname
                            }                                
                        break;*/
                    }
                }
        }
        return sources;
    });
    
    return self;
}
DamageAmpViewModel.prototype = Object.create(BuffViewModel.prototype);
DamageAmpViewModel.prototype.constructor = DamageAmpViewModel;

module.exports = DamageAmpViewModel;