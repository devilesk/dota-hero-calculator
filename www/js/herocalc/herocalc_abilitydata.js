define(function (require, exports, module) {
    'use strict';
        
    var my = require("./herocalc_core").HEROCALCULATOR;

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
                fn: function(v,a) {
                    return v*a;
                }
            },
            {
                attributeName: 'armor_reduction',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a) {
                    return v*a/5;
                }
            },
            {
                attributeName: 'max_stun',
                label: 'Total Stun',
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a) {
                    return v*a;
                }
            },
            {
                attributeName: 'stun_duration',
                label: 'Total Stun',
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a,parent,index) {
                    return parent.ability().getAbilityPropertyValue(parent.ability().abilities()[index], 'damage')+v*a;
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
                fn: function(v,a) {
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
                fn: function(v,a) {
                    return v*a;
                },
                returnProperty: 'movementSpeedPct'
            },
            {
                attributeName: 'slow',
                label: 'Movement Speed Bonus',
                controlType: 'text',
                noLevel: true,
                fn: function(v,a) {
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
                fn: function(v,a,parent,index) {
                    return parent.ability().getAbilityPropertyValue(parent.ability().abilities()[index], 'damage')*v;
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
                fn: function(v,a,parent,index) {
                    if (parent.inventory.hasScepter()) {
                        return v[0]*parent.ability().getAbilityAttributeValue(parent.ability().abilities()[index].attributes(), 'fiend_grip_damage_scepter',parent.ability().abilities()[index].level());
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
                fn: function(v,a,parent,index) {
                    if (parent.inventory.hasScepter()) {
                        return v[0]*v[1]*parent.ability().getAbilityAttributeValue(parent.ability().abilities()[index].attributes(), 'fiend_grip_mana_drain_scepter',parent.ability().abilities()[index].level())/100;
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
                fn: function(v,a) {
                    return v*a;
                },
                returnProperty: 'bonusDamage'
            },
            {
                attributeName: 'movement_speed_pct',
                label: 'Enemy Movement Speed Slow',
                controlType: 'text',
                fn: function(v,a) {
                    return v*a;
                },
                returnProperty: 'movementSpeedPctReduction'
            },
            {
                attributeName: 'turn_rate_pct',
                label: 'Enemy Turn Rate Slow',
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a) {
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
                fn: function(v,a,parent,index) {
                    return parent.ability().getAbilityPropertyValue(parent.ability().abilities()[index], 'damage') + v*a/100;
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
                fn: function(v,a) {
                    return -v*a;
                },
                returnProperty: 'armorReduction'
            },
            {
                attributeName: 'move_slow_per_stack',
                label: '%SLOW:',
                ignoreTooltip: true,
                controlType: 'text',
                fn: function(v,a,parent,index,abilityModel,ability) {
                    return -(abilityModel.getAbilityAttributeValue(ability.attributes(), 'base_move_slow',0)+v*a);
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
                fn: function(v,a,parent,index) {
                    var total = parent.ability().getAbilityAttributeValue(parent.ability().abilities()[index].attributes(), 'quill_base_damage',parent.ability().abilities()[index].level())+v*a,
                    damage_cap = parent.ability().getAbilityAttributeValue(parent.ability().abilities()[index].attributes(), 'max_damage',0);
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
                fn: function(v,a,parent,index) {
                    var ability = this.abilities().find(function(b) {
                        return b.name() == 'bristleback_bristleback';
                    });
                    if (v == 'back') {
                        var total = this.getAbilityAttributeValue(ability.attributes(), 'back_damage_reduction', ability.level());
                    }
                    else {
                        var total = this.getAbilityAttributeValue(ability.attributes(), 'side_damage_reduction', ability.level());
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
                fn: function(v,a,parent,index) {
                    if (v < 1) {
                        return 0;
                    }
                    else {
                        return parent.ability().getAbilityAttributeValue(parent.ability().abilities()[index].attributes(), 'base_damage',parent.ability().abilities()[index].level())+(v-1)*a;
                    }
                }
            },
            {
                attributeName: 'move_speed_per_stack',
                label: '%MOVEMENT:',
                ignoreTooltip: true,
                controlType: 'text',
                fn: function(v,a,parent,index) {
                    if (v < 1) {
                        return 0;
                    }
                    else {
                        return parent.ability().getAbilityAttributeValue(parent.ability().abilities()[index].attributes(), 'base_move_speed',parent.ability().abilities()[index].level())+(v-1)*a;
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
                fn: function(v,a,parent,index) {
                    return parent.ability().getAbilityAttributeValue(parent.ability().abilities()[index].attributes(), 'return_damage',parent.ability().abilities()[index].level()) + v*a/100;
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
                fn: function(v,a) {
                    return v*a;
                }
            },
            {
                attributeName: 'slow_movement_speed',
                label: 'Enemy Movement Speed Slow',
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a) {
                    return v*a/100;
                },
                returnProperty: 'baseDamage'
            },
            {
                attributeName: 'health_gain_pct',
                label: 'HEALTH GAIN:',
                ignoreTooltip: true,
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a,parent,index) {
                    return parent.ability().getAbilityPropertyValue(parent.ability().abilities()[index], 'damage')*v;
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
                fn: function(v,a) {
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
                fn: function(v,a,parent,index) {
                    return parent.ability().getAbilityPropertyValue(parent.ability().abilities()[index], 'damage')*v;
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
                fn: function(v,a) {
                    return v*a;
                },
                returnProperty: 'armor'
            },
            {
                attributeName: 'armor_per_second',
                label: 'ARMOR REDUCTION:',
                ignoreTooltip: true,
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a) {
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
                fn: function(v,a,parent,index) {
                    var damagevalue = 0.25 * (130 + 40 * parent.ability().abilities()[index].level()) * (1/20),
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
                fn: function(v,a) {
                    return v*a;
                }
            },
            {
                attributeName: 'bonus_movement_speed_pct',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
                    return a;
                },
                returnProperty: 'movementSpeedPct'
            },
            {
                attributeName: 'damage_per_second',
                label: 'HP REGEN:',
                ignoreTooltip: true,
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a,parent,index) {
                    if (parent.inventory.hasScepter()) {
                        return v*parent.ability().getAbilityAttributeValue(parent.ability().abilities()[index].attributes(), 'damage_scepter',parent.ability().abilities()[index].level());
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
                fn: function(v,a) {
                    return a;
                },
                returnProperty: 'attackrange'
            },
            {
                attributeName: 'bonus_movement_speed',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a) {
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
                fn: function(v,a) {
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
                fn: function(v,a) {
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
                fn: function(v,a) {
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
                fn: function(v,a,parent,index) {
                    return v[0]*parent.ability().getAbilityAttributeValue(parent.ability().abilities()[index].attributes(), 'damage_heroes',parent.ability().abilities()[index].level()) + v[1]*a;
                },
                returnProperty: 'bonusDamage'
            },
            {
                attributeName: 'move_pct_creeps',
                label: '%BONUS SPEED:',
                ignoreTooltip: true,
                controlType: 'text',
                controls: [0,1],
                fn: function(v,a,parent,index) {
                    return v[0]*parent.ability().getAbilityAttributeValue(parent.ability().abilities()[index].attributes(), 'move_pct_heroes',parent.ability().abilities()[index].level()) + v[1]*a;
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
                fn: function(v,a) {
                    return v*a/100;
                }
            },
            {
                attributeName: 'slow_pct',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a,parent,index) {
                    return parent.ability().getAbilityAttributeValue(parent.ability().abilities()[index].attributes(), 'wisp_count',parent.ability().abilities()[index].level())*v*a;
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
                fn: function(v,a) {
                    return v*a;
                }
            },
            {
                attributeName: 'stun_duration',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a,parent,index) {
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
                fn: function(v,a) {
                    return v*a;
                }
            },
            {
                attributeName: 'near_damage',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a) {
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
                fn: function(v,a) {
                    return a;
                }
            },
            {
                attributeName: 'chance_pct',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a) {
                    return a;
                }
            },
            {
                label: 'DAMAGE:',
                controlType: 'text',
                fn: function(v,a,parent,index) {
                    return parent.ability().getAbilityPropertyValue(parent.ability().abilities()[index], 'damage')*v;
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
                fn: function(v,a) {
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
                fn: function(v,a) {
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
                fn: function(v,a) {
                    return v*a;
                }
            },
            {
                label: 'DAMAGE:',
                controlType: 'text',
                fn: function(v,a,parent,index) {
                    return parent.ability().getAbilityPropertyValue(parent.ability().abilities()[index], 'damage')*v;
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
                fn: function(v,a,parent) {
                    return parent.health()*v/100;
                }
            },
            {
                attributeName: 'hp_threshold_max',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
                    return a;
                }
            },
            {
                attributeName: 'maximum_resistance',
                label: 'MAGIC RESISTANCE BONUS:',
                ignoreTooltip: true,
                controlType: 'text',
                fn: function(v,a,parent,index,abilityModel,ability) {
                    var v = Math.min(v, 100);
                    v = Math.max(v, 10);
                    var hp_threshold_max = abilityModel.getAbilityAttributeValue(ability.attributes(), 'hp_threshold_max',0);
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
                fn: function(v,a,parent,index,abilityModel,ability) {
                    var v = Math.min(v, 100);
                    v = Math.max(v, 10);
                    var hp_threshold_max = abilityModel.getAbilityAttributeValue(ability.attributes(), 'hp_threshold_max',0);
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
                fn: function(v,a) {
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
                fn: function(v,a) {
                    return v*a;
                }
            },
            {
                attributeName: 'movespeed',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a) {
                    return a;
                },
                returnProperty: 'bonusStrength'
            },
            {
                attributeName: 'health_regen_per_instance',
                label: 'HP REGEN:',
                ignoreTooltip: true,
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a) {
                    return a;
                },
                returnProperty: 'bonusAgility'
            },
            {
                attributeName: 'move_speed_per_instance',
                label: '%MOVE SPEED:',
                ignoreTooltip: true,
                controlType: 'text',
                fn: function(v,a) {
                    return v*a;
                },
                returnProperty: 'movementSpeedPct'
            },
            {
                attributeName: 'attack_speed_per_instance',
                label: '%ATTACK SPEED:',
                ignoreTooltip: true,
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a) {
                    return a;
                },
                returnProperty: 'bonusInt'
            },
            {
                attributeName: 'bonus_damage_per_instance',
                label: 'DAMAGE:',
                ignoreTooltip: true,
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a,parent,index,abilityModel,ability) {
                    if (v == 0) {
                        return 0;
                    }
                    return abilityModel.getAbilityAttributeValue(ability.attributes(), 'enemy_slow',v);
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
                fn: function(v,a,parent,index,abilityModel,ability) {
                    if (v == 0) {
                        return 0;
                    }
                    return abilityModel.getAbilityAttributeValue(ability.attributes(), 'self_slow',v);
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
                fn: function(v,a,parent,index,abilityModel,ability) {
                    if (v == 0) {
                        return 0;
                    }
                    return abilityModel.getAbilityAttributeValue(ability.attributes(), 'bonus_attack_speed',v);
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
                fn: function(v,a,parent,index,abilityModel,ability) {
                    if (v == 0) {
                        return 0;
                    }
                    return abilityModel.getAbilityAttributeValue(ability.attributes(), 'bonus_damage',v);
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
                fn: function(v,a,parent,index,abilityModel,ability) {
                    if (v == 0) {
                        return 0;
                    }
                    return abilityModel.getAbilityAttributeValue(ability.attributes(), 'slow',v);
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
                fn: function(v,a,parent,index,abilityModel,ability) {
                    if (v[0] == 0) {
                        return 0;
                    }
                    return abilityModel.getAbilityAttributeValue(ability.attributes(), 'damage_per_second',v[0])*v[1];
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
                fn: function(v,a,parent,index) {
                    return parent.ability().getAbilityPropertyValue(parent.ability().abilities()[index], 'damage')*2 + 
                    parent.ability().getAbilityAttributeValue(parent.ability().abilities()[index].attributes(), 'burn_damage',parent.ability().abilities()[index].level())*v;
                }
            },
            {
                attributeName: 'slow_movement_speed_pct',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
                    return a;
                },
                returnProperty: 'movementSpeedPctReduction'
            },
            {
                attributeName: 'slow_attack_speed_pct',
                label: '%ATTACK SLOW:',
                ignoreTooltip: true,
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a) {
                    return v*a;
                }
            },
            {
                attributeName: 'slow_attack_speed_pct',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a) {
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
                fn: function(v,a,parent,index) {
                    return parent.ability().getAbilityPropertyValue(parent.ability().abilities()[index], 'damage')*v;
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
                fn: function(v,a,parent,index) {
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
                fn: function(v,a,parent,index) {
                    return parent.ability().getAbilityAttributeValue(parent.ability().abilities()[index].attributes(), 'omni_slash_damage',1)*v;
                }
            },
            {
                label: 'MAX DAMAGE:',
                ignoreTooltip: true,
                controlType: 'text',
                fn: function(v,a,parent,index) {
                    return parent.ability().getAbilityAttributeValue(parent.ability().abilities()[index].attributes(), 'omni_slash_damage',2)*v;
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
                fn: function(v,a) {
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
                fn: function(v,a,parent,index) {
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
                fn: function(v,a) {
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
                fn: function(v,a) {
                    return v*a;
                }
            },
            {
                attributeName: 'mana_cost_per_second',
                label: 'MANA COST:',
                ignoreTooltip: true,
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a) {
                    return v*a;
                }
            },
            {
                attributeName: 'slow_movement_speed',
                label: 'Enemy Movement Speed Slow',
                controlType: 'text',
                fn: function(v,a) {
                    return a;
                },
                returnProperty: 'movementSpeedPctReduction'
            },
            {
                attributeName: 'slow_attack_speed',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a) {
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
                fn: function(v,a) {
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
                fn: function(v,a,parent,index,abilityModel,ability) {
                    return abilityModel.getAbilityAttributeValue(ability.attributes(), 'slow_steps',v+1);
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
                fn: function(v,a) {
                    return v*a;
                },
                returnProperty: 'movementSpeedPct'
            },
            {
                attributeName: 'fiery_soul_attack_speed_bonus',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a) {
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
                fn: function(v,a,parent,index) {
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
                fn: function(v,a,parent,index,abilityModel) {
                    var lucentBeamAbility = abilityModel.find(function(b) {
                        return b.name() == 'luna_lucent_beam';
                    });
                    if (lucentBeamAbility.level() == 0) return 0;
                    var damage = lucentBeamAbility.damage()[lucentBeamAbility.level()-1];
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
                fn: function(v,a,parent,index,abilityModel,ability) {
                    var snake_jumps = abilityModel.getAbilityAttributeValue(ability.attributes(), 'snake_jumps',ability.level());
                    var snake_scale = abilityModel.getAbilityAttributeValue(ability.attributes(), 'snake_scale',0);
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
                fn: function(v) {
                    return v[1].join(' / ');
                }
            },
            {
                attributeName: 'snake_damage',
                label: 'Total Damage:',
                ignoreTooltip: true,
                controlType: 'text',
                controls: [0,1],
                fn: function(v) {
                    return v[1].slice(0, v[0]).reduce(function (memo, o) { return memo + o }, 0);
                }
            },
            {
                attributeName: 'snake_damage',
                label: 'Max Damage:',
                ignoreTooltip: true,
                controlType: 'text',
                controls: [0,1],
                fn: function(v) {
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
                fn: function(v,a) {
                    return (v/a).toFixed(2);
                }
            },
            {
                attributeName: 'absorption_tooltip',
                label: '%DAMAGE REDUCTION:',
                ignoreTooltip: true,
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a,parent,index) {
                    return parent.ability().getAbilityPropertyValue(parent.ability().abilities()[index], 'damage')*v;
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
                fn: function(v,a,parent,index,abilityModel,ability) {
                    return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
                }
            },
            {
                attributeName: 'slow',
                label: '%SLOW:',
                ignoreTooltip: true,
                controlType: 'text',
                noLevel: true,
                fn: function(v,a,parent,index,abilityModel,ability) {
                    return abilityModel.getAbilityAttributeValue(ability.attributes(), 'slow',ability.level())*v;
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
                fn: function(v,a,parent,index,abilityModel,ability) {
                    var arrow_min_stun = abilityModel.getAbilityAttributeValue(ability.attributes(), 'arrow_min_stun',0);
                    var arrow_max_stunrange = abilityModel.getAbilityAttributeValue(ability.attributes(), 'arrow_max_stunrange',0);
                    var scale = Math.min(v, arrow_max_stunrange) / arrow_max_stunrange;
                    return Math.max(arrow_min_stun, Math.floor(a * scale / 0.1) * 0.1);
                }
            },
            {
                attributeName: 'arrow_bonus_damage',
                label: 'TOTAL DAMAGE:',
                ignoreTooltip: true,
                controlType: 'text',
                fn: function(v,a,parent,index,abilityModel,ability) {
                    var ability = ability;
                    var damage = ability.damage()[ability.level()-1];
                    var arrow_max_stunrange = abilityModel.getAbilityAttributeValue(ability.attributes(), 'arrow_max_stunrange',0);
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
                fn: function(v,a) {
                    return v*a;
                },
                returnProperty: 'bonusAgility'
            },
            {
                attributeName: 'points_per_tick',
                label: 'STR SHIFT LOSS:',
                ignoreTooltip: true,
                controlType: 'text',
                fn: function(v,a) {
                    return -v*a;
                },
                returnProperty: 'bonusStrength'
            },
            {
                attributeName: 'bonus_attributes',
                label: 'SHIFT TIME:',
                controlType: 'text',
                fn: function(v,a) {
                    return a;
                },
                returnProperty: 'bonusAgility2'
            },
            {
                attributeName: 'morph_cooldown',
                label: 'SHIFT TIME:',
                ignoreTooltip: true,
                controlType: 'text',
                fn: function(v,a) {
                    return v*a;
                }
            },
            {
                attributeName: 'mana_cost',
                label: 'SHIFT MANA COST:',
                ignoreTooltip: true,
                controlType: 'text',
                fn: function(v,a,parent,index) {
                    return v*a*parent.ability().getAbilityAttributeValue(parent.ability().abilities()[index].attributes(), 'morph_cooldown',parent.ability().abilities()[index].level());
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
                fn: function(v,a) {
                    return v*a;
                },
                returnProperty: 'bonusStrength'
            },
            {
                attributeName: 'points_per_tick',
                label: 'AGI SHIFT LOSS:',
                ignoreTooltip: true,
                controlType: 'text',
                fn: function(v,a) {
                    return -v*a;
                },
                returnProperty: 'bonusAgility'
            },
            {
                attributeName: 'bonus_attributes',
                label: 'SHIFT TIME:',
                controlType: 'text',
                fn: function(v,a) {
                    return a;
                },
                returnProperty: 'bonusStrength2'
            },
            {
                attributeName: 'morph_cooldown',
                label: 'SHIFT TIME:',
                ignoreTooltip: true,
                controlType: 'text',
                fn: function(v,a) {
                    return v*a;
                }
            },
            {
                attributeName: 'mana_cost',
                label: 'SHIFT MANA COST:',
                ignoreTooltip: true,
                controlType: 'text',
                fn: function(v,a,parent,index) {
                    return v*a*parent.ability().getAbilityAttributeValue(parent.ability().abilities()[index].attributes(), 'morph_cooldown',parent.ability().abilities()[index].level());
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
                fn: function(v,a) {
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
                fn: function(v,a) {
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
                fn: function(v,a,parent,index,abilityModel,ability) {
                    var hero_multiplier = abilityModel.getAbilityAttributeValue(ability.attributes(), 'hero_multiplier',0)
                    return (v[0]+v[1]*hero_multiplier)*a;
                },
                returnProperty: 'healthregen'
            },
            {
                attributeName: 'mana_regen',
                label: 'Total Damage',
                controlType: 'text',
                controls: [0,1],
                fn: function(v,a,parent,index,abilityModel,ability) {
                    var hero_multiplier = abilityModel.getAbilityAttributeValue(ability.attributes(), 'hero_multiplier',0)
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
                attributeName: 'bonus_attack_speed_night',
                label: '%CHANCE TO MISS:',
                ignoreTooltip: true,
                controlType: 'text',
                fn: function(v,a,parent,index,abilityModel,ability) {
                    if (v) {
                        return abilityModel.getAbilityAttributeValue(ability.attributes(), 'miss_rate_night',ability.level());
                    }
                    else {
                        return abilityModel.getAbilityAttributeValue(ability.attributes(), 'miss_rate_day',ability.level());
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
                fn: function(v,a) {
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
                fn: function(v,a) {
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
                fn: function(v,a) {
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
                fn: function(v,a) {
                    return v*a;
                }
            },
            {
                attributeName: 'slow_movement_speed_pct',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a,parent,index,abilityModel,ability) {
                    return abilityModel.getAbilityPropertyValue(ability, 'damage')*v;
                }
            },
            {
                attributeName: 'rot_slow',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a) {
                    return v*a;
                },
                returnProperty: 'bonusStrength'
            },
            {
                attributeName: 'flesh_heap_magic_resist',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a) {
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
                fn: function(v,a) {
                    return v*a;
                }
            },
            {
                attributeName: 'mana_regen',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a) {
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
                attributeName: 'damage',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
                    return v*a;
                }
            }
        ],
        'razor_plasma_field': [
            {
                label: 'Duration',
                controlType: 'input'
            },
            {
                attributeName: 'damage',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
                    return v*a;
                }
            }
        ],
        'razor_static_link': [
            {
                label: 'Duration',
                controlType: 'input'
            },
            {
                attributeName: 'damage',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
                    return v*a;
                }
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
                fn: function(v,a) {
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
                fn: function(v,a,parent,index,abilityModel,ability) {
                    return a * (1 - v*abilityModel.getAbilityAttributeValue(ability.attributes(), 'jump_damage_reduction_pct',ability.level())/100);
                }
            },
            {
                attributeName: 'hero_attack_damage_reduction',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a,parent,index) {
                    return parent.ability().getAbilityPropertyValue(parent.ability().abilities()[index], 'damage')*v;
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
                fn: function(v,a) {
                    return v*a;
                }
            },
            {
                attributeName: 'epicenter_slow',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
                    return a;
                },
                returnProperty: 'movementSpeedPctReduction'
            },
            {
                attributeName: 'epicenter_slow_as',
                label: '%ATTACK SLOW:',
                ignoreTooltip: true,
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a) {
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
                fn: function(v,a) {
                    return v*a;
                },
                returnProperty: 'bonusDamage'
            }
        ],
        'nevermore_requiem': [
            {
                label: 'Duration',
                controlType: 'input'
            },
            {
                attributeName: 'damage',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
                    return v*a;
                }
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
                fn: function(v,a,parent,index) {
                    return parent.ability().getAbilityPropertyValue(parent.ability().abilities()[index], 'damage')*v;
                }
            }
        ],
        'silencer_curse_of_the_silent': [
            {
                label: 'Duration',
                controlType: 'input'
            },
            {
                attributeName: 'health_damage',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
                    return v*a;
                }
            },
            {
                attributeName: 'mana_damage',
                label: 'Mana Loss',
                controlType: 'text',
                fn: function(v,a) {
                    return v*a;
                }
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
                fn: function(v,a) {
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
                fn: function(v,a) {
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
                fn: function(v,a) {
                    return v*a;
                },
                returnProperty: 'bonusAgility'
            },
            {
                attributeName: 'stat_loss',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a,parent) {
                    return v*parent.health()*a/100;
                }
            },
            {
                attributeName: 'bonus_regen_pct',
                label: 'HEALTH GAINED PER SECOND:',
                ignoreTooltip: true,
                controlType: 'text',
                fn: function(v,a,parent) {
                    return parent.health()*a/100;
                },
                returnProperty: 'healthregen'
            },
            {
                attributeName: 'bonus_movement_speed',
                label: '%MOVE SPEED:',
                ignoreTooltip: true,
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a,parent,index) {
                    return parent.ability().getAbilityPropertyValue(parent.ability().abilities()[index], 'damage')*v;
                }
            },
            {
                attributeName: 'building_damage',
                label: 'BUILDING DAMAGE:',
                ignoreTooltip: true,
                controlType: 'text',
                fn: function(v,a) {
                    return v*a;
                }
            },
            {
                attributeName: 'slow_movement_speed',
                label: 'Enemy Movement Speed Slow',
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a) {
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
                fn: function(v,a) {
                    return -a;
                },
                returnProperty: 'damageReduction'
            },
            {
                attributeName: 'damage_reflection_pct',
                label: 'DAMAGE REFLECTED:',
                ignoreTooltip: true,
                controlType: 'text',
                fn: function(v,a) {
                    return v*a/100;
                }
            }
        ],
        'storm_spirit_ball_lightning': [
            {
                label: 'Duration',
                controlType: 'input'
            },
            {
                attributeName: 'damage',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
                    return v*a;
                }
            }
        ],
        'templar_assassin_trap': [
            {
                label: 'Duration',
                controlType: 'input'
            },
            {
                attributeName: 'damage',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
                    return v*a;
                }
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
                fn: function(v,a) {
                    return v*a;
                },
                returnProperty: 'armor'
            },
            {
                attributeName: 'bonus_hp_regen',
                label: 'Total HP Regen Bonus',
                controlType: 'text',
                noLevel: true,
                fn: function(v,a) {
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
                attributeName: 'damage',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
                    return v*a;
                }
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
                fn: function(v,a) {
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
                fn: function(v,a) {
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
                fn: function(v,a) {
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
                fn: function(v,a,parent,index) {
                    return v*a;
                }
            },
            {
                attributeName: 'damage',
                label: 'AFTER REDUCTIONS:',
                ignoreTooltip: true,
                controlType: 'text',
                fn: function(v,a,parent,index) {
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
                fn: function(v,a,parent,index) {
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
                fn: function(v,a,parent,index) {
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
                fn: function(v,a,parent,index) {
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
                fn: function(v,a,parent,index) {
                    return v*a;
                }
            },
            {
                attributeName: 'damage',
                label: 'AFTER REDUCTIONS:',
                ignoreTooltip: true,
                controlType: 'text',
                fn: function(v,a,parent,index) {
                    var magic_reduction = parent.enemy().totalMagicResistance();
                    return (v * a * (1 - magic_reduction / 100)).toFixed(2);
                }
            }
        ],
        'tinker_march_of_the_machines': [
            {
                label: 'Duration',
                controlType: 'input'
            },
            {
                attributeName: 'damage',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
                    return v*a;
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
                fn: function(v,a) {
                    return v*a;
                }
            },
            {
                attributeName: 'movement_slow',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a) {
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
                fn: function(v,a) {
                    return v*a;
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
                fn: function(v,a) {
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
                attributeName: 'speed_slow',
                label: 'DAMAGE/HEAL:',
                controlType: 'text',
                fn: function(v,a) {
                    return -a;
                },
                returnProperty: 'movementSpeedPctReduction'
            },
            {
                attributeName: 'max_damage_amp',
                label: '%DAMAGE AMP:',
                ignoreTooltip: true,
                controlType: 'text',
                fn: function(v,a,parent,index) {
                    var ability = this.abilities().find(function(b) {
                        return b.name() == 'undying_flesh_golem';
                    });
                    var minRadius = this.getAbilityAttributeValue(ability.attributes(), 'full_power_radius', ability.level());
                    var maxRadius = this.getAbilityAttributeValue(ability.attributes(), 'radius', ability.level());
                    var value = Math.min(Math.max(v, minRadius), maxRadius);
                    if (parent.inventory.hasScepter()) {
                        var maxAmp = this.getAbilityAttributeValue(ability.attributes(), 'max_damage_amp_scepter', ability.level());
                        var minAmp = this.getAbilityAttributeValue(ability.attributes(), 'min_damage_amp_scepter', ability.level());
                    }
                    else {
                        var maxAmp = this.getAbilityAttributeValue(ability.attributes(), 'max_damage_amp', ability.level());
                        var minAmp = this.getAbilityAttributeValue(ability.attributes(), 'min_damage_amp', ability.level());
                    }
                    var scale = 1 - ((value - minRadius) / (maxRadius - minRadius));
                    var mult = (maxAmp - minAmp) * scale + minAmp;
                    return mult.toFixed(2);
                },
                returnProperty: 'damageAmplification'
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
                fn: function(v,a) {
                    return v*a;
                },
                returnProperty: 'bonusDamage'
            }
        ],
        'ursa_enrage': [
            {
                label: 'Current HP',
                controlType: 'input'
            },
            {
                attributeName: 'life_damage_bonus_percent',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
                    return v*a/100;
                },
                returnProperty: 'bonusDamage'
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
                fn: function(v,a,parent,index) {
                    return parent.ability().getAbilityAttributeValue(parent.ability().abilities()[index].attributes(), 'strike_damage',parent.ability().abilities()[index].level()) + Math.floor(v/3)*a;
                }
            },
            {
                attributeName: 'movement_slow',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a) {
                    return v*a;
                }
            },
            {
                attributeName: 'movement_speed',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
                    return a;
                },
                returnProperty: 'movementSpeedPctReduction'
            }
        ],
        'venomancer_plague_ward': [
            {
                label: 'Duration',
                controlType: 'input'
            },
            {
                attributeName: 'damage',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
                    return v*a;
                }
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
                fn: function(v,a) {
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
                fn: function(v,a) {
                    return v*a;
                }
            },
            {
                attributeName: 'bonus_movement_speed',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
                    return a;
                },
                returnProperty: 'movementSpeedPctReduction'
            },
            {
                attributeName: 'bonus_attack_speed',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a) {
                    return v*a;
                }
            },
            {
                attributeName: 'bonus_movement_speed',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
                    return a;
                },
                returnProperty: 'movementSpeedPctReduction'
            },
            {
                attributeName: 'bonus_attack_speed',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
                    return a;
                },
                returnProperty: 'attackspeedreduction'
            },
            {
                attributeName: 'bonus_magic_resistance',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a) {
                    return v*a;
                }
            },
            {
                attributeName: 'bonus_movement_speed',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
                    return a;
                },
                returnProperty: 'movementSpeedPctReduction'
            },
            {
                attributeName: 'bonus_attack_speed',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
                    return a;
                },
                returnProperty: 'attackspeedreduction'
            }
        ],
        'visage_soul_assumption': [
            {
                label: 'Duration',
                controlType: 'input'
            },
            {
                attributeName: 'damage',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
                    return v*a;
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
                fn: function(v,a) {
                    return v*a;
                },
                returnProperty: 'armor'
            },
            {
                attributeName: 'bonus_resist',
                label: '%RESIST:',
                ignoreTooltip: true,
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a,parent,index) {
                    return parent.ability().getAbilityPropertyValue(parent.ability().abilities()[index], 'damage')*v;
                }
            }
        ],
        'warlock_upheaval': [
            {
                label: 'Duration',
                controlType: 'input'
            },
            {
                attributeName: 'slow_rate',
                label: 'DAMAGE:',
                controlType: 'text',
                fn: function(v,a) {
                    return -v*a;
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
                fn: function(v,a) {
                    return v*a;
                }
            },
            {
                attributeName: 'armor_reduction',
                label: 'DAMAGE:',
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a,parent,index) {
                    return parent.ability().getAbilityPropertyValue(parent.ability().abilities()[index], 'damage')*v;
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
                fn: function(v,a,parent,index) {
                    var base_heal = parent.ability().getAbilityAttributeValue(parent.ability().abilities()[index].attributes(), 'heal_additive',parent.ability().abilities()[index].level());
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
                fn: function(v,a) {
                    return v*a;
                }
            },
            {
                attributeName: 'creep_damage',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
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
                fn: function(v,a,parent,index) {
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
                fn: function(v,a,parent,index) {
                    return v*a;
                }
            },
            {
                attributeName: 'bonus_attack_speed',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
                    return a;
                },
                returnProperty: 'attackspeed'
            },
            {
                attributeName: 'bonus_damage_pct',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
                    return a;
                },
                returnProperty: 'damageReduction'
            }
        ],
        'witch_doctor_paralyzing_cask': [
            {
                label: 'Duration',
                controlType: 'input'
            },
            {
                attributeName: 'damage',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
                    return v*a;
                }
            }
        ],
        'witch_doctor_voodoo_restoration': [
            {
                label: 'Duration',
                controlType: 'input'
            },
            {
                attributeName: 'damage',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
                    return v*a;
                }
            }
        ],
        'witch_doctor_maledict': [
            {
                label: 'Duration',
                controlType: 'input'
            },
            {
                attributeName: 'damage',
                label: 'Total Damage',
                controlType: 'text',
                fn: function(v,a) {
                    return v*a;
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
                fn: function(v,a) {
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
                fn: function(v,a) {
                    return v*a/100;
                }
            }
        ]
    }
});