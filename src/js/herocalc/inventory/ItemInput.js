var ko = require('knockout');

var ItemInput = function (itemData, value, name, debuff, buff) {
    if (itemData['item_' + value].ItemAliases instanceof Array) {
        var itemAlias = itemData['item_' + value].ItemAliases.join(' ');
    }
    else {
        var itemAlias = itemData['item_' + value].ItemAliases;
    }
    this.value = ko.observable(value);
    this.debuff = ko.observable(debuff);
    this.buff = ko.observable(buff);
    if (this.debuff()) {
        this.value = ko.observable(value + '|' + debuff.id);
        this.name = ko.observable(name + ' (' + debuff.name + ')');
        this.displayname = ko.observable(name + ' (' + debuff.name + ') <span style="display:none">' + ';' + itemAlias + '</span>');
    }
    else if (this.buff()) {
        this.value = ko.observable(value + '|' + buff.id);
        this.name = ko.observable(name + ' (' + buff.name + ')');
        this.displayname = ko.observable(name + ' (' + buff.name + ') <span style="display:none">' + ';' + itemAlias + '</span>');
    }
    else {
        this.value = ko.observable(value);
        this.name = ko.observable(name);
        this.displayname = ko.observable(name + ' <span style="display:none">' + ';' + itemAlias + '</span>');
    }
};

module.exports = ItemInput;