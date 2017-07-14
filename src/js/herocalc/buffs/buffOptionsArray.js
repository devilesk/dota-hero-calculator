var BuffModel = require("./BuffModel");

var buffOptionsArray = {};

var init = function (heroData, unitData) {
    buffOptionsArray.items = [
        new BuffModel(heroData, unitData, 'abaddon', 'abaddon_frostmourne'),
        new BuffModel(heroData, unitData, 'axe', 'axe_culling_blade'),
        new BuffModel(heroData, unitData, 'beastmaster', 'beastmaster_inner_beast'),
        new BuffModel(heroData, unitData, 'bloodseeker', 'bloodseeker_bloodrage'),
        new BuffModel(heroData, unitData, 'bounty_hunter', 'bounty_hunter_track'),
        new BuffModel(heroData, unitData, 'centaur', 'centaur_stampede'),
        new BuffModel(heroData, unitData, 'crystal_maiden', 'crystal_maiden_brilliance_aura'),
        new BuffModel(heroData, unitData, 'dark_seer', 'dark_seer_surge'),
        new BuffModel(heroData, unitData, 'dazzle', 'dazzle_weave'),
        new BuffModel(heroData, unitData, 'drow_ranger', 'drow_ranger_trueshot'),
        new BuffModel(heroData, unitData, 'invoker', 'invoker_alacrity'),
        new BuffModel(heroData, unitData, 'wisp', 'wisp_tether'),
        new BuffModel(heroData, unitData, 'wisp', 'wisp_overcharge'),
        new BuffModel(heroData, unitData, 'kunkka', 'kunkka_ghostship'),
        new BuffModel(heroData, unitData, 'lich', 'lich_frost_armor'),
        new BuffModel(heroData, unitData, 'life_stealer', 'life_stealer_open_wounds'),
        new BuffModel(heroData, unitData, 'luna', 'luna_lunar_blessing'),
        new BuffModel(heroData, unitData, 'lycan', 'lycan_howl'),
        new BuffModel(heroData, unitData, 'magnataur', 'magnataur_empower'),
        new BuffModel(heroData, unitData, 'mirana', 'mirana_leap'),
        new BuffModel(heroData, unitData, 'ogre_magi', 'ogre_magi_bloodlust'),
        new BuffModel(heroData, unitData, 'omniknight', 'omniknight_guardian_angel'),
        new BuffModel(heroData, unitData, 'rubick', 'rubick_null_field'),
        new BuffModel(heroData, unitData, 'skeleton_king', 'skeleton_king_vampiric_aura'),
        new BuffModel(heroData, unitData, 'spirit_breaker', 'spirit_breaker_empowering_haste'),
        new BuffModel(heroData, unitData, 'sven', 'sven_warcry'),
        new BuffModel(heroData, unitData, 'sven', 'sven_gods_strength'),
        new BuffModel(heroData, unitData, 'treant', 'treant_living_armor'),
        new BuffModel(heroData, unitData, 'troll_warlord', 'troll_warlord_battle_trance'),
        new BuffModel(heroData, unitData, 'vengefulspirit', 'vengefulspirit_command_aura'),
        new BuffModel(heroData, unitData, 'npc_dota_neutral_alpha_wolf', 'alpha_wolf_critical_strike'),
        new BuffModel(heroData, unitData, 'npc_dota_neutral_alpha_wolf', 'alpha_wolf_command_aura'),
        new BuffModel(heroData, unitData, 'npc_dota_neutral_polar_furbolg_ursa_warrior', 'centaur_khan_endurance_aura'),
        new BuffModel(heroData, unitData, 'npc_dota_neutral_kobold_taskmaster', 'kobold_taskmaster_speed_aura'),
        new BuffModel(heroData, unitData, 'npc_dota_neutral_ogre_magi', 'ogre_magi_frost_armor'),
        new BuffModel(heroData, unitData, 'npc_dota_neutral_satyr_hellcaller', 'satyr_hellcaller_unholy_aura'),
        new BuffModel(heroData, unitData, 'npc_dota_neutral_enraged_wildkin', 'enraged_wildkin_toughness_aura'),
        new BuffModel(heroData, unitData, 'npc_dota_necronomicon_archer_1', 'necronomicon_archer_aoe')
    ];
    return buffOptionsArray.items;
}

buffOptionsArray.init = init;

module.exports = buffOptionsArray;