var ItemInput = require("./ItemInput");
var itemBuffs = ['assault', 'ancient_janggo', 'headdress', 'mekansm', 'pipe', 'ring_of_aquila', 'vladmir', 'ring_of_basilius', 'buckler', 'solar_crest', 'bottle_doubledamage', 'helm_of_the_dominator'];
var itemBuffOptions = {};

var init = function (itemData) {
    itemBuffOptions.items = itemBuffs.map(function(item) {
        return new ItemInput(itemData, item, itemData['item_' + item].displayname);
    }).sort(function (a, b) {
        if (a.displayname() < b.displayname()) return -1;
        if (a.displayname() > b.displayname()) return 1;
        return 0;
    });
    return itemBuffOptions.items;
}

itemBuffOptions.init = init;

module.exports = itemBuffOptions;