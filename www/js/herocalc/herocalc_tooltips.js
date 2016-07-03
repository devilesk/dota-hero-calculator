define(function (require, exports, module) {
    'use strict';
        var $ = require('jquery');
    
    var my = require("./herocalc_core").HEROCALCULATOR;
    
    my.prototype.itemtooltipdata = {};
    my.prototype.ability_vars = {
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
    my.prototype.abilityTooltipData = {};
    my.prototype.abilityDamageTypes = {
        'DAMAGE_TYPE_MAGICAL': 'Magical',
        'DAMAGE_TYPE_PURE': 'Pure',
        'DAMAGE_TYPE_PHYSICAL': 'Physical',
        'DAMAGE_TYPE_COMPOSITE': 'Composite',
        'DAMAGE_TYPE_HP_REMOVAL': 'HP Removal'
    }
    
    my.prototype.getTooltipItemDescription = function (item) {
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

    my.prototype.getTooltipItemAttributes = function (item) {
        var a = '';
        console.log('getTooltip', item);
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
                    a = a + attributeTooltip.slice(0, d) + ' ' + attributeValue + ' ' + my.prototype.ability_vars[attributeTooltip.slice(d)] + '<br>';
                }
                else {
                    a = a + attributeTooltip + ' ' + attributeValue + '<br>';
                }
            }
        }
        return a.trim('<br>');
    }

    my.prototype.getTooltipItemCooldown = function (item) {
        var c = '';
        for (var i = 0; i < item.cooldown.length; i++) {
            c = c + ' ' + item.cooldown[i];
        }
        return c;
    }

    my.prototype.getTooltipItemManaCost = function (item) {
        var c = '';
        for (var i = 0; i < item.manacost.length; i++) {
            if (item.manacost[i] > 0) {
                c = c + ' ' + item.manacost[i];
            }
        }
        return c;
    }
    
    my.prototype.getItemTooltipData = function(el) {
        if (my.prototype.itemData['item_' + el] == undefined) {
            return undefined;
        }
        if (my.prototype.itemtooltipdata[el] == undefined) {
            var item = my.prototype.itemData['item_' + el];
            var data = $('<div>');
            data.append($('<span>').html(item.displayname).addClass('item_field item_name'));
            data.append($('<span>').html(item.itemcost).addClass('item_field item_cost'));
            data.append($('<hr>'));
            if (item.description != null) {
                data.append($('<div>').html(my.prototype.getTooltipItemDescription(item)).addClass('item_field item_description'));
            }
            var attributedata = my.prototype.getTooltipItemAttributes(item);
            if (attributedata != '') {
                data.append($('<div>').html(attributedata).addClass('item_field item_attributes'));
            }
            var cd = my.prototype.getTooltipItemCooldown(item);
            var mana = my.prototype.getTooltipItemManaCost(item);
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
            my.prototype.itemtooltipdata[el] = data.html();
            return data.html();
        }
        else {
            return my.prototype.itemtooltipdata[el];
        }
    }

    my.prototype.getTooltipAbilityDescription = function (item) {
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

    my.prototype.getTooltipAbilityAttributes = function (item) {
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
                a = a + attributeTooltip + ' ' + attributeValue + '<br>';
            }
        }
        return a.trim('<br>');
    }

    my.prototype.getTooltipAbilityManaCost = function (item) {
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

    my.prototype.getTooltipAbilityCooldown = function (item) {
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
        
    my.prototype.getAbilityTooltipData = function(hero, el) {
        if (my.prototype.abilityTooltipData[el] == undefined) {
            var abilityName = el
            var ability = {};
            if (my.prototype.heroData[hero] == undefined) {
                for (var i = 0; i < my.prototype.unitData[hero].abilities.length; i++) {
                    if (my.prototype.unitData[hero].abilities[i].name == el) {
                        ability = my.prototype.unitData[hero].abilities[i];
                    }
                }            
            }
            else {
                for (var i = 0; i < my.prototype.heroData[hero].abilities.length; i++) {
                    if (my.prototype.heroData[hero].abilities[i].name == el) {
                        ability = my.prototype.heroData[hero].abilities[i];
                    }
                }
            }
            var data = $('<div>')
            data.append($('<span>').html(ability.displayname).addClass('item_field pull-left item_name'));
            if (ability.abilityunitdamagetype) {
                data.append($('<span>').html(my.prototype.abilityDamageTypes[ability.abilityunitdamagetype]).addClass('item_field pull-right item_ability_damage_type').css('margin-right','10px'));
            }
            data.append($('<hr>').css('clear', 'both'));
            if (ability.description != null) {
                data.append($('<div>').html(my.prototype.getTooltipAbilityDescription(ability)).addClass('item_field item_description'));
            }
            var attributedata = my.prototype.getTooltipAbilityAttributes(ability);
            if (attributedata != '') {
                data.append($('<div>').html(attributedata).addClass('item_field item_attributes'));
            }
            var cd = my.prototype.getTooltipAbilityCooldown(ability);
            var mana = my.prototype.getTooltipAbilityManaCost(ability);
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
            my.prototype.abilityTooltipData[el] = data.html();
            return data.html();
        }
        else {
            return my.prototype.abilityTooltipData[el];
        }
    }

});