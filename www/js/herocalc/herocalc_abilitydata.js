'use strict';
    
var my = require("./herocalc_core");

my.prototype.abilityData = {
    'alchemist_acid_spray': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'armor_reduction',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return -a;
            },
            returnProperty: 'armorReduction'
        }
    ],
    'alchemist_unstable_concoction': [
        {
            label: 'Brew Time',
            controlType: 'input'
        },
        {
            attributeName: 'max_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a/5;
            }
        },
        {
            attributeName: 'max_stun',
            label: 'Total Stun',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a/5;
            }
        }
    ],
    'ancient_apparition_cold_feet': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'stun_duration',
            label: 'Total Stun',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            }
        }
    ],
    'ancient_apparition_ice_blast': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'dot_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')+v*a;
            }
        }
    ],
    'antimage_mana_void': [
        {
            label: 'Enemy Missing Mana',
            controlType: 'input'
        },
        {
            attributeName: 'mana_void_damage_per_mana',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'axe_battle_hunger': [
        {
            label: 'Battle Hungered Enemies',
            controlType: 'input'
        },
        {
            attributeName: 'speed_bonus',
            label: 'Movement Speed Bonus',
            controlType: 'text',
            noLevel: true,
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'movementSpeedPct'
        },
        {
            attributeName: 'slow',
            label: 'Movement Speed Bonus',
            controlType: 'text',
            noLevel: true,
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'bane_nightmare': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        }
    ],
    'bane_fiends_grip': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'Enemy Max Mana',
            controlType: 'input'
        },
        {
            attributeName: 'fiend_grip_damage',
            label: 'Total Damage',
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (parent.inventory.hasScepter()) {
                    return v[0]*abilityModel.getAbilityAttributeValue(ability.attributes, 'fiend_grip_damage_scepter',ability.level());
                }
                else {
                    return v[0]*a;
                }
            }
        },
        {
            attributeName: 'fiend_grip_mana_drain',
            label: 'Total Mana Drain',
            controlType: 'text',
            controls: [0,1],
            noLevel: true,
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (parent.inventory.hasScepter()) {
                    return v[0]*v[1]*abilityModel.getAbilityAttributeValue(ability.attributes, 'fiend_grip_mana_drain_scepter',ability.level())/100;
                }
                else {
                    return v[0]*v[1]*a/100;
                }
            }
        }
    ],
    'batrider_sticky_napalm': [
        {
            label: 'Stacks',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Bonus Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'bonusDamage'
        },
        {
            attributeName: 'movement_speed_pct',
            label: 'Enemy Movement Speed Slow',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'movementSpeedPctReduction'
        },
        {
            attributeName: 'turn_rate_pct',
            label: 'Enemy Turn Rate Slow',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'turnRateReduction'
        }
    ],
    'batrider_firefly': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage_per_second',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'bloodseeker_rupture': [
        {
            label: 'Enemy Distance Traveled',
            controlType: 'input'
        },
        {
            attributeName: 'movement_damage_pct',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage') + v*a/100;
            }
        }
    ],
    'bristleback_viscous_nasal_goo': [
        {
            label: 'Stacks',
            controlType: 'input'
        },
        {
            attributeName: 'armor_per_stack',
            label: 'Enemy Armor Reduction',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return -v*a;
            },
            returnProperty: 'armorReduction'
        },
        {
            attributeName: 'move_slow_per_stack',
            label: '%SLOW:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return -(abilityModel.getAbilityAttributeValue(ability.attributes, 'base_move_slow',0)+v*a);
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'bristleback_quill_spray': [
        {
            label: 'Stacks',
            controlType: 'input'
        },
        {
            attributeName: 'quill_stack_damage',
            label: 'DAMAGE',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var total = abilityModel.getAbilityAttributeValue(ability.attributes, 'quill_base_damage',ability.level())+v*a,
                damage_cap = abilityModel.getAbilityAttributeValue(ability.attributes, 'max_damage',0);
                if (total > damage_cap) {
                    total = damage_cap;
                }
                return total;
            }
        }
    ],
    'bristleback_bristleback': [
        {
            label: 'Damage From',
            controlType: 'radio',
            controlValueType: 'string',
            controlOptions: [
                {text: 'Back', value: 'back'},
                {text: 'Side', value: 'side'}
            ]
        },
        {
            attributeName: 'back_damage_reduction',
            label: '%DAMAGE REDUCTION:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var ability = abilityModel.abilities.find(function(b) {
                    return b.name == 'bristleback_bristleback';
                });
                if (v == 'back') {
                    var total = abilityModel.getAbilityAttributeValue(ability.attributes, 'back_damage_reduction', ability.level());
                }
                else {
                    var total = abilityModel.getAbilityAttributeValue(ability.attributes, 'side_damage_reduction', ability.level());
                }
                return -total;
            },
            returnProperty: 'damageReduction'
        }
    ],
    'bristleback_warpath': [
        {
            label: 'Stacks',
            controlType: 'input'
        },
        {
            attributeName: 'damage_per_stack',
            label: 'BONUS DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (v < 1) {
                    return 0;
                }
                else {
                    return abilityModel.getAbilityAttributeValue(ability.attributes, 'base_damage',ability.level())+(v-1)*a;
                }
            }
        },
        {
            attributeName: 'move_speed_per_stack',
            label: '%MOVEMENT:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (v < 1) {
                    return 0;
                }
                else {
                    return abilityModel.getAbilityAttributeValue(ability.attributes, 'base_move_speed',ability.level())+(v-1)*a;
                }
            },
            returnProperty: 'movementSpeedPct'
        }
    ],
    'centaur_return': [
        {
            label: 'Strength',
            controlType: 'input'
        },
        {
            attributeName: 'strength_pct',
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'return_damage',ability.level()) + v*a/100;
            }
        }
    ],
    'centaur_stampede': [
        {
            label: 'Strength',
            controlType: 'input'
        },
        {
            attributeName: 'strength_damage',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'slow_movement_speed',
            label: 'Enemy Movement Speed Slow',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return -a;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'clinkz_death_pact': [
        {
            label: 'Consumed Unit HP',
            controlType: 'input'
        },
        {
            attributeName: 'damage_gain_pct',
            label: 'BASE DAMAGE GAIN:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a/100;
            },
            returnProperty: 'baseDamage'
        },
        {
            attributeName: 'health_gain_pct',
            label: 'HEALTH GAIN:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a/100;
            },
            returnProperty: 'bonusHealth'
        }
    ],
    'crystal_maiden_frostbite': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        }
    ],
    'dark_seer_ion_shell': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage_per_second',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'dazzle_shadow_wave': [
        {
            label: 'Targets',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        }
    ],
    'dazzle_weave': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'armor_per_second',
            label: 'ARMOR',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'armor'
        },
        {
            attributeName: 'armor_per_second',
            label: 'ARMOR REDUCTION:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return -v*a;
            },
            returnProperty: 'armorReduction'
        }
    ],
    'death_prophet_exorcism': [
        {
            label: 'Damage Dealt',
            controlType: 'input'
        },
        {
            attributeName: 'heal_percent',
            label: 'Total Armor',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a/100;
            }
        }
    ],
    'disruptor_static_storm': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var damagevalue = 0.25 * (130 + 40 * ability.level()) * (1/20),
                mult = (v*4)*((v*4)+1)/2;
                return damagevalue * mult;
            }
        }
    ],
    'doom_bringer_scorched_earth': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage_per_second',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'bonus_movement_speed_pct',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedPct'
        },
        {
            attributeName: 'damage_per_second',
            label: 'HP REGEN:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'healthregen'
        }
    ],
    'doom_bringer_doom': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (parent.inventory.hasScepter()) {
                    return v*abilityModel.getAbilityAttributeValue(ability.attributes, 'damage_scepter',ability.level());
                }
                else {
                    return v*a;
                }
            }
        }
    ],
    'dragon_knight_elder_dragon_form': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'bonus_attack_range',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'attackrange'
        },
        {
            attributeName: 'bonus_movement_speed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedFlat'
        }
    ],
    'drow_ranger_trueshot': [
        {
            label: 'Drow\'s Agility',
            controlType: 'input',
            display: 'buff'
        },
        {
            attributeName: 'trueshot_ranged_damage',
            label: 'DAMAGE BONUS:',
            ignoreTooltip: true,
            controlType: 'text',
            display: 'buff',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a/100;
            },
            returnProperty: 'bonusDamagePrecisionAura'
        }
    ],
    'earth_spirit_rolling_boulder': [
        {
            label: 'Using Stone',
            controlType: 'checkbox'
        },
        {
            attributeName: 'move_slow',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (v) {
                    return -a;
                }
                else {
                    return 0;
                }
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'earthshaker_enchant_totem': [
        {
            label: 'Activated',
            controlType: 'checkbox'
        },
        {
            attributeName: 'totem_damage_percentage',
            label: 'DAMAGE',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (v) {
                    return a;
                }
                else {
                    return 0;
                }
            },
            returnProperty: 'baseDamageMultiplier'
        }
    ],
    'earthshaker_echo_slam': [
        {
            label: 'Enemies in Range',
            controlType: 'input'
        },
        {
            attributeName: 'echo_slam_echo_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'elder_titan_ancestral_spirit': [
        {
            label: 'HEROES PASSED THROUGH',
            controlType: 'input'
        },
        {
            label: 'CREEPS PASSED THROUGH',
            controlType: 'input'
        },
        {
            attributeName: 'damage_creeps',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v[0]*abilityModel.getAbilityAttributeValue(ability.attributes, 'damage_heroes',ability.level()) + v[1]*a;
            },
            returnProperty: 'bonusDamage'
        },
        {
            attributeName: 'move_pct_creeps',
            label: '%BONUS SPEED:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v[0]*abilityModel.getAbilityAttributeValue(ability.attributes, 'move_pct_heroes',ability.level()) + v[1]*a;
            },
            returnProperty: 'movementSpeedPct'
        }
    ],
    'elder_titan_earth_splitter': [
        {
            label: 'Enemy Max Health',
            controlType: 'input'
        },
        {
            attributeName: 'damage_pct',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a/100;
            }
        },
        {
            attributeName: 'slow_pct',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return -a;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'enchantress_natures_attendants': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'heal',
            label: 'HEAL:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'wisp_count',ability.level())*v*a;
            }
        }
    ],
    'enigma_malefice': [
        {
            label: 'Hits',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'stun_duration',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'enigma_midnight_pulse': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'Enemy Max Health',
            controlType: 'input'
        },
        {
            attributeName: 'damage_percent',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v[0]*v[1]*a/100;
            }
        }
    ],
    'enigma_black_hole': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'far_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'near_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'faceless_void_time_lock': [
        {
            label: 'In Chronosphere',
            controlType: 'checkbox'
        },
        {
            attributeName: 'bonus_damage',
            label: '%MOVESPEED AS DAMAGE',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (v) {
                    return a*2;
                }
                else {
                    return a;
                }
            },
            returnProperty: 'bashBonusDamage'
        },
        {
            attributeName: 'duration',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            }
        },
        {
            attributeName: 'chance_pct',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'bash'
        }
    ],
    'gyrocopter_rocket_barrage': [
        {
            label: 'Rockets',
            controlType: 'input'
        },
        {
            attributeName: 'rockets_per_second',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            }
        },
        {
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        }
    ],
/*        'gyrocopter_homing_missile': [
        {
            label: 'Distance Traveled',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'gyrocopter_flak_cannon': [
        {
            label: 'Attacks',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],*/
    'huskar_burning_spear': [
        {
            label: 'Stacks',
            controlType: 'input'
        },
        {
            attributeName: 'health_cost',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        }
    ],
    'huskar_berserkers_blood': [
        {
            label: '%HP',
            controlType: 'input'
        },
        {
            attributeName: 'hp_threshold_max',
            label: 'Health at given %HP:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return parent.health()*v/100;
            }
        },
        {
            attributeName: 'hp_threshold_max',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            }
        },
        {
            attributeName: 'maximum_resistance',
            label: 'MAGIC RESISTANCE BONUS:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var v = Math.min(v, 100);
                v = Math.max(v, 10);
                var hp_threshold_max = abilityModel.getAbilityAttributeValue(ability.attributes, 'hp_threshold_max',0);
                var d = 100 - hp_threshold_max;
                var c = (v - hp_threshold_max) / d;
                c = 1 - c;
                return c*a;
            },
            returnProperty: 'magicResist'
        },
        {
            attributeName: 'maximum_attack_speed',
            label: 'ATTACK SPEED BONUS:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var v = Math.min(v, 100);
                v = Math.max(v, 10);
                var hp_threshold_max = abilityModel.getAbilityAttributeValue(ability.attributes, 'hp_threshold_max',0);
                var d = 100 - hp_threshold_max;
                var c = (v - hp_threshold_max) / d;
                c = 1 - c;
                return c*a;
            },
            returnProperty: 'attackspeed'
        }
    ],
    'huskar_life_break': [
        {
            label: 'Enemy Current HP',
            controlType: 'input'
        },
        {
            attributeName: 'health_damage',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            label: 'Huskar Current HP',
            controlType: 'input'
        },
        {
            attributeName: 'health_cost_percent',
            label: 'DAMAGE TAKEN:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'movespeed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'invoker_quas': [
        {
            label: 'Instances',
            controlType: 'input'
        },
        {
            attributeName: 'bonus_strength',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'bonusStrength'
        },
        {
            attributeName: 'health_regen_per_instance',
            label: 'HP REGEN:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'healthregen'
        }
    ],
    'invoker_wex': [
        {
            label: 'Instances',
            controlType: 'input'
        },
        {
            attributeName: 'bonus_agility',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'bonusAgility'
        },
        {
            attributeName: 'move_speed_per_instance',
            label: '%MOVE SPEED:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'movementSpeedPct'
        },
        {
            attributeName: 'attack_speed_per_instance',
            label: '%ATTACK SPEED:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'attackspeed'
        }
    ],
    'invoker_exort': [
        {
            label: 'Instances',
            controlType: 'input'
        },
        {
            attributeName: 'bonus_intelligence',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'bonusInt'
        },
        {
            attributeName: 'bonus_damage_per_instance',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'bonusDamage'
        }
    ],
    'invoker_ghost_walk': [
        {
            label: 'Quas Level',
            controlType: 'input'
        },
        {
            attributeName: 'enemy_slow',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (v == 0) {
                    return 0;
                }
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'enemy_slow',v);
            },
            returnProperty: 'movementSpeedPctReduction'
        },
        {
            label: 'Wex Level',
            controlType: 'input',
            display: 'ability'
        },
        {
            attributeName: 'self_slow',
            label: 'Total Damage',
            controlType: 'text',
            display: 'ability',
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (v == 0) {
                    return 0;
                }
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'self_slow',v);
            },
            returnProperty: 'movementSpeedPct'
        }
    ],
    'invoker_alacrity': [
        {
            label: 'Wex Level',
            controlType: 'input'
        },
        {
            attributeName: 'bonus_attack_speed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (v == 0) {
                    return 0;
                }
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'bonus_attack_speed',v);
            },
            returnProperty: 'attackspeed'
        },
        {
            label: 'Exort Level',
            controlType: 'input',
        },
        {
            attributeName: 'bonus_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (v == 0) {
                    return 0;
                }
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'bonus_damage',v);
            },
            returnProperty: 'bonusDamage'
        }
    ],
    'invoker_ice_wall': [
        {
            label: 'Quas Level',
            controlType: 'input'
        },
        {
            attributeName: 'slow',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (v == 0) {
                    return 0;
                }
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'slow',v);
            },
            returnProperty: 'movementSpeedPctReduction'
        },
        {
            label: 'Exort Level',
            controlType: 'input',
            display: 'ability'
        },
        {
            label: 'Duration',
            controlType: 'input',
            display: 'ability'
        },
        {
            attributeName: 'damage_per_second',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            display: 'ability',
            controls: [1,2],
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (v[0] == 0) {
                    return 0;
                }
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'damage_per_second',v[0])*v[1];
            }
        }
    ],
    'jakiro_dual_breath': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*2 + 
                abilityModel.getAbilityAttributeValue(ability.attributes, 'burn_damage',ability.level())*v;
            }
        },
        {
            attributeName: 'slow_movement_speed_pct',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        },
        {
            attributeName: 'slow_attack_speed_pct',
            label: '%ATTACK SLOW:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'attackspeedreduction'
        }
    ],
    'jakiro_liquid_fire': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'slow_attack_speed_pct',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'attackspeedreduction'
        }
    ],
    'jakiro_macropyre': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'juggernaut_blade_fury': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        }
    ],
    'juggernaut_healing_ward': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'Max Health',
            controlType: 'input'
        },
        {
            attributeName: 'healing_ward_heal_amount',
            label: 'HEAL OVER TIME:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v[0]*v[1]*a/100;
            }
        }
    ],
    'juggernaut_omni_slash': [
        {
            label: 'Jumps',
            controlType: 'input'
        },
        {
            label: 'MIN DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'omni_slash_damage',1)*v;
            }
        },
        {
            label: 'MAX DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'omni_slash_damage',2)*v;
            }
        }
    ],
    'keeper_of_the_light_illuminate': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage_per_second',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'keeper_of_the_light_mana_leak': [
        {
            label: 'Distance Moved',
            controlType: 'input'
        },
        {
            label: 'Enemy Max Mana',
            controlType: 'input'
        },
        {
            attributeName: 'mana_leak_pct',
            label: 'MANA LEAKED:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v[0]/100*v[1]*a/100;
            }
        }
    ],
    'legion_commander_duel': [
        {
            label: 'Duel Wins',
            controlType: 'input'
        },
        {
            attributeName: 'reward_damage',
            label: 'Total Damage:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'bonusDamage'
        }
    ],
    'leshrac_pulse_nova': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'mana_cost_per_second',
            label: 'MANA COST:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'lich_chain_frost': [
        {
            label: 'Bounce Hits',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'slow_movement_speed',
            label: 'Enemy Movement Speed Slow',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        },
        {
            attributeName: 'slow_attack_speed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'attackspeedreduction'
        }
    ],
    'life_stealer_feast': [
        {
            label: 'Enemy Current HP',
            controlType: 'input'
        },
        {
            attributeName: 'hp_leech_percent',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a/100;
            },
            returnProperty: 'bonusDamage'
        }
    ],
    'life_stealer_open_wounds': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'heal_percent',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'lifesteal'
        },
        {
            attributeName: 'slow_steps',
            label: '%SLOW:',
            ignoreTooltip: true,
            controlType: 'text',
            noLevel: true,
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'slow_steps',v+1);
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'lina_fiery_soul': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'fiery_soul_move_speed_bonus',
            label: 'Enemy Movement Speed Slow',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'movementSpeedPct'
        },
        {
            attributeName: 'fiery_soul_attack_speed_bonus',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'attackspeed'
        }
    ],
    'lion_mana_drain': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'mana_per_second',
            label: 'MANA DRAINED:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'luna_moon_glaive': [
        {
            label: 'Damage',
            controlType: 'input'
        },
        {
            attributeName: 'damage_reduction_percent',
            label: 'BOUNCE DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var result = [];
                for (var i = 1; i < 6; i++) {
                    result.push((v*Math.pow(a/100,i)).toFixed(2))
                }
                return result.join('<br>');
            }
        }
    ],
    'luna_eclipse': [
        {
            label: 'Beam Count',
            controlType: 'input'
        },
        {
            attributeName: 'beams',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var lucentBeamAbility = abilityModel.abilities.find(function(b) {
                    return b.name == 'luna_lucent_beam';
                });
                if (lucentBeamAbility.level() == 0) return 0;
                var damage = abilityModel.getAbilityPropertyValue(lucentBeamAbility, 'damage');
                return v*damage;
            }
        }
    ],
    'medusa_mystic_snake': [
        {
            label: 'Jump Count',
            controlType: 'input'
        },
        {
            attributeName: 'snake_damage',
            label: 'Damage Per Jump:',
            ignoreTooltip: true,
            controlType: 'method',
            display: 'none',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var snake_jumps = abilityModel.getAbilityAttributeValue(ability.attributes, 'snake_jumps',ability.level());
                var snake_scale = abilityModel.getAbilityAttributeValue(ability.attributes, 'snake_scale',0);
                var damage = [];
                for (var i = 0; i < snake_jumps; i++) {
                    damage.push(a + a * i * snake_scale/100);
                }
                return damage;
            }
        },
        {
            attributeName: 'snake_damage',
            label: 'Damage Per Jump:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v[1].join(' / ');
            }
        },
        {
            attributeName: 'snake_damage',
            label: 'Total Damage:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v[1].slice(0, v[0]).reduce(function (memo, o) { return memo + o }, 0);
            }
        },
        {
            attributeName: 'snake_damage',
            label: 'Max Damage:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v[1].reduce(function (memo, o) { return memo + o }, 0);
            }
        }
    ],
    'medusa_mana_shield': [
        {
            label: 'Damage',
            controlType: 'input'
        },
        {
            attributeName: 'damage_per_mana',
            label: 'MANA USED:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return (v/a).toFixed(2);
            }
        },
        {
            attributeName: 'absorption_tooltip',
            label: '%DAMAGE REDUCTION:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return -a;
            },
            returnProperty: 'damageReduction'
        }
    ],
    'meepo_poof': [
        {
            label: 'Meepo Count',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        }
    ],
    'meepo_geostrike': [
        {
            label: 'Stacks',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        },
        {
            attributeName: 'slow',
            label: '%SLOW:',
            ignoreTooltip: true,
            controlType: 'text',
            noLevel: true,
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'slow',ability.level())*v;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'mirana_arrow': [
        {
            label: 'Arrow Travel Distance',
            controlType: 'input'
        },
        {
            attributeName: 'arrow_max_stun',
            label: 'STUN DURATION:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var arrow_min_stun = abilityModel.getAbilityAttributeValue(ability.attributes, 'arrow_min_stun',0);
                var arrow_max_stunrange = abilityModel.getAbilityAttributeValue(ability.attributes, 'arrow_max_stunrange',0);
                var scale = Math.min(v, arrow_max_stunrange) / arrow_max_stunrange;
                return Math.max(arrow_min_stun, Math.floor(a * scale / 0.1) * 0.1);
            }
        },
        {
            attributeName: 'arrow_bonus_damage',
            label: 'TOTAL DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var ability = ability;
                var damage = ability.damage()[ability.level()-1];
                var arrow_max_stunrange = abilityModel.getAbilityAttributeValue(ability.attributes, 'arrow_max_stunrange',0);
                var scale = Math.min(v, arrow_max_stunrange) / arrow_max_stunrange;
                var bonus_damage = Math.floor(a * scale / 2.8) * 2.8;
                return damage + ' + ' + bonus_damage + ' = ' + (damage + bonus_damage);
            }
        }
    ],
    'morphling_morph_agi': [
        {
            label: 'Shifts',
            controlType: 'input'
        },
        {
            attributeName: 'points_per_tick',
            label: 'AGI SHIFT GAIN:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'bonusAgility'
        },
        {
            attributeName: 'points_per_tick',
            label: 'STR SHIFT LOSS:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return -v*a;
            },
            returnProperty: 'bonusStrength'
        },
        {
            attributeName: 'bonus_attributes',
            label: 'SHIFT TIME:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'bonusAgility2'
        },
        {
            attributeName: 'morph_cooldown',
            label: 'SHIFT TIME:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'mana_cost',
            label: 'SHIFT MANA COST:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a*abilityModel.getAbilityAttributeValue(ability.attributes, 'morph_cooldown',ability.level());
            }
        }
    ],
    'morphling_morph_str': [
        {
            label: 'Shifts',
            controlType: 'input'
        },
        {
            attributeName: 'points_per_tick',
            label: 'STR SHIFT GAIN:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'bonusStrength'
        },
        {
            attributeName: 'points_per_tick',
            label: 'AGI SHIFT LOSS:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return -v*a;
            },
            returnProperty: 'bonusAgility'
        },
        {
            attributeName: 'bonus_attributes',
            label: 'SHIFT TIME:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'bonusStrength2'
        },
        {
            attributeName: 'morph_cooldown',
            label: 'SHIFT TIME:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'mana_cost',
            label: 'SHIFT MANA COST:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a*abilityModel.getAbilityAttributeValue(ability.attributes, 'morph_cooldown',ability.level());
            }
        }
    ],
    'furion_wrath_of_nature': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'necrolyte_heartstopper_aura': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'Enemy Max Health',
            controlType: 'input'
        },
        {
            attributeName: 'aura_damage',
            label: 'HEALTH LOST:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v[0]*v[1]*a/100;
            }
        }
    ],
    'necrolyte_sadist': [
        {
            label: 'Unit Kills',
            controlType: 'input'
        },
        {
            label: 'Hero Kills',
            controlType: 'input'
        },
        {
            attributeName: 'health_regen',
            label: 'Total Damage',
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability) {
                var hero_multiplier = abilityModel.getAbilityAttributeValue(ability.attributes, 'hero_multiplier',0)
                return (v[0]+v[1]*hero_multiplier)*a;
            },
            returnProperty: 'healthregen'
        },
        {
            attributeName: 'mana_regen',
            label: 'Total Damage',
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability) {
                var hero_multiplier = abilityModel.getAbilityAttributeValue(ability.attributes, 'hero_multiplier',0)
                return (v[0]+v[1]*hero_multiplier)*a;
            },
            returnProperty: 'manaregen'
        }
    ],
    'night_stalker_crippling_fear': [
        {
            label: 'Is Night',
            controlType: 'checkbox'
        },
        {
            attributeName: 'miss_rate_night',
            label: '%CHANCE TO MISS:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (v) {
                    return abilityModel.getAbilityAttributeValue(ability.attributes, 'miss_rate_night',ability.level());
                }
                else {
                    return abilityModel.getAbilityAttributeValue(ability.attributes, 'miss_rate_day',ability.level());
                }
            },
            returnProperty: 'missChance'
        }
    ],    
    'night_stalker_hunter_in_the_night': [
        {
            label: 'Is Night',
            controlType: 'checkbox'
        },
        {
            attributeName: 'bonus_attack_speed_night',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (v) {
                    return a;
                }
                else {
                    return 0;
                }
            },
            returnProperty: 'attackspeed'
        },
        {
            attributeName: 'bonus_movement_speed_pct_night',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (v) {
                    return a;
                }
                else {
                    return 0;
                }
            },
            returnProperty: 'movementSpeedPct'
        }
    ],    
    'obsidian_destroyer_arcane_orb': [
        {
            label: 'Current Mana',
            controlType: 'input'
        },
        {
            attributeName: 'mana_pool_damage_pct',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a/100;
            },
            returnProperty: 'bonusDamageOrb'
        }
    ],
    'ogre_magi_ignite': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'burn_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'slow_movement_speed_pct',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'pudge_rot': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        },
        {
            attributeName: 'rot_slow',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'pudge_flesh_heap': [
        {
            label: 'Stacks',
            controlType: 'input'
        },
        {
            attributeName: 'flesh_heap_strength_buff_amount',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'bonusStrength'
        },
        {
            attributeName: 'flesh_heap_magic_resist',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'magicResist'
        }
    ],
    'pudge_dismember': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'dismember_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'pugna_nether_ward': [
        {
            label: 'Enemy Mana Spent',
            controlType: 'input'
        },
        {
            attributeName: 'mana_multiplier',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'mana_regen',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'manaregenreduction'
        }
    ],
    'pugna_life_drain': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'health_drain',
            label: 'HEALTH DRAINED:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'queenofpain_shadow_strike': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'movement_slow',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        },
        {
            attributeName: 'strike_damage',
            label: 'Total Damage:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var duration_damage = abilityModel.getAbilityAttributeValue(ability.attributes, 'duration_damage',ability.level());
                var ticks = Math.floor(v/3);
                return a + duration_damage * ticks;
            }
        }
    ],
    'razor_plasma_field': [
        {
            label: 'Distance',
            controlType: 'input'
        },
        {
            attributeName: 'radius',
            label: 'MIN DISTANCE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return 200;
            }
        },
        {
            attributeName: 'radius',
            label: 'MAX DISTANCE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return 200 + a;
            }
        },
        {
            attributeName: 'radius',
            label: 'Instance Damage',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var max_radius = a + 200;
                var scale = (Math.min(Math.max(v, 200), max_radius) - 200) / (max_radius - 200);
                var damage_min = abilityModel.getAbilityAttributeValue(ability.attributes, 'damage_min',ability.level());
                var damage_max = abilityModel.getAbilityAttributeValue(ability.attributes, 'damage_max',ability.level());
                return damage_min + (damage_max - damage_min) * scale;
            }
        }
    ],
    'razor_static_link': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'drain_length',
            label: 'Damage Drained:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var tick_duration = Math.floor(v * 4) + 1;
                var ticks = Math.min(a * 4 + 1, tick_duration);
                var drain_rate = abilityModel.getAbilityAttributeValue(ability.attributes, 'drain_rate',ability.level());
                return ticks * drain_rate/4;
            },
            returnProperty: 'bonusDamage'
        },
        {
            attributeName: 'drain_length',
            label: 'Enemy Damage Lost:',
            ignoreTooltip: true,
            controlType: 'text',
            display: 'hidden',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var tick_duration = Math.floor(v * 4) + 1;
                var ticks = Math.min(a * 4 + 1, tick_duration);
                var drain_rate = abilityModel.getAbilityAttributeValue(ability.attributes, 'drain_rate',ability.level());
                return ticks * drain_rate/4;
            },
            returnProperty: 'bonusDamageReduction'
        }
    ],
    'razor_eye_of_the_storm': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'rubick_fade_bolt': [
        {
            label: 'Jumps',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a * (1 - v*abilityModel.getAbilityAttributeValue(ability.attributes, 'jump_damage_reduction_pct',ability.level())/100);
            }
        },
        {
            attributeName: 'hero_attack_damage_reduction',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'bonusDamageReduction'
        }
    ],
    'sandking_sand_storm': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        }
    ],
    'sandking_epicenter': [
        {
            label: 'Pulses',
            controlType: 'input'
        },
        {
            attributeName: 'epicenter_damage',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'epicenter_slow',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        },
        {
            attributeName: 'epicenter_slow_as',
            label: '%ATTACK SLOW:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'attackspeedreduction'
        }
    ],
    'shadow_demon_shadow_poison': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'stack_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var stackmult = [1,2,4,8];
                if (v > 4) {
                    return a * stackmult[3] + 50 * (v - 4);
                }
                else if (v <= 0) {
                    return 0
                }
                else {
                    return a * stackmult[v-1]
                }
            }
        }
    ],
    'nevermore_necromastery': [
        {
            label: 'Souls',
            controlType: 'input'
        },
        {
            attributeName: 'necromastery_damage_per_soul',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'bonusDamage'
        }
    ],
    'nevermore_requiem': [
        {
            label: 'Line Hit Count',
            controlType: 'input'
        },
        {
            attributeName: 'requiem_reduction_damage',
            label: 'Damage:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        },
        {
            label: 'Return Line Hit Count (Scepter)',
            controlType: 'input'
        },
        {
            attributeName: 'requiem_damage_pct_scepter',
            label: 'Damage/Heal:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v*a/100;
            }
        },
        {
            attributeName: 'requiem_damage_pct_scepter',
            label: 'Total Damage:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability) {
                var damage = abilityModel.getAbilityPropertyValue(ability, 'damage');
                return damage*v[0] + damage*v[1]*a/100;
            }
        },
        {
            attributeName: 'requiem_reduction_damage',
            label: '%DAMAGE REDUCTION:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'baseDamageReductionPct'
        },
        {
            attributeName: 'requiem_reduction_ms',
            label: '%DAMAGE REDUCTION:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'shadow_shaman_shackles': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        }
    ],
    'silencer_curse_of_the_silent': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return Math.floor(v)*a;
            }
        },
        {
            attributeName: 'movespeed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
/*        'silencer_glaives_of_wisdom': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],*/
    'skywrath_mage_mystic_flare': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'slark_essence_shift': [
        {
            label: 'Attacks',
            controlType: 'input'
        },
        {
            attributeName: 'agi_gain',
            label: 'Total Damage',
            controlType: 'text',
            display: 'ability',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'bonusAgility'
        },
        {
            attributeName: 'stat_loss',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return -v*a;
            },
            returnProperty: 'bonusAllStatsReduction'
        }
    ],
    'slark_shadow_dance': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'bonus_regen_pct',
            label: 'TOTAL HEALTH REGENERATED:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*parent.health()*a/100;
            }
        },
        {
            attributeName: 'bonus_regen_pct',
            label: 'HEALTH GAINED PER SECOND:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return parent.health()*a/100;
            },
            returnProperty: 'healthregen'
        },
        {
            attributeName: 'bonus_movement_speed',
            label: '%MOVE SPEED:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedPct'
        }
    ],
    'sniper_shrapnel': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        },
        {
            attributeName: 'building_damage',
            label: 'BUILDING DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'slow_movement_speed',
            label: 'Enemy Movement Speed Slow',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'spectre_desolate': [
        {
            label: 'Enemy Alone',
            controlType: 'checkbox'
        },
        {
            attributeName: 'bonus_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (v) {
                    return a;
                }
                else {
                    return 0;
                }
            },
            returnProperty: 'bonusDamage'
        }
    ],
    'spectre_dispersion': [
        {
            label: 'Damage Taken',
            controlType: 'input'
        },
        {
            attributeName: 'damage_reflection_pct',
            label: 'DAMAGE REFLECTED:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return -a;
            },
            returnProperty: 'damageReduction'
        },
        {
            attributeName: 'damage_reflection_pct',
            label: 'DAMAGE REFLECTED:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a/100;
            }
        }
    ],
    'storm_spirit_ball_lightning': [
        {
            label: 'MAX MANA',
            controlType: 'input'
        },
        {
            label: 'Distance',
            controlType: 'input'
        },
        {
            attributeName: 'ball_lightning_initial_mana_base',
            label: 'Total Damage:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0, 1],
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')/100*v[1];
            }
        },
        {
            attributeName: 'ball_lightning_initial_mana_base',
            label: 'FLAT MANA COST:',
            ignoreTooltip: true,
            controlType: 'method',
            controls: [0, 1],
            fn: function (v, a, parent, index, abilityModel, ability) {
                var distance_intervals = Math.floor(v[1]/100);
                var travel_cost_base = abilityModel.getAbilityAttributeValue(ability.attributes, 'ball_lightning_travel_cost_base',0);
                return a + distance_intervals * travel_cost_base;
            }
        },
        {
            attributeName: 'ball_lightning_initial_mana_percentage',
            label: '%MAX MANA COST:',
            ignoreTooltip: true,
            controlType: 'method',
            controls: [0, 1],
            fn: function (v, a, parent, index, abilityModel, ability) {
                var distance_intervals = Math.floor(v[1]/100);
                var travel_cost_percent = abilityModel.getAbilityAttributeValue(ability.attributes, 'ball_lightning_travel_cost_percent',0);
                return a + distance_intervals * travel_cost_percent;
            }
        },
        {
            attributeName: 'ball_lightning_initial_mana_base',
            label: 'TOTAL MANA COST:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0, 1, 2, 3],
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v[2] + ' + ' + (v[3]/100 * v[0]) + ' (' + v[3] + '% of max) = ' + (v[2] + v[3]/100 * v[0]);
            }
        }
    ],
    'templar_assassin_psionic_trap': [
        {
            label: 'Charge Time',
            controlType: 'input'
        },
        {
            attributeName: 'movement_speed_min_tooltip',
            label: '%MOVE SLOW:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var max_slow = abilityModel.getAbilityAttributeValue(ability.attributes, 'movement_speed_max_tooltip',0);
                var slow_per_tick = (max_slow - a)/40;
                return -(a + slow_per_tick * Math.min(Math.max(0, v), 4) * 10);
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'shredder_reactive_armor': [
        {
            label: 'Stacks',
            controlType: 'input'
        },
        {
            attributeName: 'bonus_armor',
            label: 'Total Armor Bonus',
            controlType: 'text',
            noLevel: true,
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'armor'
        },
        {
            attributeName: 'bonus_hp_regen',
            label: 'Total HP Regen Bonus',
            controlType: 'text',
            noLevel: true,
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'healthregen'
        }
    ],
    'shredder_chakram': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage_per_second',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var interval = abilityModel.getAbilityAttributeValue(ability.attributes, 'damage_interval',0);
                var ticks = Math.floor(v / interval);
                return a*interval*ticks;
            }
        },
        {
            attributeName: 'mana_per_second',
            label: 'MANA COST:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var interval = abilityModel.getAbilityAttributeValue(ability.attributes, 'damage_interval',0);
                var ticks = Math.floor(v / interval);
                return a*interval*ticks;
            }
        },
        {
            label: 'ENEMY %HP',
            controlType: 'input'
        },
        {
            attributeName: 'slow',
            label: 'MANA COST:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var ticks = 20 - Math.floor(Math.min(Math.max(v-1, 0), 99) / 5);
                return -a*ticks;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'spirit_breaker_greater_bash': [
        {
            label: 'Bash Proc',
            controlType: 'checkbox'
        },
        {
            attributeName: 'damage',
            label: '%MOVESPEED AS DAMAGE',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (v) {
                    return a;
                }
                else {
                    return 0;
                }
            },
            returnProperty: 'bashBonusDamage'
        },
        {
            attributeName: 'bonus_movespeed_pct',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (v) {
                    return a;
                }
                else {
                    return 0;
                }
            },
            returnProperty: 'movementSpeedPct'
        },
        {
            attributeName: 'chance_pct',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a
            },
            returnProperty: 'bash'
        }
    ],
    'techies_land_mines': [
        {
            label: 'Number of Mines',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'damage',
            label: 'AFTER REDUCTIONS:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var phys_reduction = parent.enemy().totalArmorPhysicalReduction(),
                    magic_reduction = parent.enemy().totalMagicResistance();
                return (v * a * (1 - phys_reduction / 100) * (1 - magic_reduction / 100)).toFixed(2);
            }
        }
    ],
    'techies_suicide': [
        {
            attributeName: 'damage',
            label: 'FULL DAMAGE AFTER REDUCTIONS:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var phys_reduction = parent.enemy().totalArmorPhysicalReduction(),
                    magic_reduction = parent.enemy().totalMagicResistance();
                return (a * (1 - phys_reduction / 100) * (1 - magic_reduction / 100)).toFixed(2);
            }
        },
        {
            attributeName: 'partial_damage',
            label: 'PARTIAL DAMAGE AFTER REDUCTIONS:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var phys_reduction = parent.enemy().totalArmorPhysicalReduction(),
                    magic_reduction = parent.enemy().totalMagicResistance();
                return (a * (1 - phys_reduction / 100) * (1 - magic_reduction / 100)).toFixed(2);
            }
        },
        {
            attributeName: 'damage',
            label: 'RESPAWN TIME:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return (parent.respawnTime() / 2).toFixed(0) + ' seconds';
            }
        }
    ],
    'techies_remote_mines': [
        {
            label: 'Number of Mines',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'damage',
            label: 'AFTER REDUCTIONS:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var magic_reduction = parent.enemy().totalMagicResistance();
                return (v * a * (1 - magic_reduction / 100)).toFixed(2);
            }
        }
    ],
    'tinker_march_of_the_machines': [
        {
            label: 'Robot Explosions',
            controlType: 'input'
        },
        {
            attributeName: 'machines_per_sec',
            label: 'TOTAL DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        }
    ],
    'treant_leech_seed': [
        {
            label: 'Pulses',
            controlType: 'input'
        },
        {
            attributeName: 'leech_damage',
            label: 'DAMAGE/HEAL:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'movement_slow',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'troll_warlord_fervor': [
        {
            label: 'Stacks',
            controlType: 'input'
        },
        {
            attributeName: 'attack_speed',
            label: 'ATTACK SPEED:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'attackspeed'
        }
    ],
    'undying_decay': [
        {
            label: 'Stacks',
            controlType: 'input'
        },
        {
            attributeName: 'str_steal',
            label: 'STRENGTH STOLEN:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                if (parent.inventory.hasScepter()) {
                    var str_steal_scepter = abilityModel.getAbilityAttributeValue(ability.attributes, 'str_steal_scepter',0);
                    return v*str_steal_scepter;
                }
                else {
                    return v*a;
                }
            },
            returnProperty: 'bonusStrength'
        },
    ],
    'undying_soul_rip': [
        {
            label: 'Units',
            controlType: 'input'
        },
        {
            attributeName: 'damage_per_unit',
            label: 'DAMAGE/HEAL:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'undying_flesh_golem': [
        {
            label: 'Distance',
            controlType: 'input'
        },
        {
            attributeName: 'max_speed_slow',
            label: '%MOVE SLOW:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var min_speed_slow = abilityModel.getAbilityAttributeValue(ability.attributes, 'min_speed_slow', 0);
                var radius = abilityModel.getAbilityAttributeValue(ability.attributes, 'radius', 0);
                var full_power_radius = abilityModel.getAbilityAttributeValue(ability.attributes, 'full_power_radius', 0);
                var distance = Math.min(Math.max(v, full_power_radius), radius);
                var scale = 1 - (distance - full_power_radius) / (radius - full_power_radius);
                return -Math.max(scale * a, min_speed_slow);
            },
            returnProperty: 'movementSpeedPctReduction'
        },
        {
            attributeName: 'max_damage_amp',
            label: '%DAMAGE AMP:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var min_damage_amp = abilityModel.getAbilityAttributeValue(ability.attributes, 'min_damage_amp', 0);
                var radius = abilityModel.getAbilityAttributeValue(ability.attributes, 'radius', 0);
                var full_power_radius = abilityModel.getAbilityAttributeValue(ability.attributes, 'full_power_radius', 0);
                var distance = Math.min(Math.max(v, full_power_radius), radius);
                var scale = 1 - (distance - full_power_radius) / (radius - full_power_radius);
                return Math.max(scale * a, min_damage_amp);
            },
            returnProperty: 'damageAmplification'
        },
        {
            label: 'MAX HP',
            controlType: 'input'
        },
        {
            label: 'Hero Death Count',
            controlType: 'input'
        },
        {
            label: 'Creep Death Count',
            controlType: 'input'
        },
        {
            attributeName: 'death_heal',
            label: 'DEATH HEAL (HEROES):',
            ignoreTooltip: true,
            controlType: 'method',
            controls: [1, 2],
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v[0]*v[1]*a/100;
            }
        },
        {
            attributeName: 'death_heal_creep',
            label: 'DEATH HEAL (CREEPS):',
            ignoreTooltip: true,
            controlType: 'method',
            controls: [1, 3],
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v[0]*v[1]*a/100;
            }
        },
        {
            attributeName: 'death_heal_creep',
            label: 'TOTAL DEATH HEAL:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [4, 5],
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v[0]+v[1];
            }
        }
    ],
    'ursa_fury_swipes': [
        {
            label: 'Stacks',
            controlType: 'input'
        },
        {
            attributeName: 'damage_per_stack',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var enrageAbility = abilityModel.abilities.find(function(b) {
                    return b.name == 'ursa_enrage';
                });
                if (enrageAbility.isActive() && enrageAbility.level() > 0) {
                    var enrage_multiplier = abilityModel.getAbilityAttributeValue(enrageAbility.attributes, 'enrage_multiplier', enrageAbility.level());
                    return v*a*enrage_multiplier;
                }
                return v*a;
            },
            returnProperty: 'bonusDamage'
        }
    ],
    'ursa_enrage': [
        {
            attributeName: 'damage_reduction',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return -a;
            },
            returnProperty: 'damageReduction'
        }
    ],
    'venomancer_venomous_gale': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'tick_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityAttributeValue(ability.attributes, 'strike_damage',ability.level()) + Math.floor(v/3)*a;
            }
        },
        {
            attributeName: 'movement_slow',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'venomancer_poison_sting': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'movement_speed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'venomancer_poison_nova': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'viper_poison_attack': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'bonus_movement_speed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        },
        {
            attributeName: 'bonus_attack_speed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'attackspeedreduction'
        }
    ],
    'viper_corrosive_skin': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'bonus_movement_speed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        },
        {
            attributeName: 'bonus_attack_speed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'attackspeedreduction'
        },
        {
            attributeName: 'bonus_magic_resistance',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'magicResist'
        }
    ],
    'viper_viper_strike': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'bonus_movement_speed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'movementSpeedPctReduction'
        },
        {
            attributeName: 'bonus_attack_speed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'attackspeedreduction'
        }
    ],
    'visage_soul_assumption': [
        {
            label: 'Charges',
            controlType: 'input'
        },
        {
            attributeName: 'soul_charge_damage',
            label: 'Total Damage:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var soul_base_damage = abilityModel.getAbilityAttributeValue(ability.attributes, 'soul_base_damage',0);
                var stack_limit = abilityModel.getAbilityAttributeValue(ability.attributes, 'stack_limit', ability.level());
                stack_limit = Math.max(Math.min(v, stack_limit), 0);
                return soul_base_damage + stack_limit*a;
            }
        }
    ],
    'visage_gravekeepers_cloak': [
        {
            label: 'Layers',
            controlType: 'input'
        },
        {
            attributeName: 'bonus_armor',
            label: 'ARMOR:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'armor'
        },
        {
            attributeName: 'bonus_resist',
            label: '%RESIST:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            },
            returnProperty: 'magicResist'
        }
    ],
    'warlock_shadow_word': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        }
    ],
    'warlock_upheaval': [
        {
            label: 'Channel Duration',
            controlType: 'input'
        },
        {
            attributeName: 'slow_rate_duration',
            label: '%MOVE SLOW:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var max_slow = abilityModel.getAbilityAttributeValue(ability.attributes, 'max_slow',0);
                var slow_per_tick = max_slow / (a - 0.5) / 2;
                var ticks = Math.max(Math.floor(v * 2) - 1, 0);
                return -Math.min(ticks * slow_per_tick, max_slow);
            },
            returnProperty: 'movementSpeedPctReduction'
        }
    ],
    'weaver_the_swarm': [
        {
            label: 'Attacks',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'armor_reduction',
            label: 'DAMAGE:',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return -v*a;
            },
            returnProperty: 'armorReduction'
        }
    ],
    'windrunner_powershot': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
            }
        }
    ],
    'winter_wyvern_cold_embrace': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            label: 'Ally Max Health',
            controlType: 'input'
        },
        {
            attributeName: 'heal_percentage',
            label: 'TOTAL HEAL:',
            ignoreTooltip: true,
            controlType: 'text',
            controls: [0,1],
            fn: function (v, a, parent, index, abilityModel, ability) {
                var base_heal = abilityModel.getAbilityAttributeValue(ability.attributes, 'heal_additive',ability.level());
                return (base_heal + v[1] * a/100) * v[0];
            }
        }
    ],
    'wisp_spirits': [
        {
            label: 'Collision Count',
            controlType: 'input'
        },
        {
            attributeName: 'hero_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'creep_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'wisp_overcharge': [
        {
            label: 'Current HP',
            controlType: 'input'
        },
        {
            attributeName: 'drain_pct',
            label: 'HP DRAINED:',
            ignoreTooltip: true, 
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            label: 'Current MP',
            controlType: 'input'
        },
        {
            attributeName: 'drain_pct',
            label: 'MP DRAINED:',
            ignoreTooltip: true, 
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        },
        {
            attributeName: 'bonus_attack_speed',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'attackspeed'
        },
        {
            attributeName: 'bonus_damage_pct',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return a;
            },
            returnProperty: 'damageReduction'
        }
    ],
    'witch_doctor_paralyzing_cask': [
        {
            label: 'Hero Bounce Count',
            controlType: 'input'
        },
        {
            attributeName: 'hero_damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var bounces = abilityModel.getAbilityAttributeValue(ability.attributes, 'bounces',ability.level());
                return Math.min(Math.max(v, 0), bounces)*a;
            }
        },
        {
            label: 'Creep Bounce Count',
            controlType: 'input'
        },
        {
            attributeName: 'hero_damage',
            label: 'CREEP DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var bounces = abilityModel.getAbilityAttributeValue(ability.attributes, 'bounces',ability.level());
                var damage = abilityModel.getAbilityPropertyValue(ability, 'damage');
                return Math.min(Math.max(v, 0), bounces)*damage;
            }
        }
    ],
    'witch_doctor_voodoo_restoration': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'heal',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var interval = abilityModel.getAbilityAttributeValue(ability.attributes, 'heal_interval',ability.level());
                var heal_per_tick = a * interval;
                var ticks = Math.max(Math.floor(v / interval) - 1, 0);
                return heal_per_tick * ticks;
            }
        },
        {
            attributeName: 'mana_per_second',
            label: 'MANA COST:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var interval = abilityModel.getAbilityAttributeValue(ability.attributes, 'heal_interval',ability.level());
                var mana_per_tick = a * interval;
                var ticks = Math.max(Math.floor(v / interval) - 1, 0);
                return mana_per_tick * ticks;
            }
        }
    ],
    'witch_doctor_maledict': [
        {
            label: 'damage 0-4s',
            controlType: 'input'
        },
        {
            label: 'damage 4-8s',
            controlType: 'input'
        },
        {
            label: 'damage 8-12s',
            controlType: 'input'
        },
        {
            attributeName: 'bonus_damage',
            label: 'Dot Damage after 3s:',
            ignoreTooltip: true,
            controlType: 'method',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var damage = abilityModel.getAbilityPropertyValue(ability, 'damage');
                return 3*damage;
            }
        },
        {
            attributeName: 'bonus_damage',
            label: 'Burst Damage at 4s:',
            ignoreTooltip: true,
            controlType: 'method',
            controls: [0, 3],
            fn: function (v, a, parent, index, abilityModel, ability) {
                var damage = abilityModel.getAbilityPropertyValue(ability, 'damage');
                var d = v.reduce(function (memo, o) { return memo + o }, 0);
                return Math.max(d, 0) * a/100;
            }
        },
        {
            attributeName: 'bonus_damage',
            label: 'Dot Damage after 7s:',
            ignoreTooltip: true,
            controlType: 'method',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var damage = abilityModel.getAbilityPropertyValue(ability, 'damage');
                return 7*damage;
            }
        },
        {
            attributeName: 'bonus_damage',
            label: 'Burst Damage at 8s:',
            ignoreTooltip: true,
            controlType: 'method',
            controls: [0, 1, 4, 5],
            fn: function (v, a, parent, index, abilityModel, ability) {
                var damage = abilityModel.getAbilityPropertyValue(ability, 'damage');
                var d = v.reduce(function (memo, o) { return memo + o }, 0);
                return Math.max(d, 0) * a/100;
            }
        },
        {
            attributeName: 'bonus_damage',
            label: 'Dot Damage after 11s:',
            ignoreTooltip: true,
            controlType: 'method',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var damage = abilityModel.getAbilityPropertyValue(ability, 'damage');
                return 11*damage;
            }
        },
        {
            attributeName: 'bonus_damage',
            label: 'Burst Damage at 12s:',
            ignoreTooltip: true,
            controlType: 'method',
            controls: [0, 1, 2, 4, 6, 7],
            fn: function (v, a, parent, index, abilityModel, ability) {
                var damage = abilityModel.getAbilityPropertyValue(ability, 'damage');
                var d = v.reduce(function (memo, o) { return memo + o }, 0);
                return Math.max(d, 0) * a/100;
            }
        },
        {
            attributeName: 'bonus_damage',
            label: 'Total Burst Damage:',
            ignoreTooltip: true,
            controlType: 'method',
            controls: [4, 6, 8],
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v.reduce(function (memo, o) { return memo + o }, 0);
            }
        },
        {
            attributeName: 'bonus_damage',
            label: 'Total Maledict Damage:',
            ignoreTooltip: true,
            controlType: 'method',
            controls: [9],
            fn: function (v, a, parent, index, abilityModel, ability) {
                var duration = abilityModel.getAbilityAttributeValue(ability.attributes, 'duration_tooltip',0);
                var damage = abilityModel.getAbilityPropertyValue(ability, 'damage');
                return damage * duration + v[0];
            }
        },
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'bonus_damage',
            label: 'DOT Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                var duration = abilityModel.getAbilityAttributeValue(ability.attributes, 'duration_tooltip',0);
                return abilityModel.getAbilityPropertyValue(ability, 'damage')*Math.min(Math.max(v, 0), duration);
            }
        }
    ],
    'witch_doctor_death_ward': [
        {
            label: 'Duration',
            controlType: 'input'
        },
        {
            attributeName: 'damage',
            label: 'Total Damage',
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a;
            }
        }
    ],
    'zuus_static_field': [
        {
            label: 'Enemy HP',
            controlType: 'input'
        },
        {
            attributeName: 'damage_health_pct',
            label: 'DAMAGE:',
            ignoreTooltip: true,
            controlType: 'text',
            fn: function (v, a, parent, index, abilityModel, ability) {
                return v*a/100;
            }
        }
    ]
}