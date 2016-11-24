'use strict';
var ko = require('./herocalc_knockout');

var BuffViewModel = require("dota-hero-calculator-library/src/herocalc/BuffViewModel");
var BuffOption = require("dota-hero-calculator-library/src/herocalc/buffs/BuffOption");
var findWhere = require("dota-hero-calculator-library/src/herocalc/util/findWhere");

var DamageAmpViewModel = function (a) {
    var self = BuffViewModel(ko.observableArray([]));
    self.availableBuffs = ko.observableArray([
        BuffOption('slardar', 'slardar_sprint'),
        BuffOption('undying', 'undying_flesh_golem'),
        BuffOption('chen', 'chen_penitence'),
        BuffOption('medusa', 'medusa_stone_gaze'),
        BuffOption('shadow_demon', 'shadow_demon_soul_catcher')
    ]);
    self.availableDebuffs = ko.observableArray([
        BuffOption('medusa', 'medusa_mana_shield'),
        //BuffOption('templar_assassin', 'templar_assassin_refraction'),
        //BuffOption('faceless_void', 'faceless_void_backtrack'),
        //BuffOption('nyx_assassin', 'nyx_assassin_spiked_carapace'),
        BuffOption('spectre', 'spectre_dispersion'),
        BuffOption('wisp', 'wisp_overcharge'),
        BuffOption('bristleback', 'bristleback_bristleback'),
        //BuffOption('abaddon', 'abaddon_borrowed_time'),
        //BuffOption('abaddon', 'abaddon_aphotic_shield'),
        //BuffOption('dazzle', 'dazzle_shallow_grave'),
        //BuffOption('treant', 'treant_living_armor'),
        BuffOption('kunkka', 'kunkka_ghostship')
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

module.exports = DamageAmpViewModel;