var fs = require("fs");
var data = require("dota-datafiles");
var heroData = data.heroData;

var talentMap = [];

var heroIds = Object.keys(heroData).map(function (h) { return h.replace('npc_dota_hero_', '') });

for (var h in heroData) {
    var hero = heroData[h];
    var talents = [];
    // flatten talents
    hero.talents.forEach(function (talentGroup) { talents = talents.concat(talentGroup); });
    
    talents.forEach(function (talent) {
        if (talent.name.indexOf('special_bonus_unique_') != -1 && talent.displayname.indexOf('Cooldown') != -1) {
            talentMap.push(talent.name);
        }
    });
}

fs.writeFile('./src/js/herocalc/talents/cooldownTalents.json', JSON.stringify(talentMap, null, 4), function (err) {});