var HeroCalcData = require('./HeroCalcData') || {};
var getJSON = require("../util/getJSON");
var isEmpty = require("../util/isEmpty");
var isString = require("../util/isString");
var extend = function(out) {
  out = out || {};

  for (var i = 1; i < arguments.length; i++) {
    if (!arguments[i])
      continue;

    for (var key in arguments[i]) {
      if (arguments[i].hasOwnProperty(key))
        out[key] = arguments[i][key];
    }
  }

  return out;
};

var resourceCounter = 0;

var onResourceLoaded = function (callback) {
    resourceCounter--;
    if (resourceCounter === 0) {
        fixHeroData(HeroCalcData.heroData);
        modifyItemData(HeroCalcData.itemData);
        if (callback) callback();
    }
}

var modifyItemData = function (itemData) {
    itemData["item_bottle_doubledamage"] = {
        displayname: "Double Damage",
        name: "item_bottle_doubledamage",
        attributes: [{
            "name": "bottle_doubledamage", 
            "tooltip": "%BONUS ATTACK DAMAGE:", 
            "value": [
                100
            ]
        }]
    }
}

var fixHeroData = function (heroData) {
    heroData['npc_dota_hero_invoker'].abilities[5].behavior.push('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE');
    heroData['npc_dota_hero_chen'].abilities[2].behavior.push('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE');
    heroData['npc_dota_hero_nevermore'].abilities[1].behavior.push('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE');
    heroData['npc_dota_hero_nevermore'].abilities[2].behavior.push('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE');
    heroData['npc_dota_hero_morphling'].abilities[3].behavior.push('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE');
    heroData['npc_dota_hero_ogre_magi'].abilities[3].behavior.push('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE');
    heroData['npc_dota_hero_techies'].abilities[4].behavior.push('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE');
    heroData['npc_dota_hero_beastmaster'].abilities[2].behavior.push('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE');

    var index = heroData['npc_dota_hero_lone_druid'].abilities[3].behavior.indexOf('DOTA_ABILITY_BEHAVIOR_HIDDEN');
    heroData['npc_dota_hero_lone_druid'].abilities[3].behavior.splice(index, 1);

    index = heroData['npc_dota_hero_abaddon'].abilities[2].behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE');
    heroData['npc_dota_hero_abaddon'].abilities[2].behavior.splice(index, 1);

    index = heroData['npc_dota_hero_riki'].abilities[2].behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE');
    heroData['npc_dota_hero_riki'].abilities[2].behavior.splice(index, 1);
}

var init = function (HERODATA_PATH, ITEMDATA_PATH, UNITDATA_PATH, callback) {
    resourceCounter = 3;
    
    if (!HeroCalcData.heroData || isEmpty(HeroCalcData.heroData)) {
        if (isString(HERODATA_PATH)) {
            getJSON(HERODATA_PATH, function (data) {
                HeroCalcData.heroData = data;
                onResourceLoaded(callback);
            });
        }
        else if (!isEmpty(HERODATA_PATH)) {
            HeroCalcData.heroData = HERODATA_PATH;
            onResourceLoaded(callback);
        }
    }
    else {
        onResourceLoaded(callback);
    }
    
    if (!HeroCalcData.itemData || isEmpty(HeroCalcData.itemData)) {
        if (isString(ITEMDATA_PATH)) {
            getJSON(ITEMDATA_PATH, function (data) {
                HeroCalcData.itemData = data;
                onResourceLoaded(callback);
            });
        }
        else if (!isEmpty(ITEMDATA_PATH)) {
            HeroCalcData.itemData = ITEMDATA_PATH;
            onResourceLoaded(callback);
        }
    }
    else {
        onResourceLoaded(callback);
    }
    
    if (!HeroCalcData.unitData || isEmpty(HeroCalcData.unitData)) {
        if (isString(UNITDATA_PATH)) {
            getJSON(UNITDATA_PATH, function (data) {
                HeroCalcData.unitData = data;
                onResourceLoaded(callback);
            });
        }
        else if (!isEmpty(UNITDATA_PATH)) {
            HeroCalcData.unitData = UNITDATA_PATH;
            onResourceLoaded(callback);
        }
    }
    else {
        onResourceLoaded(callback);
    }
}
    
HeroCalcData.init = init;

module.exports = HeroCalcData;