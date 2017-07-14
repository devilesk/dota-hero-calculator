var HeroOption = require("./HeroOption");

var heroOptionsArray = {};

var init = function (heroData) {
    heroOptionsArray.items = [];
    for (var h in heroData) {
        heroOptionsArray.items.push(new HeroOption(h.replace('npc_dota_hero_', ''), heroData[h].displayname));
    }
    return heroOptionsArray.items;
}

heroOptionsArray.init = init;

module.exports = heroOptionsArray;