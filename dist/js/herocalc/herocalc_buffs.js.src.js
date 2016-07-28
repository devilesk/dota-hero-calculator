define(['require','exports','module','herocalc_knockout','./herocalc_core'],function (require, exports, module) {
    'use strict';
    var ko = require('herocalc_knockout');
        
    var my = require("./herocalc_core").HEROCALCULATOR;

    my.prototype.BuffOption = function (hero, ability) {
        this.buffName = ability;
        if (my.prototype.heroData['npc_dota_hero_' + hero] == undefined) {
            this.hero = hero;
            this.abilityData = my.prototype.findWhere(my.prototype.unitData[hero].abilities, {name: ability})
            this.buffDisplayName = my.prototype.unitData[hero].displayname + ' - ' + this.abilityData.displayname;
        }
        else {
            this.hero = 'npc_dota_hero_' + hero;
            this.abilityData = my.prototype.findWhere(my.prototype.heroData['npc_dota_hero_' + hero].abilities, {name: ability})
            this.buffDisplayName = my.prototype.heroData['npc_dota_hero_' + hero].displayname + ' - ' + this.abilityData.displayname;        
            if (ability == 'sven_gods_strength') {
                this.buffDisplayName += ' (Aura for allies)';
            }
        }

    };
    
    my.prototype.ItemBuffOption = function (item) {
        this.buffName = item;
        if (my.prototype.heroData['npc_dota_hero_' + hero] == undefined) {
            this.hero = hero;
            this.abilityData = my.prototype.findWhere(my.prototype.unitData[hero].abilities, {name: item})
            this.buffDisplayName = my.prototype.unitData[hero].displayname + ' - ' + this.abilityData.displayname;        
        }
        else {
            this.hero = 'npc_dota_hero_' + hero;
            this.abilityData = my.prototype.findWhere(my.prototype.heroData['npc_dota_hero_' + hero].abilities, {name: item})
            this.buffDisplayName = my.prototype.heroData['npc_dota_hero_' + hero].displayname + ' - ' + this.abilityData.displayname;        
        }

    };
    
    my.prototype.BuffViewModel = function (a) {
        var self = new my.prototype.AbilityModel(ko.observableArray([]));
        self.availableBuffs = ko.observableArray([
            new my.prototype.BuffOption('abaddon', 'abaddon_frostmourne'),
            new my.prototype.BuffOption('axe', 'axe_culling_blade'),
            new my.prototype.BuffOption('beastmaster', 'beastmaster_inner_beast'),
            new my.prototype.BuffOption('bloodseeker', 'bloodseeker_bloodrage'),
            new my.prototype.BuffOption('bounty_hunter', 'bounty_hunter_track'),
            new my.prototype.BuffOption('centaur', 'centaur_stampede'),
            new my.prototype.BuffOption('crystal_maiden', 'crystal_maiden_brilliance_aura'),
            new my.prototype.BuffOption('dark_seer', 'dark_seer_surge'),
            new my.prototype.BuffOption('dazzle', 'dazzle_weave'),
            new my.prototype.BuffOption('drow_ranger', 'drow_ranger_trueshot'),
            new my.prototype.BuffOption('invoker', 'invoker_alacrity'),
            new my.prototype.BuffOption('wisp', 'wisp_tether'),
            new my.prototype.BuffOption('wisp', 'wisp_overcharge'),
            new my.prototype.BuffOption('kunkka', 'kunkka_ghostship'),
            new my.prototype.BuffOption('lich', 'lich_frost_armor'),
            new my.prototype.BuffOption('life_stealer', 'life_stealer_open_wounds'),
            new my.prototype.BuffOption('luna', 'luna_lunar_blessing'),
            new my.prototype.BuffOption('lycan', 'lycan_howl'),
            new my.prototype.BuffOption('magnataur', 'magnataur_empower'),
            new my.prototype.BuffOption('mirana', 'mirana_leap'),
            new my.prototype.BuffOption('ogre_magi', 'ogre_magi_bloodlust'),
            new my.prototype.BuffOption('omniknight', 'omniknight_guardian_angel'),
            new my.prototype.BuffOption('rubick', 'rubick_null_field'),
            new my.prototype.BuffOption('skeleton_king', 'skeleton_king_vampiric_aura'),
            new my.prototype.BuffOption('spirit_breaker', 'spirit_breaker_empowering_haste'),
            new my.prototype.BuffOption('sven', 'sven_warcry'),
            new my.prototype.BuffOption('sven', 'sven_gods_strength'),
            new my.prototype.BuffOption('treant', 'treant_living_armor'),
            new my.prototype.BuffOption('troll_warlord', 'troll_warlord_battle_trance'),
            new my.prototype.BuffOption('vengefulspirit', 'vengefulspirit_command_aura'),
            new my.prototype.BuffOption('npc_dota_neutral_alpha_wolf', 'alpha_wolf_critical_strike'),
            new my.prototype.BuffOption('npc_dota_neutral_alpha_wolf', 'alpha_wolf_command_aura'),
            new my.prototype.BuffOption('npc_dota_neutral_polar_furbolg_ursa_warrior', 'centaur_khan_endurance_aura'),
            new my.prototype.BuffOption('npc_dota_neutral_giant_wolf', 'giant_wolf_critical_strike'),
            new my.prototype.BuffOption('npc_dota_neutral_kobold_taskmaster', 'kobold_taskmaster_speed_aura'),
            new my.prototype.BuffOption('npc_dota_neutral_ogre_magi', 'ogre_magi_frost_armor'),
            new my.prototype.BuffOption('npc_dota_neutral_satyr_hellcaller', 'satyr_hellcaller_unholy_aura'),
            new my.prototype.BuffOption('npc_dota_neutral_enraged_wildkin', 'enraged_wildkin_toughness_aura'),
            new my.prototype.BuffOption('npc_dota_necronomicon_archer_1', 'necronomicon_archer_aoe')
        ]);
        self.availableDebuffs = ko.observableArray([
            new my.prototype.BuffOption('abaddon', 'abaddon_frostmourne'),
            new my.prototype.BuffOption('alchemist', 'alchemist_acid_spray'),
            new my.prototype.BuffOption('ancient_apparition', 'ancient_apparition_ice_vortex'),
            new my.prototype.BuffOption('axe', 'axe_battle_hunger'),
            new my.prototype.BuffOption('bane', 'bane_enfeeble'),
            new my.prototype.BuffOption('batrider', 'batrider_sticky_napalm'),
            new my.prototype.BuffOption('beastmaster', 'beastmaster_primal_roar'),
            new my.prototype.BuffOption('bounty_hunter', 'bounty_hunter_jinada'),
            new my.prototype.BuffOption('brewmaster', 'brewmaster_thunder_clap'),
            new my.prototype.BuffOption('brewmaster', 'brewmaster_drunken_haze'),
            new my.prototype.BuffOption('bristleback', 'bristleback_viscous_nasal_goo'),
            new my.prototype.BuffOption('broodmother', 'broodmother_incapacitating_bite'),
            new my.prototype.BuffOption('centaur', 'centaur_stampede'),
            new my.prototype.BuffOption('chen', 'chen_penitence'),
            new my.prototype.BuffOption('crystal_maiden', 'crystal_maiden_crystal_nova'),
            new my.prototype.BuffOption('crystal_maiden', 'crystal_maiden_freezing_field'),
            new my.prototype.BuffOption('dazzle', 'dazzle_weave'),
            new my.prototype.BuffOption('drow_ranger', 'drow_ranger_frost_arrows'),
            new my.prototype.BuffOption('earth_spirit', 'earth_spirit_rolling_boulder'),
            new my.prototype.BuffOption('elder_titan', 'elder_titan_natural_order'),
            new my.prototype.BuffOption('elder_titan', 'elder_titan_earth_splitter'),
            new my.prototype.BuffOption('enchantress', 'enchantress_untouchable'),
            new my.prototype.BuffOption('enchantress', 'enchantress_enchant'),
            new my.prototype.BuffOption('faceless_void', 'faceless_void_time_walk'),
            new my.prototype.BuffOption('huskar', 'huskar_life_break'),
            new my.prototype.BuffOption('invoker', 'invoker_ghost_walk'),
            new my.prototype.BuffOption('invoker', 'invoker_ice_wall'),
            new my.prototype.BuffOption('wisp', 'wisp_tether'),
            new my.prototype.BuffOption('jakiro', 'jakiro_dual_breath'),
            new my.prototype.BuffOption('jakiro', 'jakiro_liquid_fire'),
            new my.prototype.BuffOption('keeper_of_the_light', 'keeper_of_the_light_blinding_light'),
            new my.prototype.BuffOption('kunkka', 'kunkka_torrent'),
            new my.prototype.BuffOption('lich', 'lich_frost_nova'),
            new my.prototype.BuffOption('lich', 'lich_frost_armor'),
            new my.prototype.BuffOption('lich', 'lich_chain_frost'),
            new my.prototype.BuffOption('life_stealer', 'life_stealer_open_wounds'),
            new my.prototype.BuffOption('lion', 'lion_voodoo'),
            new my.prototype.BuffOption('magnataur', 'magnataur_skewer'),
            new my.prototype.BuffOption('medusa', 'medusa_stone_gaze'),
            new my.prototype.BuffOption('meepo', 'meepo_geostrike'),
            new my.prototype.BuffOption('naga_siren', 'naga_siren_rip_tide'),
            new my.prototype.BuffOption('night_stalker', 'night_stalker_void'),
            new my.prototype.BuffOption('night_stalker', 'night_stalker_crippling_fear'),
            new my.prototype.BuffOption('night_stalker', 'night_stalker_darkness'),
            new my.prototype.BuffOption('ogre_magi', 'ogre_magi_ignite'),
            new my.prototype.BuffOption('omniknight', 'omniknight_degen_aura'),
            new my.prototype.BuffOption('phantom_assassin', 'phantom_assassin_stifling_dagger'),
            new my.prototype.BuffOption('phantom_lancer', 'phantom_lancer_spirit_lance'),
            new my.prototype.BuffOption('pudge', 'pudge_rot'),
            new my.prototype.BuffOption('pugna', 'pugna_decrepify'),
            new my.prototype.BuffOption('queenofpain', 'queenofpain_shadow_strike'),
            new my.prototype.BuffOption('riki', 'riki_smoke_screen'),
            new my.prototype.BuffOption('rubick', 'rubick_fade_bolt'),
            new my.prototype.BuffOption('sand_king', 'sandking_epicenter'),
            new my.prototype.BuffOption('nevermore', 'nevermore_dark_lord'),
            new my.prototype.BuffOption('shadow_shaman', 'shadow_shaman_voodoo'),
            new my.prototype.BuffOption('skeleton_king', 'skeleton_king_hellfire_blast'),
            new my.prototype.BuffOption('skeleton_king', 'skeleton_king_reincarnation'),
            new my.prototype.BuffOption('skywrath_mage', 'skywrath_mage_concussive_shot'),
            new my.prototype.BuffOption('skywrath_mage', 'skywrath_mage_ancient_seal'),
            new my.prototype.BuffOption('slardar', 'slardar_slithereen_crush'),
            new my.prototype.BuffOption('slardar', 'slardar_amplify_damage'),
            new my.prototype.BuffOption('slark', 'slark_essence_shift'),
            new my.prototype.BuffOption('sniper', 'sniper_shrapnel'),
            new my.prototype.BuffOption('spectre', 'spectre_spectral_dagger'),
            new my.prototype.BuffOption('storm_spirit', 'storm_spirit_overload'),
            new my.prototype.BuffOption('templar_assassin', 'templar_assassin_meld'),
            new my.prototype.BuffOption('tidehunter', 'tidehunter_gush'),
            new my.prototype.BuffOption('tinker', 'tinker_laser'),
            new my.prototype.BuffOption('treant', 'treant_leech_seed'),
            new my.prototype.BuffOption('tusk', 'tusk_frozen_sigil'),
            new my.prototype.BuffOption('undying', 'undying_flesh_golem'),
            new my.prototype.BuffOption('ursa', 'ursa_earthshock'),
            new my.prototype.BuffOption('vengefulspirit', 'vengefulspirit_wave_of_terror'),
            new my.prototype.BuffOption('vengefulspirit', 'vengefulspirit_command_aura'),
            new my.prototype.BuffOption('venomancer', 'venomancer_venomous_gale'),
            new my.prototype.BuffOption('venomancer', 'venomancer_poison_sting'),
            new my.prototype.BuffOption('viper', 'viper_poison_attack'),
            new my.prototype.BuffOption('viper', 'viper_corrosive_skin'),
            new my.prototype.BuffOption('viper', 'viper_viper_strike'),
            new my.prototype.BuffOption('visage', 'visage_grave_chill'),
            new my.prototype.BuffOption('warlock', 'warlock_upheaval'),
            new my.prototype.BuffOption('weaver', 'weaver_the_swarm'),
            new my.prototype.BuffOption('windrunner', 'windrunner_windrun'),
            new my.prototype.BuffOption('winter_wyvern', 'winter_wyvern_arctic_burn'),
            new my.prototype.BuffOption('winter_wyvern', 'winter_wyvern_splinter_blast'),
            new my.prototype.BuffOption('npc_dota_neutral_ghost', 'ghost_frost_attack'),
            new my.prototype.BuffOption('npc_dota_neutral_polar_furbolg_ursa_warrior', 'polar_furbolg_ursa_warrior_thunder_clap'),
            new my.prototype.BuffOption('npc_dota_neutral_ogre_magi', 'ogre_magi_frost_armor'),
            new my.prototype.BuffOption('npc_dota_neutral_satyr_trickster', 'satyr_trickster_purge'),
            new my.prototype.BuffOption('npc_dota_neutral_enraged_wildkin', 'enraged_wildkin_tornado')
        ]);
        self.selectedBuff = ko.observable(self.availableBuffs()[0]);
        
        self.buffs = ko.observableArray([]);
        self.itemBuffs = new my.prototype.InventoryViewModel();
        
        self.addBuff = function (data, event) {
            if (my.prototype.findWhere(self.buffs(), { name: self.selectedBuff().buffName })  == undefined) {
                var a = ko.mapping.fromJS(self.selectedBuff().abilityData);
                a.isActive = ko.observable(false);
                a.isDetail = ko.observable(false);
                a.baseDamage = ko.observable(0);
                a.bash = ko.observable(0);
                a.bashBonusDamage = ko.observable(0);
                a.bonusDamage = ko.observable(0);
                a.bonusDamageOrb = ko.observable(0);
                a.bonusDamagePct = ko.observable(0);
                a.bonusDamagePrecisionAura = ko.observable(0);
                a.bonusDamageReduction = ko.observable(0);
                a.bonusHealth = ko.observable(0);
                a.bonusStrength = ko.observable(0);
                a.bonusStrength2 = ko.observable(0);
                a.bonusAgility = ko.observable(0);
                a.bonusAgility2 = ko.observable(0);
                a.bonusInt = ko.observable(0);
                a.bonusAllStatsReduction = ko.observable(0);
				a.damageAmplification = ko.observable(0);
				a.damageReduction = ko.observable(0);
                a.evasion = ko.observable(0);
                a.magicResist = ko.observable(0);
                a.manaregen = ko.observable(0);
                a.manaregenreduction = ko.observable(0);
                a.missChance = ko.observable(0);
                a.movementSpeedFlat = ko.observable(0);
                a.movementSpeedPct = ko.observable(0);
                a.movementSpeedPctReduction = ko.observable(0);
                a.turnRateReduction = ko.observable(0);
                a.attackrange = ko.observable(0);
                a.attackspeed = ko.observable(0);
                a.attackspeedreduction = ko.observable(0);
                a.armor = ko.observable(0);
                a.armorReduction = ko.observable(0);
                a.healthregen = ko.observable(0);
                a.lifesteal = ko.observable(0);
                a.visionnight = ko.observable(0);
                a.visionday = ko.observable(0);
                switch (a.name()) {
                    case 'invoker_cold_snap':
                    case 'invoker_ghost_walk':
                    case 'invoker_tornado':
                    case 'invoker_emp':
                    case 'invoker_alacrity':
                    case 'invoker_chaos_meteor':
                    case 'invoker_sun_strike':
                    case 'invoker_forge_spirit':
                    case 'invoker_ice_wall':
                    case 'invoker_deafening_blast':
                        a.level(1);
                    break;
                }
                self.abilities.push(a);
                self.buffs.push({ name: self.selectedBuff().buffName, hero: self.selectedBuff().hero, data: a });
            }
        };
        
        self.removeBuff = function (data, event, abilityName) {
            if (my.prototype.findWhere(self.buffs(), { name: abilityName })  != undefined) {
                    self.buffs.remove(my.prototype.findWhere(self.buffs(), { name: abilityName }));
                    if (self.abilityControlData[abilityName] != undefined) {
                        for (var i = 0; i < self.abilityControlData[abilityName].data.length; i++) {
                            if (self.abilityControlData[abilityName].data[i].controlVal.dispose != undefined) {
                                self.abilityControlData[abilityName].data[i].controlVal.dispose();
							}
							if (self.abilityControlData[abilityName].data[i].clean != undefined) {
                                self.abilityControlData[abilityName].data[i].clean.dispose();
                            }
                        }
                        self.abilityControlData[abilityName] = undefined;
                    }
                    for (var i = 0; i < self.abilities().length; i++) {
                        if (self.abilities()[i].name() == abilityName) {
                            self.abilities()[i].level(0);
                            self.abilities.remove(self.abilities()[i]);
                            break;
                        }
                    }
            }
        };
        self.toggleBuff = function (index, data, event) {
            if (self.buffs()[index()].data.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') < 0) {
                if (self.buffs()[index()].data.isActive()) {
                    self.buffs()[index()].data.isActive(false);
                    self.abilities()[index()].isActive(false);
                }
                else {
                    self.buffs()[index()].data.isActive(true);
                    self.abilities()[index()].isActive(true);
                }
            }
        }.bind(this);

        self.toggleBuffDetail = function (index, data, event) {
            if (self.buffs()[index()].data.isDetail()) {
                self.buffs()[index()].data.isDetail(false);
            }
            else {
                self.buffs()[index()].data.isDetail(true);
            }
        }.bind(this);

        // Overrides the ability module function to remove available skill point check
        self.levelUpAbility = function (index, data, event, hero) {
            if (self.abilities()[index()].level() < hero.getAbilityLevelMax(data)) {
                switch(self.abilities()[index()].abilitytype()) {
                    case 'DOTA_ABILITY_TYPE_ULTIMATE':
                        self.abilities()[index()].level(self.abilities()[index()].level() + 1);
                    break;
                    default:
                        self.abilities()[index()].level(self.abilities()[index()].level() + 1);
                    break;
                }
                switch (self.abilities()[index()].name()) {
                    case 'beastmaster_call_of_the_wild':
                    case 'chen_test_of_faith':
                    case 'morphling_morph_agi':
                    case 'shadow_demon_shadow_poison':
                        self.abilities()[index() + 1].level(self.abilities()[index()].level());
                    break;
                    case 'morphling_morph_str':
                        self.abilities()[index() - 1].level(self.abilities()[index()].level());
                    break;
                    case 'keeper_of_the_light_spirit_form':
                        self.abilities()[index() - 1].level(self.abilities()[index()].level());
                        self.abilities()[index() - 2].level(self.abilities()[index()].level());
                    case 'nevermore_shadowraze1':
                        self.abilities()[index() + 1].level(self.abilities()[index()].level());
                        self.abilities()[index() + 2].level(self.abilities()[index()].level());
                    break;
                    case 'nevermore_shadowraze2':
                        self.abilities()[index() - 1].level(self.abilities()[index()].level());
                        self.abilities()[index() + 1].level(self.abilities()[index()].level());
                    break;
                    case 'nevermore_shadowraze3':
                        self.abilities()[index() - 1].level(self.abilities()[index()].level());
                        self.abilities()[index() - 2].level(self.abilities()[index()].level());
                    break;
                }
            }
        };
        self.levelDownAbility = function (index, data, event, hero) {
            if (self.abilities()[index()].level() > 0) {
                self.abilities()[index()].level(self.abilities()[index()].level() - 1);
                switch (self.abilities()[index()].name()) {
                    case 'beastmaster_call_of_the_wild':
                    case 'chen_test_of_faith':
                    case 'morphling_morph_agi':
                    case 'shadow_demon_shadow_poison':
                        self.abilities()[index() + 1].level(self.abilities()[index()].level());
                    break;
                    case 'morphling_morph_str':
                        self.abilities()[index() - 1].level(self.abilities()[index()].level());
                    break;
                    case 'keeper_of_the_light_spirit_form':
                        self.abilities()[index() - 1].level(self.abilities()[index()].level());
                        self.abilities()[index() - 2].level(self.abilities()[index()].level());
                    case 'nevermore_shadowraze1':
                        self.abilities()[index() + 1].level(self.abilities()[index()].level());
                        self.abilities()[index() + 2].level(self.abilities()[index()].level());
                    break;
                    case 'nevermore_shadowraze2':
                        self.abilities()[index() - 1].level(self.abilities()[index()].level());
                        self.abilities()[index() + 1].level(self.abilities()[index()].level());
                    break;
                    case 'nevermore_shadowraze3':
                        self.abilities()[index() - 1].level(self.abilities()[index()].level());
                        self.abilities()[index() - 2].level(self.abilities()[index()].level());
                    break;
                    case 'ember_spirit_fire_remnant':
                        self.abilities()[index() - 1].level(self.abilities()[index()].level());
                    break;
                    case 'lone_druid_true_form':
                        self.abilities()[index() - 1].level(self.abilities()[index()].level());
                    break;
                }
            }
        };
        
        return self;
    }
});