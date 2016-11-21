'use strict';
var ko = require('./herocalc_knockout');
    
var my = require("dota-hero-calculator-library");

my.prototype.DamageAmpViewModel = function (a) {
    var self = new my.prototype.BuffViewModel(ko.observableArray([]));
    self.availableBuffs = ko.observableArray([
        new my.prototype.BuffOption('slardar', 'slardar_sprint'),
        new my.prototype.BuffOption('undying', 'undying_flesh_golem'),
        new my.prototype.BuffOption('chen', 'chen_penitence'),
        new my.prototype.BuffOption('medusa', 'medusa_stone_gaze'),
        new my.prototype.BuffOption('shadow_demon', 'shadow_demon_soul_catcher')
    ]);
    self.availableDebuffs = ko.observableArray([
        new my.prototype.BuffOption('medusa', 'medusa_mana_shield'),
        //new my.prototype.BuffOption('templar_assassin', 'templar_assassin_refraction'),
        //new my.prototype.BuffOption('faceless_void', 'faceless_void_backtrack'),
        //new my.prototype.BuffOption('nyx_assassin', 'nyx_assassin_spiked_carapace'),
        new my.prototype.BuffOption('spectre', 'spectre_dispersion'),
        new my.prototype.BuffOption('wisp', 'wisp_overcharge'),
        new my.prototype.BuffOption('bristleback', 'bristleback_bristleback'),
        //new my.prototype.BuffOption('abaddon', 'abaddon_borrowed_time'),
        //new my.prototype.BuffOption('abaddon', 'abaddon_aphotic_shield'),
        //new my.prototype.BuffOption('dazzle', 'dazzle_shallow_grave'),
        //new my.prototype.BuffOption('treant', 'treant_living_armor'),
        new my.prototype.BuffOption('kunkka', 'kunkka_ghostship')
    ]);
    self.selectedBuff = ko.observable(self.availableBuffs()[0]);
    
    self.buffs = ko.observableArray([]);

    self.getAbilityDamageAmpValue = function (abilityName, attributeName) {
        var a = my.prototype.findWhere(self.buffs(), {name: abilityName});
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