var cooldownTalents = require('../talents/cooldownTalents.json');
var talentAbilityMap = require('./talentAbilityMap');
var StatModel = require("../StatModel");

module.exports = {
    getTalentById: function (talents, talentId) {
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name == talentId) {
                return ability;
            }
        }
    },
    getBonusDamage: function (talents) {
        var totalAttribute = 0;
        var sources = {};
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_attack_damage_')) {
                totalAttribute += ability.attributes[0].value[0];
                sources[ability.name] = {
                    'damage': ability.attributes[0].value[0],
                    'damageType': 'physical',
                    'displayname': ability.displayname
                }
            }
        }
        return { sources: sources, total: totalAttribute };
    },
    getHealth: function (talents) {
        var sources = new StatModel();
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_hp_') && !ability.name.startsWith('special_bonus_hp_regen_')) {
                sources.add(ability.attributes[0].value[0], ability.displayname);
            }
        }
        return sources;
    },
    getHealthRegen: function (talents) {
        var sources = new StatModel();
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_hp_regen_')) {
                sources.add(ability.attributes[0].value[0], ability.displayname);
            }
        }
        return sources;
    },
    getMana: function (talents) {
        var sources = new StatModel();
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_mp_') && !ability.name.startsWith('special_bonus_mp_regen_')) {
                sources.add(ability.attributes[0].value[0], ability.displayname);
            }
        }
        return sources;
    },
    getManaRegen: function (talents) {
        var sources = new StatModel();
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_mp_regen_')) {
                sources.add(ability.attributes[0].value[0], ability.displayname);
            }
        }
        return sources;
    },
    getArmor: function (talents) {
        var sources = new StatModel();
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_armor_')) {
                sources.add(ability.attributes[0].value[0], ability.displayname);
            }
        }
        return sources;
    },
    getSpellAmp: function (talents) {
        var sources = new StatModel();
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_spell_amplify_')) {
                sources.add(ability.attributes[0].value[0]/100, ability.displayname);
            }
        }
        return sources;
    },
    getUniqueCooldownReductionFlat: function (talents) {
        var totalAttribute = {};
        for (var i = 0; i < talents.length; i++) {
            var talent = talents[i];
            if (cooldownTalents.indexOf(talent.name) != -1) {
                var abilities = [].concat(talentAbilityMap[talent.name]);
                abilities.forEach(function (ability) {
                    totalAttribute[ability] = talent.attributes[0].value[0];
                });
            }
        }
        return totalAttribute;
    },
    getCooldownReductionFlat: function (talents) {
        var totalAttribute = 0;
        return totalAttribute;
    },
    getCooldownReductionPercent: function (talents) {
        var totalAttribute = 1;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_cooldown_reduction_')) {
                totalAttribute *= (1 - ability.attributes[0].value[0]/100);
            }
        }
        return totalAttribute;
    },
    getCooldownIncreaseFlat: function (talents) {
        var totalAttribute = 0;
        return totalAttribute;
    },
    getCooldownIncreasePercent: function (talents) {
        var totalAttribute = 1;
        return totalAttribute;
    },
    getMovementSpeedFlat: function (talents) {
        var totalAttribute = 0;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_movement_speed_')) {
                totalAttribute += ability.attributes[0].value[0];
            }
        }
        return totalAttribute;
    },
    getAttackRange: function (talents) {
        var totalAttribute = 0;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_attack_range_')) {
                totalAttribute += ability.attributes[0].value[0];
            }
        }
        return totalAttribute;
    },
    getAttackSpeed: function (talents) {
        var totalAttribute = 0;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_attack_speed_')) {
                totalAttribute += ability.attributes[0].value[0];
            }
        }
        return totalAttribute;
    },
    getLifesteal: function (talents) {
        var totalAttribute = 0;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_lifesteal_')) {
                totalAttribute += ability.attributes[0].value[0];
            }
        }
        return totalAttribute;
    },
    getEvasion: function (talents) {
        var totalAttribute = 1;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_evasion_')) {
                totalAttribute *= (1 - ability.attributes[0].value[0]/100);
            }
        }
        return totalAttribute;
    },
    getMagicResist: function (talents) {
        var totalAttribute = 1;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_magic_resistance_')) {
                totalAttribute *= (1 - ability.attributes[0].value[0]/100);
            }
        }
        return totalAttribute;
    },
    getRespawnReduction: function (talents) {
        var totalAttribute = 0;
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_respawn_reduction_')) {
                totalAttribute += ability.attributes[0].value[0];
            }
        }
        return totalAttribute;
    },
    getStrength: function (talents) {
        var sources = new StatModel();
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_strength_')) {
                sources.add(ability.attributes[0].value[0], ability.displayname);
            }
            else if (ability.name.startsWith('special_bonus_all_stats_')) {
                sources.add(ability.attributes[0].value[0], ability.displayname);
            }
        }
        return sources;
    },
    getAgility: function (talents) {
        var sources = new StatModel();
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_agility_')) {
                sources.add(ability.attributes[0].value[0], ability.displayname);
            }
            else if (ability.name.startsWith('special_bonus_all_stats_')) {
                sources.add(ability.attributes[0].value[0], ability.displayname);
            }
        }
        return sources;
    },
    getIntelligence: function (talents) {
        var sources = new StatModel();
        for (var i = 0; i < talents.length; i++) {
            var ability = talents[i];
            if (ability.name.startsWith('special_bonus_intelligence_')) {
                sources.add(ability.attributes[0].value[0], ability.displayname);
            }
            else if (ability.name.startsWith('special_bonus_all_stats_')) {
                sources.add(ability.attributes[0].value[0], ability.displayname);
            }
        }
        return sources;
    }
}