var ItemInput = require("./ItemInput");
var itemBuffs = [
    {item: 'assault', buff: null},
    {item: 'ancient_janggo', buff: null},
    {item: 'guardian_greaves', buff: {id: 'guardian_aura', name: 'Guardian Aura'}},
    {item: 'headdress', buff: null},
    {item: 'mekansm', buff: null},
    {item: 'pipe', buff: null},
    {item: 'ring_of_aquila', buff: null},
    {item: 'vladmir', buff: null},
    {item: 'ring_of_basilius', buff: null},
    {item: 'buckler', buff: null},
    {item: 'solar_crest', buff: null},
    {item: 'bottle_doubledamage', buff: null},
    {item: 'helm_of_the_dominator', buff: null}
];

var itemBuffOptions = {};

var init = function (itemData) {
    itemBuffOptions.items = itemBuffs.map(function(item) {
        return new ItemInput(itemData, item.item, itemData['item_' + item.item].displayname, null, item.buff);
    }).sort(function (a, b) {
        if (a.displayname() < b.displayname()) return -1;
        if (a.displayname() > b.displayname()) return 1;
        return 0;
    });
    return itemBuffOptions.items;
}

itemBuffOptions.init = init;

module.exports = itemBuffOptions;