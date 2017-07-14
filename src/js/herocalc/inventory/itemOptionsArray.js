var validItems = require("./validItems");
var ItemInput = require("./ItemInput");

var itemOptionsArray = {};

var init = function (itemData) {
    itemOptionsArray.items = [];
    for (var i = 0; i < validItems.length; i++) {
        itemOptionsArray.items.push(new ItemInput(itemData, validItems[i], itemData['item_' + validItems[i]].displayname));
    }
    return itemOptionsArray.items;
}

itemOptionsArray.init = init;

module.exports = itemOptionsArray;