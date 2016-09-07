'use strict';
require('./polyfill');

function HEROCALCULATOR () {
   // ...
}

var my = HEROCALCULATOR;

my.prototype.heroData = {};
my.prototype.itemData = {};
my.prototype.unitData = {};
my.prototype.abilityData = {};

my.prototype.HeroOptions = [];

my.prototype.HeroOption = function (name, displayname, hero) {
    this.heroName = name;
    this.heroDisplayName = displayname;
    this.hero = hero;
};

my.prototype.idCounter = 0;
my.prototype.uniqueId = function (prefix) {
    var id = ++my.prototype.idCounter + '';
    return prefix ? prefix + id : id;
};
my.prototype.findWhere = function (arr, obj) {
    arrLoop: for (var i = 0; i < arr.length; i++) {
        objLoop: for (var key in obj) {
            if (arr[i][key] != obj[key]) {
                continue arrLoop;
            }
        }
        return arr[i];
    }
}
my.prototype.uniques = function (arr) {
    var a = [];
    for (var i=0, l=arr.length; i<l; i++)
        if (a.indexOf(arr[i]) === -1 && arr[i] !== '')
            a.push(arr[i]);
    return a;
}
my.prototype.union = function (a, b) {
    var arr = a.concat(b);
    return my.prototype.uniques(arr);
}

my.prototype.totalResources = 3;
my.prototype.numResourcesLoaded = 0;
my.prototype.onResourceLoaded = function (callback) {
    my.prototype.numResourcesLoaded++;
    if (my.prototype.numResourcesLoaded == my.prototype.totalResources) {
        
        my.prototype.availableBuffs = [
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
        ];

        my.prototype.availableDebuffs = [
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
        ];
        
        my.prototype.itemOptionsArr = [];
        for (var i = 0; i < my.prototype.validItems.length; i++) {
            my.prototype.itemOptionsArr.push(new my.prototype.ItemInput(my.prototype.validItems[i], my.prototype.itemData['item_' + my.prototype.validItems[i]].displayname));
        }
        
        var itemBuffs = ['assault', 'ancient_janggo', 'headdress', 'mekansm', 'pipe', 'ring_of_aquila', 'vladmir', 'ring_of_basilius', 'buckler', 'solar_crest'];
        my.prototype.itemBuffOptions = itemBuffs.map(function(item) {
            return new my.prototype.ItemInput(item, my.prototype.itemData['item_' + item].displayname);
        });
        
        var itemDebuffs = [
            {item: 'assault', debuff: null},
            {item: 'shivas_guard', debuff: null},
            {item: 'desolator', debuff: null},
            {item: 'medallion_of_courage', debuff: null},
            {item: 'radiance', debuff: null},
            {item: 'sheepstick', debuff: null},
            {item: 'veil_of_discord', debuff: null},
            {item: 'solar_crest', debuff: null},
            {item: 'silver_edge', debuff: {id: 'shadow_walk', name: 'Shadow Walk'}},
            {item: 'silver_edge', debuff: {id: 'maim', name: 'Lesser Maim'}}
        ]
        my.prototype.itemDebuffOptions = itemDebuffs.map(function(item) {
            return new my.prototype.ItemInput(item.item, my.prototype.itemData['item_' + item.item].displayname, item.debuff);
        });
        if (callback) callback();
    }
}

my.prototype.init = function (HERODATA_PATH,ITEMDATA_PATH,UNITDATA_PATH, callback) {
    my.prototype.numResourcesLoaded = 0;
    my.prototype.getJSON(HERODATA_PATH, function (data) {
        my.prototype.heroData = data;
        my.prototype.heroData['npc_dota_hero_chen'].abilities[2].behavior.push('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE');
        my.prototype.heroData['npc_dota_hero_nevermore'].abilities[1].behavior.push('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE');
        my.prototype.heroData['npc_dota_hero_nevermore'].abilities[2].behavior.push('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE');
        my.prototype.heroData['npc_dota_hero_morphling'].abilities[3].behavior.push('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE');
        my.prototype.heroData['npc_dota_hero_ogre_magi'].abilities[3].behavior.push('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE');
        my.prototype.heroData['npc_dota_hero_techies'].abilities[4].behavior.push('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE');
        my.prototype.heroData['npc_dota_hero_beastmaster'].abilities[2].behavior.push('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE');
        var index = my.prototype.heroData['npc_dota_hero_lone_druid'].abilities[3].behavior.indexOf('DOTA_ABILITY_BEHAVIOR_HIDDEN');
        my.prototype.heroData['npc_dota_hero_lone_druid'].abilities[3].behavior.splice(index, 1);
        
        index = my.prototype.heroData['npc_dota_hero_abaddon'].abilities[2].behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE');
        my.prototype.heroData['npc_dota_hero_abaddon'].abilities[2].behavior.splice(index, 1);
        
        index = my.prototype.heroData['npc_dota_hero_riki'].abilities[2].behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE');
        my.prototype.heroData['npc_dota_hero_riki'].abilities[2].behavior.splice(index, 1);
        
        for (var h in my.prototype.heroData) {
            my.prototype.HeroOptions.push(new my.prototype.HeroOption(h.replace('npc_dota_hero_', ''), my.prototype.heroData[h].displayname));
        }
            
        my.prototype.onResourceLoaded(callback);
    });
    my.prototype.getJSON(ITEMDATA_PATH, function (data) {
        my.prototype.itemData = data;
        my.prototype.onResourceLoaded(callback);
    });
    my.prototype.getJSON(UNITDATA_PATH, function (data) {
        my.prototype.unitData = data;
        my.prototype.onResourceLoaded(callback);
    });
}

my.prototype.extend = function (out) {
    out = out || {};

    for (var i = 1; i < arguments.length; i++) {
        var obj = arguments[i];

        if (!obj)
            continue;

        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'object')
                    out[key] = deepExtend(out[key], obj[key]);
                else
                    out[key] = obj[key];
            }
        }
    }

    return out;
};

my.prototype.getJSON = function (url, successCallback, errorCallback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            var data = JSON.parse(request.responseText);
            successCallback(data);
        } else {
            // We reached our target server, but it returned an error
            errorCallback();
        }
    };

    request.onerror = function() {
        // There was a connection error of some sort
        errorCallback();
    };

    request.send();
}
module.exports = HEROCALCULATOR;