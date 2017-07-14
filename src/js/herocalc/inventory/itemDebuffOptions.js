var ItemInput = require("./ItemInput");
var itemDebuffs = [
    {item: 'assault', debuff: null},
    {item: 'shivas_guard', debuff: null},
    {item: 'desolator', debuff: null},
    {item: 'blight_stone', debuff: null},
    {item: 'medallion_of_courage', debuff: null},
    {item: 'radiance', debuff: null},
    {item: 'sheepstick', debuff: null},
    {item: 'veil_of_discord', debuff: null},
    {item: 'solar_crest', debuff: null},
    {item: 'silver_edge', debuff: {id: 'shadow_walk', name: 'Shadow Walk'}},
    {item: 'silver_edge', debuff: {id: 'maim', name: 'Lesser Maim'}}
]
var itemDebuffOptions = {};

var init = function (itemData) {
    itemDebuffOptions.items = itemDebuffs.map(function(item) {
        return new ItemInput(itemData, item.item, itemData['item_' + item.item].displayname, item.debuff);
    }).sort(function (a, b) {
        if (a.displayname() < b.displayname()) return -1;
        if (a.displayname() > b.displayname()) return 1;
        return 0;
    });
    return itemDebuffOptions.items;
}

itemDebuffOptions.init = init;

module.exports = itemDebuffOptions;