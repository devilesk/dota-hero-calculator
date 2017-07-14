'use strict';
var $ = require('jquery');

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
var abilityTooltipData = {};
var abilityDamageTypes = {
    'DAMAGE_TYPE_MAGICAL': 'Magical',
    'DAMAGE_TYPE_PURE': 'Pure',
    'DAMAGE_TYPE_PHYSICAL': 'Physical',
    'DAMAGE_TYPE_COMPOSITE': 'Composite',
    'DAMAGE_TYPE_HP_REMOVAL': 'HP Removal'
}

var getTooltipAbilityDescription = function (item) {
    var d = item.description;
    for (var i = 0; i < item.attributes.length; i++) {
        if (item.attributes[i].name != null) {
            var attributeName = item.attributes[i].name;
            var attributeValue = item.attributes[i].value[0];
            for (var j = 1; j < item.attributes[i].value.length; j++) {
                attributeValue += ' / ' + item.attributes[i].value[j];
            }
            regexp = new RegExp('%' + attributeName + '%', 'gi');
            d = d.replace(regexp, attributeValue);
        }
    }
    var regexp = new RegExp('%%', 'gi');
    d = d.replace(regexp, '%');
    regexp = new RegExp('\n', 'gi');
    d = d.replace(/\\n/g, '<br>');
    return d;
}

var getTooltipAbilityAttributes = function (item) {
    var a = '';
    if (item.damage.length > 0 && item.damage.reduce(function(memo, num){ return memo + num; }, 0) > 0) {
        var attributeTooltip = 'DAMAGE: ';
        var attributeValue = item.damage[0];
        for (var j = 1; j < item.damage.length; j++) {
            attributeValue += ' / ' + item.damage[j];
        }
        a = a + attributeTooltip + ' ' + attributeValue + '<br>';
    }
    for (var i = 0; i < item.attributes.length; i++) {
        if (item.attributes[i].tooltip != null) {
            var attributeTooltip = item.attributes[i].tooltip;
            attributeTooltip = attributeTooltip.replace(/\\n/g, '');
            var attributeValue = item.attributes[i].value[0];
            for (var j = 1; j < item.attributes[i].value.length; j++) {
                attributeValue += ' / ' + item.attributes[i].value[j];
            }
            var p = attributeTooltip.indexOf('%');
            if (p == 0) {
                if (attributeValue.toString().indexOf('/') == -1) {
                    attributeValue = attributeValue.toString().trim() + '%';
                } else {
                    //var regexp2 = new RegExp('/', 'gi');
                    //attributeValue = attributeValue.replace(regexp2, '%/') + '%';
                    var attributeValues = attributeValue.split('/');
                    var trimmedAttributeValues = attributeValues.map(function(v) {
                        return v.trim();
                    });
                    attributeValue = trimmedAttributeValues.join('% / ') + '%';
                }
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

var getTooltipAbilityManaCost = function (item) {
    var c = '';
    if (item.manacost.reduce(function(memo, num){ return memo + num; }, 0) == 0) {
        return c;
    }
    if (item.manacost.every(function(num) { return num == item.manacost[0]; })) {
        return item.manacost[0].toString();
    }
    for (var i = 0; i < 4; i++) {
        if (item.manacost[i] != null) {
            c = c + ' ' + item.manacost[i];
        }
    }
    return c;
}

var getTooltipAbilityCooldown = function (item) {
    var c = '';
    if (item.cooldown.reduce(function(memo, num){ return memo + num; }, 0) == 0) {
        return c;
    }
    if (item.cooldown.every(function(num) { return num == item.cooldown[0]; })) {
        return item.cooldown[0].toString();
    }
    for (var i = 0; i < 4; i++) {
        if (item.cooldown[i] != null) {
            c = c + ' ' + item.cooldown[i];
        }
    }
    return c;
}
    
var getAbilityTooltipData = function(heroData, unitData, hero, el) {
    if (abilityTooltipData[el] == undefined) {
        var abilityName = el
        var ability = {};
        if (heroData['npc_dota_hero_' + hero] == undefined) {
            for (var i = 0; i < unitData[hero].abilities.length; i++) {
                if (unitData[hero].abilities[i].name == el) {
                    ability = unitData[hero].abilities[i];
                }
            }            
        }
        else {
            for (var i = 0; i < heroData['npc_dota_hero_' + hero].abilities.length; i++) {
                if (heroData['npc_dota_hero_' + hero].abilities[i].name == el) {
                    ability = heroData['npc_dota_hero_' + hero].abilities[i];
                }
            }
        }
        var data = $('<div>')
        data.append($('<span>').html(ability.displayname).addClass('item_field pull-left item_name'));
        if (ability.abilityunitdamagetype) {
            data.append($('<span>').html(abilityDamageTypes[ability.abilityunitdamagetype]).addClass('item_field pull-right item_ability_damage_type').css('margin-right','10px'));
        }
        data.append($('<hr>').css('clear', 'both'));
        if (ability.description != null) {
            data.append($('<div>').html(getTooltipAbilityDescription(ability)).addClass('item_field item_description'));
        }
        var attributedata = getTooltipAbilityAttributes(ability);
        if (attributedata != '') {
            data.append($('<div>').html(attributedata).addClass('item_field item_attributes'));
        }
        var cd = getTooltipAbilityCooldown(ability);
        var mana = getTooltipAbilityManaCost(ability);
        if (cd != '' || mana != '') {
            var cdmanacost = $('<div>').addClass('item_cdmana');
            if (mana != '') {
                cdmanacost.append($('<span>').html(mana.trim()).addClass('item_field item_manacost'));
            }
            if (cd != '') {
                cdmanacost.append($('<span>').html(cd.trim()).addClass('item_field item_cooldown'));
            }
            data.append(cdmanacost);
        }
        if (ability.lore != null) {
            data.append($('<div>').html(ability.lore).addClass('item_field item_lore'));
        }
        abilityTooltipData[el] = data.html();
        return data.html();
    }
    else {
        return abilityTooltipData[el];
    }
}

module.exports = getAbilityTooltipData;