var fs = require("fs");
var data = require("dota-datafiles");
var heroData = data.heroData;

var talentMap = {};
var talentUnmapped = {};

var heroIds = Object.keys(heroData).map(function (h) { return h.replace('npc_dota_hero_', '') });

for (var h in heroData) {
    var hero = heroData[h];
    var talents = [];
    // flatten talents
    hero.talents.forEach(function (talentGroup) { talents = talents.concat(talentGroup); });
    
    talents.forEach(function (talent) {
        hero.abilities.forEach(function (ability) {
            if (talent.displayname.indexOf(ability.displayname) != -1) {
                talentMap[talent.name] = ability.name;
            }
        });
        if (talent.name.indexOf("special_bonus_unique_") != -1 && hero.abilities.every(function (ability) { return talent.displayname.indexOf(ability.displayname) == -1; })) {
            talentUnmapped[talent.name] = talent.displayname;
        }
    });
}

fs.writeFile('./src/herocalc/talents/talentMap.json', JSON.stringify(talentMap, null, 4), function (err) {});
fs.writeFile('./src/herocalc/talents/talentUnmap.json', JSON.stringify(talentUnmapped, null, 4), function (err) {});