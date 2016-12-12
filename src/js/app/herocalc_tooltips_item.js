'use strict';
var $ = require('jquery');

var itemtooltipdata = {};
var ability_vars = {
    '$health': 'Health',
    '$mana': 'Mana',
    '$armor': 'Armor',
    '$damage': 'Damage',
    '$str': 'Strength',
    '$int': 'Intelligence',
    '$agi': 'Agility',
    '$all': 'All Attributes',
    '$attack': 'Attack Speed',
    '$hp_regen': 'HP Regeneration',
    '$mana_regen': 'Mana Regeneration',
    '$move_speed': 'Movement Speed',
    '$evasion': 'Evasion',
    '$spell_resist': 'Spell Resistance',
    '$selected_attribute': 'Selected Attribute',
    '$selected_attrib': 'Selected Attribute',
    '$cast_range': 'Cast Range',
    '$attack_range': 'Attack Range'
}

var getTooltipItemDescription = function (item) {
    var d = item.description;
    for (var i = 0; i < item.attributes.length; i++) {
        if (item.attributes[i].name != null) {
            var attributeName = item.attributes[i].name;
            var attributeValue = item.attributes[i].value[0];
            for (var j = 1; j < item.attributes[i].value.length; j++) {
                attributeValue += ' / ' + item.attributes[i].value[j];
            }
            var regexp = new RegExp('%' + attributeName + '%', 'gi');
            d = d.replace(regexp, attributeValue );
        }
    }
    var regexp = new RegExp('%%', 'gi');
    d = d.replace(regexp,'%');
    regexp = new RegExp('\n', 'gi');
    d = d.replace(/\\n/g, '<br>');
    return d;
}

var getTooltipItemAttributes = function (item) {
    var a = '';
    for (var i = 0; i < item.attributes.length; i++) {
        if (item.attributes[i].tooltip != null) {
            var attributeTooltip = item.attributes[i].tooltip;
            var attributeValue = item.attributes[i].value[0];
            for (var j = 1; j < item.attributes[i].value.length; j++) {
                attributeValue += ' / ' + item.attributes[i].value[j];
            }
            var p = attributeTooltip.indexOf('%');
            if (p == 0) {
                attributeValue = attributeValue + '%';
                attributeTooltip = attributeTooltip.slice(1);
            }
            var d = attributeTooltip.indexOf('$');
            if (d != -1) {
                a = a + attributeTooltip.slice(0, d) + ' ' + attributeValue + ' ' + ability_vars[attributeTooltip.slice(d)] + '<br>';
            }
            else {
                a = a + attributeTooltip + ' ' + attributeValue + '<br>';
            }
        }
    }
    return a.trim('<br>');
}

var getTooltipItemCooldown = function (item) {
    var c = '';
    for (var i = 0; i < item.cooldown.length; i++) {
        c = c + ' ' + item.cooldown[i];
    }
    return c;
}

var getTooltipItemManaCost = function (item) {
    var c = '';
    for (var i = 0; i < item.manacost.length; i++) {
        if (item.manacost[i] > 0) {
            c = c + ' ' + item.manacost[i];
        }
    }
    return c;
}

var getItemTooltipData = function(itemData, el) {
    if (itemData['item_' + el] == undefined) {
        return undefined;
    }
    if (itemtooltipdata[el] == undefined) {
        var item = itemData['item_' + el];
        var data = $('<div>');
        data.append($('<span>').html(item.displayname).addClass('item_field item_name'));
        data.append($('<span>').html(item.itemcost).addClass('item_field item_cost'));
        data.append($('<hr>'));
        if (item.description != null) {
            data.append($('<div>').html(getTooltipItemDescription(item)).addClass('item_field item_description'));
        }
        var attributedata = getTooltipItemAttributes(item);
        if (attributedata != '') {
            data.append($('<div>').html(attributedata).addClass('item_field item_attributes'));
        }
        var cd = getTooltipItemCooldown(item);
        var mana = getTooltipItemManaCost(item);
        if (cd != '' || mana != '') {
            var cdmanacost = $('<div>').addClass('item_cdmana');
            if (cd != '') {
                cdmanacost.append($('<span>').html(cd).addClass('item_field item_cooldown'));
            }
            if (mana != '') {
                cdmanacost.append($('<span>').html(mana).addClass('item_field item_manacost'));
            }
            data.append(cdmanacost);
        }
        if (item.lore != null) {
            data.append($('<div>').html(item.lore).addClass('item_field item_lore'));
        }
        itemtooltipdata[el] = data.html();
        return data.html();
    }
    else {
        return itemtooltipdata[el];
    }
}

module.exports = getItemTooltipData;