define(function (require, exports, module) {
    'use strict';
    var ko = require('herocalc_knockout');
        
    var my = require("./herocalc_core").HEROCALCULATOR;
    
    my.prototype.stackableItems = ['clarity','flask','dust','ward_observer','ward_sentry','tango','tpscroll','smoke_of_deceit'],
    my.prototype.levelitems = ['necronomicon','dagon','diffusal_blade','travel_boots'],
    my.prototype.validItems = ["abyssal_blade","ultimate_scepter","courier","arcane_boots","armlet","assault","boots_of_elves","bfury","belt_of_strength","black_king_bar","blade_mail","blade_of_alacrity","blades_of_attack","blink","bloodstone","boots","travel_boots","bottle","bracer","broadsword","buckler","butterfly","chainmail","circlet","clarity","claymore","cloak","lesser_crit","greater_crit","dagon","demon_edge","desolator","diffusal_blade","rapier","ancient_janggo","dust","eagle","energy_booster","ethereal_blade","cyclone","skadi","flying_courier","force_staff","gauntlets","gem","ghost","gloves","hand_of_midas","headdress","flask","heart","heavens_halberd","helm_of_iron_will","helm_of_the_dominator","hood_of_defiance","hyperstone","branches","javelin","sphere","maelstrom","magic_stick","magic_wand","manta","mantle","mask_of_madness","medallion_of_courage","mekansm","mithril_hammer","mjollnir","monkey_king_bar","lifesteal","mystic_staff","necronomicon","null_talisman","oblivion_staff","ward_observer","ogre_axe","orb_of_venom","orchid","pers","phase_boots","pipe","platemail","point_booster","poor_mans_shield","power_treads","quarterstaff","quelling_blade","radiance","reaver","refresher","ring_of_aquila","ring_of_basilius","ring_of_health","ring_of_protection","ring_of_regen","robe","rod_of_atos","relic","sobi_mask","sange","sange_and_yasha","satanic","sheepstick","ward_sentry","shadow_amulet","invis_sword","shivas_guard","basher","slippers","smoke_of_deceit","soul_booster","soul_ring","staff_of_wizardry","stout_shield","talisman_of_evasion","tango","tpscroll","tranquil_boots","ultimate_orb","urn_of_shadows","vanguard","veil_of_discord","vitality_booster","vladmir","void_stone","wraith_band","yasha","crimson_guard","enchanted_mango","lotus_orb","glimmer_cape","guardian_greaves","moon_shard","silver_edge","solar_crest","octarine_core","aether_lens","faerie_fire","iron_talon","dragon_lance","echo_sabre","infused_raindrop","blight_stone","wind_lace","tome_of_knowledge","bloodthorn","hurricane_pike"],
    my.prototype.itemsWithActive = ['heart','smoke_of_deceit','dust','ghost','tranquil_boots','phase_boots','power_treads','buckler','medallion_of_courage','ancient_janggo','mekansm','pipe','veil_of_discord','rod_of_atos','orchid','sheepstick','armlet','invis_sword','ethereal_blade','shivas_guard','manta','mask_of_madness','diffusal_blade','mjollnir','satanic','ring_of_basilius','ring_of_aquila', 'butterfly', 'moon_shard', 'silver_edge','bloodthorn'];
    
    my.prototype.ItemInput = function (value, name, debuff) {
        if (my.prototype.itemData['item_' + value].ItemAliases instanceof Array) {
            var itemAlias = my.prototype.itemData['item_' + value].ItemAliases.join(' ');
        }
        else {
            var itemAlias = my.prototype.itemData['item_' + value].ItemAliases;
        }
        this.value = ko.observable(value);
        this.debuff = ko.observable(debuff);
        if (this.debuff()) {
            this.value = ko.observable(value + '|' + debuff.id);
            this.name = ko.observable(name + ' (' + debuff.name + ')');
            this.displayname = ko.observable(name + ' (' + debuff.name + ') <span style="display:none">' + ';' + itemAlias + '</span>');
        }
        else {
            this.value = ko.observable(value);
            this.name = ko.observable(name);
            this.displayname = ko.observable(name + ' <span style="display:none">' + ';' + itemAlias + '</span>');
        }
    };
    
    my.prototype.BasicInventoryViewModel = function (h) {
        var self = this;
        self.items = ko.observableArray([]);
        self.activeItems = ko.observableArray([]);
        self.addItem = function (data, event) {
            if (data.selectedItem() != undefined) {
                var new_item = {
                    item: data.selectedItem().split('|')[0],
                    state: ko.observable(0),
                    size: data.itemInputValue(),
                    enabled: ko.observable(true)
                }
                switch (new_item.item) {
                    case 'dagon':
                        new_item.size = Math.min(new_item.size, 5);
                    break;
                    break;
                    case 'travel_boots':
                    case 'diffusal_blade':
                        new_item.size = Math.min(new_item.size, 2);
                    break;
                    case 'necronomicon':
                        new_item.size = Math.min(new_item.size, 3);
                    break;
                }
                self.items.push(new_item);
                if (data.selectedItem() === 'ring_of_aquila' || data.selectedItem() === 'ring_of_basilius' || data.selectedItem() === 'heart') {
                    self.toggleItem(undefined, new_item, undefined);
                }
            }
        };
        self.toggleItem = function (index, data, event) {
            if (my.prototype.itemsWithActive.indexOf(data.item) >= 0) {
                if (self.activeItems.indexOf(data) < 0) {
                    self.activeItems.push(data);
                }
                else {
                    self.activeItems.remove(data);
                }
                switch (data.item) {
                    case 'power_treads':
                        if (data.state() < 2) {
                            data.state(data.state() + 1);
                        }
                        else {
                            data.state(0);
                        }                
                    break;
                    default:
                        if (data.state() == 0) {
                            data.state(1);
                        }
                        else {
                            data.state(0);
                        }                
                    break;
                }
            }
        }.bind(this);
        self.removeItem = function (item) {
            self.activeItems.remove(item);
            self.items.remove(item);
        }.bind(this);
        self.toggleMuteItem = function (item) {
            item.enabled(!item.enabled());
        }.bind(this);      

        self.getItemImage = function (data) {
            var state = ko.utils.unwrapObservable(data.state);
            switch (data.item) {
                case 'power_treads':
                    if (state == 0) {
                        return '/media/images/items/' + data.item + '_str.png';
                    }
                    else if (state == 1) {
                        return '/media/images/items/' + data.item + '_int.png';
                    }
                    else {
                        return '/media/images/items/' + data.item + '_agi.png';
                    }
                break;
                case 'tranquil_boots':
                case 'ring_of_basilius':
                    if (state == 0) {
                        return '/media/images/items/' + data.item + '.png';
                    }
                    else {
                        return '/media/images/items/' + data.item + '_active.png';
                    }
                break;
                case 'armlet':
                    if (state == 0) {
                        return '/media/images/items/' + data.item + '.png';
                    }
                    else {
                        return '/media/images/items/' + data.item + '_active.png';
                    }
                break;
                case 'ring_of_aquila':
                    if (state == 0) {
                        return '/media/images/items/' + data.item + '_active.png';
                    }
                    else {
                        return '/media/images/items/' + data.item + '.png';
                    }
                break;
                case 'dagon':
                case 'diffusal_blade':
                case 'travel_boots':
                case 'necronomicon':
                    if (data.size > 1) {
                        return '/media/images/items/' + data.item + '_' + data.size + '.png';
                    }
                    else {
                        return '/media/images/items/' + data.item + '.png';
                    }
                break;
                default:
                    return '/media/images/items/' + data.item + '.png';            
                break;
            }
        };
        self.getItemSizeLabel = function (data) {
            if (my.prototype.stackableItems.indexOf(data.item) != -1) {
                return '<span style="font-size:10px">Qty: </span>' + data.size;
            }
            else if (my.prototype.levelitems.indexOf(data.item) != -1) {
                return '<span style="font-size:10px">Lvl: </span>' + data.size;
            }
            else if (data.item == 'bloodstone') {
                return '<span style="font-size:10px">Charges: </span>' + data.size;
            }
            else {
                return '';
            }
        };
        self.getActiveBorder = function (data) {
            switch (data.item) {
                case 'power_treads':
                case 'tranquil_boots':
                case 'ring_of_basilius':
                case 'ring_of_aquila':
                case 'armlet':
                    return 0;
                break;
                default:
                    return ko.utils.unwrapObservable(data.state);    
                break;
            }
        }
        self.removeAll = function () {
            self.activeItems.removeAll();
            self.items.removeAll();
        }.bind(this);
    }
    
    my.prototype.InventoryViewModel = function (h) {
        var self = new my.prototype.BasicInventoryViewModel();
        self.hero = h;
        self.hasInventory = ko.observable(true);
        self.items = ko.observableArray([]);
        self.activeItems = ko.observableArray([]);
        self.hasScepter = ko.computed(function () {
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                if (item === 'ultimate_scepter' && self.items()[i].enabled()) {
                    return true;
                }
                
            }
            return false;
        }, this);
        self.isEthereal = ko.computed(function () {
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
                if ((item === 'ghost' || item === 'ethereal_blade') && self.items()[i].enabled() && isActive) {
                    return true;
                }
            }
            return false;
        }, this);
        self.isSheeped = ko.computed(function () {
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
                if (item === 'sheepstick' && self.items()[i].enabled() && isActive) {
                    return true;
                }
            }
            return false;
        }, this);
        self.totalCost = ko.computed(function () {
            var c = 0;
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                if (!self.items()[i].enabled()) continue;
                if (my.prototype.stackableItems.indexOf(item) != -1) {
                    c += my.prototype.itemData['item_' + item].itemcost * self.items()[i].size;
                }
                else if (my.prototype.levelitems.indexOf(item) != -1) {
                    switch(item) {
                        case 'diffusal_blade':
                            c += my.prototype.itemData['item_' + item].itemcost + (self.items()[i].size - 1) * 700;
                        break;
                        case 'necronomicon':
                        case 'dagon':
                            c += my.prototype.itemData['item_' + item].itemcost + (self.items()[i].size - 1) * 1250;
                        break;
                        default:
                            c += my.prototype.itemData['item_' + item].itemcost;
                        break;
                    }
                }
                else {
                    c += my.prototype.itemData['item_' + item].itemcost;
                }
                
            }
            return c;
        }, this);
        /*self.addItem = function (data, event) {
            if (self.hasInventory() && data.selectedItem() != undefined) {
                var new_item = {
                    item: data.selectedItem(),
                    state: ko.observable(0),
                    size: data.itemInputValue(),
                    enabled: ko.observable(true)
                }
                self.items.push(new_item);
                if (data.selectedItem() === 'ring_of_aquila' || data.selectedItem() === 'ring_of_basilius' || data.selectedItem() === 'heart') {
                    self.toggleItem(undefined, new_item, undefined);
                }
            }
        };*/
        self.addItemBuff = function (data, event) {
            if (self.hasInventory() && self.selectedItemBuff() != undefined) {
                var new_item = {
                    item: self.selectedItemBuff(),
                    state: ko.observable(0),
                    size: 1,
                    enabled: ko.observable(true)
                }
                self.items.push(new_item);
                if (self.selectedItemBuff() === 'ring_of_aquila' || self.selectedItemBuff() === 'ring_of_basilius') {
                    self.toggleItem(undefined, new_item, undefined);
                }
            }
        };
        self.addItemDebuff = function (data, event) {
            if (self.hasInventory() && self.selectedItemDebuff() != undefined) {
                var new_item = {
                    item: self.selectedItemDebuff().split('|')[0],
                    state: ko.observable(0),
                    size: 1,
                    enabled: ko.observable(true)
                }
                if (self.selectedItemDebuff().split('|').length == 2) {
                    new_item.debuff = self.selectedItemDebuff().split('|')[1]
                }
                self.items.push(new_item);
                if (self.selectedItemDebuff() === 'ring_of_aquila' || self.selectedItemDebuff() === 'ring_of_basilius') {
                    self.toggleItem(undefined, new_item, undefined);
                }
            }
        };
        /*self.toggleItem = function (index, data, event) {
            if (my.prototype.itemsWithActive.indexOf(data.item) >= 0) {
                if (self.activeItems.indexOf(data) < 0) {
                    self.activeItems.push(data);
                }
                else {
                    self.activeItems.remove(data);
                }
                switch (data.item) {
                    case 'power_treads':
                        if (data.state() < 2) {
                            data.state(data.state() + 1);
                        }
                        else {
                            data.state(0);
                        }                
                    break;
                    default:
                        if (data.state() == 0) {
                            data.state(1);
                        }
                        else {
                            data.state(0);
                        }                
                    break;
                }
            }
        }.bind(this);
        self.removeItem = function (item) {
            self.activeItems.remove(item);
            self.items.remove(item);
        }.bind(this);
        self.toggleMuteItem = function (item) {
            item.enabled(!item.enabled());
        }.bind(this);
        self.getItemImage = function (data) {
            switch (data.item) {
                case 'power_treads':
                    if (data.state() == 0) {
                        return '/media/images/items/' + data.item + '_str.png';
                    }
                    else if (data.state() == 1) {
                        return '/media/images/items/' + data.item + '_int.png';
                    }
                    else {
                        return '/media/images/items/' + data.item + '_agi.png';
                    }
                break;
                case 'tranquil_boots':
                case 'ring_of_basilius':
                    if (data.state() == 0) {
                        return '/media/images/items/' + data.item + '.png';
                    }
                    else {
                        return '/media/images/items/' + data.item + '_active.png';
                    }
                break;
                case 'armlet':
                    if (data.state() == 0) {
                        return '/media/images/items/' + data.item + '.png';
                    }
                    else {
                        return '/media/images/items/' + data.item + '_active.png';
                    }
                break;
                case 'ring_of_aquila':
                    if (data.state() == 0) {
                        return '/media/images/items/' + data.item + '_active.png';
                    }
                    else {
                        return '/media/images/items/' + data.item + '.png';
                    }
                break;
                case 'dagon':
                case 'diffusal_blade':
                case 'necronomicon':
                    if (data.size > 1) {
                        return '/media/images/items/' + data.item + '_' + data.size + '.png';
                    }
                    else {
                        return '/media/images/items/' + data.item + '.png';
                    }
                break;
                default:
                    return '/media/images/items/' + data.item + '.png';            
                break;
            }
        };
        self.getItemSizeLabel = function (data) {
            if (my.prototype.stackableItems.indexOf(data.item) != -1) {
                return '<span style="font-size:10px">Qty: </span>' + data.size;
            }
            else if (my.prototype.levelitems.indexOf(data.item) != -1) {
                return '<span style="font-size:10px">Lvl: </span>' + data.size;
            }
            else if (data.item == 'bloodstone') {
                return '<span style="font-size:10px">Charges: </span>' + data.size;
            }
            else {
                return '';
            }
        };
        self.getActiveBorder = function (data) {
            switch (data.item) {
                case 'power_treads':
                case 'tranquil_boots':
                case 'ring_of_basilius':
                case 'ring_of_aquila':
                case 'armlet':
                    return 0;
                break;
                default:
                    return ko.utils.unwrapObservable(data.state);    
                break;
            }
            
        }*/

        self.getItemAttributeValue = function (attributes, attributeName, level) {
            for (var i = 0; i < attributes.length; i++) {
                if (attributes[i].name == attributeName) {
                    if (level == 0) {
                        return parseFloat(attributes[i].value[0]);
                    }
                    else if (level > attributes[i].value.length) {
                        return parseFloat(attributes[i].value[0]);
                    }
                    else {
                        return parseFloat(attributes[i].value[level - 1]);
                    }
                }
            }
        }
        
        self.getAttributes = function (attributetype) {
            var totalAttribute = 0;
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
                if (!self.items()[i].enabled()) continue;
                var size = self.items()[i].size;
                for (var j = 0; j < my.prototype.itemData['item_' + item].attributes.length; j++) {
                    var attribute = my.prototype.itemData['item_' + item].attributes[j];
                    switch(attribute.name) {
                        case 'bonus_all_stats':
                            totalAttribute += parseInt(attribute.value[0]);
                        break;
                        case 'bonus_stats':
                            totalAttribute += parseInt(attribute.value[0]);
                        break;
                    }
                    switch(attributetype) {
                        case 'agi':
                            if (attribute.name == 'bonus_agility') {
                                if (item == 'diffusal_blade') {
                                    totalAttribute += parseInt(attribute.value[size-1]);
                                }
                                else {
                                    totalAttribute += parseInt(attribute.value[0]);
                                }
                            }
                            if (attribute.name == 'bonus_stat' && self.items()[i].state() == 2) {totalAttribute += parseInt(attribute.value[0]);};
                            if (attribute.name == 'bonus_agi') {totalAttribute += parseInt(attribute.value[0]);};
                        break;
                        case 'int':
                            if (attribute.name == 'bonus_intellect') {
                                if (item == 'necronomicon') {
                                    totalAttribute += parseInt(attribute.value[size-1]);
                                }
                                else if (item == 'diffusal_blade') {
                                    totalAttribute += parseInt(attribute.value[size-1]);
                                }
                                else if (item == 'dagon') {
                                    totalAttribute += parseInt(attribute.value[size-1]);
                                }
                                else {
                                    totalAttribute += parseInt(attribute.value[0]);
                                }
                            }
                            if (attribute.name == 'bonus_intelligence') {totalAttribute += parseInt(attribute.value[0]);};
                            if (attribute.name == 'bonus_int') {totalAttribute += parseInt(attribute.value[0]);};
                            if (attribute.name == 'bonus_stat' && self.items()[i].state() == 1) {totalAttribute += parseInt(attribute.value[0]);};
                        break;
                        case 'str':
                            if (attribute.name == 'bonus_strength') {
                                if (item == 'necronomicon') {
                                    totalAttribute += parseInt(attribute.value[size-1]);
                                }
                                else {
                                    totalAttribute += parseInt(attribute.value[0]);
                                }
                            }
                            if (attribute.name == 'bonus_stat' && self.items()[i].state() == 0) {totalAttribute += parseInt(attribute.value[0]);};
                            if (attribute.name == 'bonus_str') {totalAttribute += parseInt(attribute.value[0]);};
                            if (attribute.name == 'unholy_bonus_strength' && isActive) {totalAttribute += parseInt(attribute.value[0]);};
                        break;
                    }
                }
            }
            return totalAttribute;
        };
        self.getBash = function (attacktype) {
            var totalAttribute = 1;
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                if (!self.items()[i].enabled()) continue;
                for (var j = 0; j < my.prototype.itemData['item_' + item].attributes.length; j++) {
                    var attribute = my.prototype.itemData['item_' + item].attributes[j];
                    switch(attribute.name) {
                        case 'bash_chance':
                            totalAttribute *= (1 - parseInt(attribute.value[0]) / 100);
                        break;
                        case 'bash_chance_melee':
                            if (attacktype == 'DOTA_UNIT_CAP_MELEE_ATTACK') { totalAttribute *= (1 - parseInt(attribute.value[0]) / 100); };
                        break;
                        case 'bash_chance_ranged':
                            if (attacktype == 'DOTA_UNIT_CAP_RANGED_ATTACK') { totalAttribute *= (1 - parseInt(attribute.value[0]) / 100); };
                        break;
                    }
                }
            }
            return totalAttribute;
        };
        
        self.getCritChance = function () {
            var totalAttribute = 1;
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
                if (!self.items()[i].enabled()) continue;
                for (var j = 0; j < my.prototype.itemData['item_' + item].attributes.length; j++) {
                    var attribute = my.prototype.itemData['item_' + item].attributes[j];
                    switch(attribute.name) {
                        case 'crit_chance':
                            totalAttribute *= (1 - parseInt(attribute.value[0]) / 100);
                        break;
                    }
                }
            }
            return totalAttribute;
        };
        
        self.getCritSource = function () {
            var sources = {};
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
                if (!self.items()[i].enabled()) continue;
                switch (item) {
                    case 'lesser_crit':
                    case 'greater_crit':
                    case 'bloodthorn':
                        if (sources[item] == undefined) {
                            sources[item] = {
                                'chance': self.getItemAttributeValue(my.prototype.itemData['item_' + item].attributes, 'crit_chance', 0) / 100,
                                'multiplier': self.getItemAttributeValue(my.prototype.itemData['item_' + item].attributes, 'crit_multiplier', 0) / 100,
                                'count': 1,
                                'displayname': my.prototype.itemData['item_' + item].displayname
                            }
                        }
                        else {
                            sources[item].count += 1;
                        }
                    break;
                }
                if (item === 'bloodthorn' && isActive) {
                    if (sources['soul_rend'] == undefined) {
                        sources['soul_rend'] = {
                            'chance': 1,
                            'multiplier': self.getItemAttributeValue(my.prototype.itemData['item_' + item].attributes, 'target_crit_multiplier', 0) / 100,
                            'count': 1,
                            'displayname': 'Soul Rend'
                        }
                    }
                    else {
                        sources['soul_rend'].count += 1;
                    }
                }
            }
            return sources;
        };

        self.getCleaveSource = function () {
            var sources = {};
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
                if (!self.items()[i].enabled()) continue;
                switch (item) {
                    case 'bfury':
                        if (sources[item] == undefined) {
                            sources[item] = {
                                'radius': self.getItemAttributeValue(my.prototype.itemData['item_' + item].attributes, 'cleave_radius', 0),
                                'magnitude': self.getItemAttributeValue(my.prototype.itemData['item_' + item].attributes, 'cleave_damage_percent', 0) / 100,
                                'count': 1,
                                'displayname': my.prototype.itemData['item_' + item].displayname
                            }
                        }
                        else {
                            sources[item].count += 1;
                        }
                    break;
                }

            }
            return sources;
        };
        
        self.getBashSource = function (attacktype) {
            var sources = {};
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
                if (!self.items()[i].enabled()) continue;
                switch (item) {
                    case 'javelin':
                        if (sources[item] == undefined) {
                            sources[item] = {
                                'damage': self.getItemAttributeValue(my.prototype.itemData['item_' + item].attributes, 'bonus_chance_damage', 1),
                                'damageType': 'magic',
                                'count': 1,
                                'chance': self.getItemAttributeValue(my.prototype.itemData['item_' + item].attributes, 'bonus_chance', 1) / 100,
                                'displayname': my.prototype.itemData['item_' + item].displayname + ' Pierce'
                            }
                        }
                        else {
                            sources[item].count += 1;
                        }
                    break;
                    case 'monkey_king_bar':
                        if (sources[item] == undefined) {
                            sources[item] = {
                                'item': item,
                                'chance': self.getItemAttributeValue(my.prototype.itemData['item_' + item].attributes, 'bash_chance', 0) / 100,
                                'damage': self.getItemAttributeValue(my.prototype.itemData['item_' + item].attributes, 'bash_damage', 0),
                                'duration': self.getItemAttributeValue(my.prototype.itemData['item_' + item].attributes, 'bash_stun', 0),
                                'count': 1,
                                'damageType': 'magic',
                                'displayname': 'Mini-Bash' //my.prototype.itemData['item_' + item].displayname
                            }
                        }
                        else {
                            sources[item].count += 1;
                        }
                    break;
                    case 'abyssal_blade':
                    case 'basher':
                        if (!sources.hasOwnProperty('bash')) {
                            sources['bash'] = {
                                'item': item,
                                'chance': self.getItemAttributeValue(my.prototype.itemData['item_' + item].attributes, (attacktype == 'DOTA_UNIT_CAP_MELEE_ATTACK') ?'bash_chance_melee' : 'bash_chance_ranged', 0) / 100,
                                'damage': self.getItemAttributeValue(my.prototype.itemData['item_' + item].attributes, 'bonus_chance_damage', 0),
                                'duration': self.getItemAttributeValue(my.prototype.itemData['item_' + item].attributes, 'bash_duration', 0),
                                'count': 1,
                                'damageType': 'physical',
                                'displayname': 'Bash' //my.prototype.itemData['item_' + item].displayname
                            }
                        }
                        else {
                            //sources[item].count += 1;
                        }
                    break;
                }

            }
            return sources;
        };
        
        self.getOrbProcSource = function () {
            var sources = {};
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
                if (!self.items()[i].enabled()) continue;
                switch (item) {
                    case 'maelstrom':
                    case 'mjollnir':
                        if (sources[item] == undefined) {
                            sources[item] = {
                                'chance': self.getItemAttributeValue(my.prototype.itemData['item_' + item].attributes, 'chain_chance', 0) / 100,
                                'damage': self.getItemAttributeValue(my.prototype.itemData['item_' + item].attributes, 'chain_damage', 0),
                                'count': 1,
                                'damageType': 'magic',
                                'displayname': my.prototype.itemData['item_' + item].displayname
                            }
                        }
                        else {
                            sources[item].count += 1;
                        }
                    break;
                }

            }
            return sources;
        };

        self.getOrbSource = function () {
            var sources = {};
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
                if (!self.items()[i].enabled()) continue;
                switch (item) {
                    case 'diffusal_blade':
                        if (sources[item] == undefined) {
                            sources[item] = {
                                'chance': 1,
                                'damage': self.getItemAttributeValue(my.prototype.itemData['item_' + item].attributes, 'feedback_mana_burn', self.items()[i].size),
                                'count': 1,
                                'damageType': 'physical',
                                'displayname': my.prototype.itemData['item_' + item].displayname
                            }
                        }
                        else {
                            sources[item].count += 1;
                        }
                    break;
                }

            }
            return sources;
        };
        
        self.getHealth = function () {
            var totalAttribute = 0;
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                if (!self.items()[i].enabled()) continue;
                for (var j = 0; j < my.prototype.itemData['item_' + item].attributes.length; j++) {
                    var attribute = my.prototype.itemData['item_' + item].attributes[j];
                    switch(attribute.name) {
                        case 'bonus_health':
                            totalAttribute += parseInt(attribute.value[0]);
                        break;
                    }
                }
            }
            return totalAttribute;
        };
        self.getHealthRegen = function () {
            var totalAttribute = 0;
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
                if (!self.items()[i].enabled()) continue;
                for (var j = 0; j < my.prototype.itemData['item_' + item].attributes.length; j++) {
                    var attribute = my.prototype.itemData['item_' + item].attributes[j];
                    switch(attribute.name) {
                        case 'health_regen':
                        case 'bonus_regen':
                            totalAttribute += parseInt(attribute.value[0]);
                        break;
                        case 'bonus_health_regen':
                            if (item == 'tranquil_boots' && !isActive) {
                                totalAttribute += parseInt(attribute.value[0]);
                            }
                            else if (item != 'tranquil_boots') {
                                totalAttribute += parseInt(attribute.value[0]);
                            }
                        break;
                        case 'hp_regen':
                            totalAttribute += parseInt(attribute.value[0]);
                        break;
                        case 'health_regen_rate':
                            if (item == 'heart' && isActive) {
                                totalAttribute += (parseInt(attribute.value[0]) / 100) * self.hero.health();
                            }
                        break;
                    }
                }
            }
            return totalAttribute;
        };
        self.getHealthRegenAura = function (e) {
            var totalAttribute = 0,
                excludeList = e || [];
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
                if (!self.items()[i].enabled()) continue;
                for (var j = 0; j < my.prototype.itemData['item_' + item].attributes.length; j++) {
                    var attribute = my.prototype.itemData['item_' + item].attributes[j];
                    if (excludeList.indexOf(item + attribute.name) > -1) continue;
                    switch(attribute.name) {
                        case 'aura_health_regen':
                            totalAttribute += parseInt(attribute.value[0]);
                            excludeList.push(item + attribute.name);
                        break;
                    }
                }
            }
            return {value: totalAttribute, excludeList: excludeList};
        };
        
        self.getMana = function () {
            var totalAttribute = 0;
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                if (!self.items()[i].enabled()) continue;
                for (var j = 0; j < my.prototype.itemData['item_' + item].attributes.length; j++) {
                    var attribute = my.prototype.itemData['item_' + item].attributes[j];
                    switch(attribute.name) {
                        case 'bonus_mana':
                            totalAttribute += parseInt(attribute.value[0]);
                        break;
                    }
                }
            }
            return totalAttribute;
        };
        
        self.getManaRegen = function () {
            var totalAttribute = 0;
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                if (!self.items()[i].enabled()) continue;
                for (var j = 0; j < my.prototype.itemData['item_' + item].attributes.length; j++) {
                    var attribute = my.prototype.itemData['item_' + item].attributes[j];
                    switch(attribute.name) {
                        case 'aura_mana_regen':
                        case 'mana_regen_aura':
                            totalAttribute += parseFloat(attribute.value[0]);
                        break;
                        case 'mana_regen':
                            if (item == 'infused_raindrop') totalAttribute += parseFloat(attribute.value[0]);
                        break;
                    }
                }
            }
            return totalAttribute;    
        };
        self.getManaRegenPercent = function () {
            var totalAttribute = 0;
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                if (!self.items()[i].enabled()) continue;
                for (var j = 0; j < my.prototype.itemData['item_' + item].attributes.length; j++) {
                    var attribute = my.prototype.itemData['item_' + item].attributes[j];
                    switch(attribute.name) {
                        case 'bonus_mana_regen':
                        case 'mana_regen':
                        case 'bonus_mana_regen_pct':
                            if (item != 'infused_raindrop') totalAttribute += parseFloat(attribute.value[0]);
                        break;
                    }
                }
            }
            return totalAttribute / 100;    
        };
        self.getManaRegenBloodstone = function () {
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                if (!self.items()[i].enabled()) continue;
                if (item.indexOf('bloodstone') != -1) {
                    return parseInt(self.items()[i].size);
                }
            }
            return 0;
        };
        
        self.getArmor = function () {
            var totalAttribute = 0;
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
                if (!self.items()[i].enabled()) continue;
                for (var j = 0; j < my.prototype.itemData['item_' + item].attributes.length; j++) {
                    var attribute = my.prototype.itemData['item_' + item].attributes[j];
                    switch(attribute.name) {
                        case 'bonus_armor':
                            if (!isActive || item != 'medallion_of_courage') { totalAttribute += parseInt(attribute.value[0]); };
                        break;
                        case 'unholy_bonus_armor':
                            if (isActive && item == 'armlet') { totalAttribute += parseInt(attribute.value[0]); };
                        break;
                    }
                }
            }
            return totalAttribute;
        };
        
        self.getArmorAura = function (aList) {
            var totalAttribute = 0,
                attributeList = aList || [];
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
                if (!self.items()[i].enabled()) continue;
                for (var j = 0;j < my.prototype.itemData['item_' + item].attributes.length; j++) {
                    var attribute = my.prototype.itemData['item_' + item].attributes[j];
                    if (attributeList.find(function (a) { return attribute.name == a.name; })) continue;
                    switch(attribute.name) {
                        // buckler
                        case 'bonus_aoe_armor':
                            if (isActive) {
                                attributeList.push({'name':attribute.name, 'value': parseInt(attribute.value[0])});
                            }
                        break;
                        // assault
                        case 'aura_positive_armor':
                            attributeList.push({'name':attribute.name, 'value': parseInt(attribute.value[0])});
                        break;
                        // ring_of_aquila,ring_of_basilius
                        case 'aura_bonus_armor':
                            if (isActive) {
                                attributeList.push({'name':attribute.name, 'value': parseInt(attribute.value[0])});
                            }
                        break;
                        // vladmir
                        case 'armor_aura':
                            attributeList.push({'name':attribute.name, 'value': parseInt(attribute.value[0])});
                        break;
                        // mekansm
                        case 'heal_bonus_armor':
                            if (isActive) {
                                attributeList.push({'name':attribute.name, 'value': parseInt(attribute.value[0])});
                            }
                        break;
                    }
                }
            }
            // remove buckler if there is a mekansm
            if (attributeList.find(function (attribute) { return attribute.name == 'heal_bonus_armor'; })) {
                attributeList = attributeList.filter(function (attribute) {
                    return attribute.name !== 'bonus_aoe_armor';
                });
            }
            // remove ring_of_aquila,ring_of_basilius if there is a vladmir
            if (attributeList.find(function (attribute) { return attribute.name == 'armor_aura'; })) {
                attributeList = attributeList.filter(function (attribute) {
                    return attribute.name !== 'aura_bonus_armor';
                });
            }
            
            totalAttribute = attributeList.reduce(function (memo, attribute) {
                return memo += attribute.value;
            }, 0);
            return {value: totalAttribute, attributes: attributeList};
        };
        self.getArmorReduction = function (e) {
            var totalAttribute = 0,
                excludeList = e || [];
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
                if (!self.items()[i].enabled()) continue;
                for (var j = 0; j < my.prototype.itemData['item_' + item].attributes.length; j++) {
                    var attribute = my.prototype.itemData['item_' + item].attributes[j];
                    if (excludeList.indexOf(attribute.name) > -1 || excludeList.indexOf(item + '_' + attribute.name) > -1) continue;
                    switch(attribute.name) {
                        case 'armor_reduction':
                            totalAttribute += parseInt(attribute.value[0]);
                            excludeList.push(item + '_' + attribute.name);
                        break;
                        case 'aura_negative_armor':
                            totalAttribute += parseInt(attribute.value[0]);
                            excludeList.push(attribute.name);
                        break;
                        case 'corruption_armor':
                            totalAttribute += parseInt(attribute.value[0]);
                            excludeList.push(attribute.name);
                        break;
                    }
                }
            }
            return {value: totalAttribute, excludeList: excludeList};
        };
        self.getEvasion = function () {
            var totalAttribute = 1;
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
                if (!self.items()[i].enabled()) continue;
                for (var j = 0; j < my.prototype.itemData['item_' + item].attributes.length; j++) {
                    var attribute = my.prototype.itemData['item_' + item].attributes[j];
                    switch(attribute.name) {
                        case 'bonus_evasion':
                            if (item != 'butterfly' || !isActive) totalAttribute *= (1 - parseInt(attribute.value[0]) / 100);
                        break;
                    }
                }
            }
            return totalAttribute;
        };
        self.getMovementSpeedFlat = function () {
            var totalAttribute = 0,
            hasBoots = false,
            hasEuls = false,
            hasWindLace = false,
            bootItems = ['boots','phase_boots','arcane_boots','travel_boots','power_treads','tranquil_boots','guardian_greaves'];
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
                if (!self.items()[i].enabled()) continue;
                for (var j = 0; j < my.prototype.itemData['item_' + item].attributes.length; j++) {
                    var attribute = my.prototype.itemData['item_' + item].attributes[j];
                    switch(attribute.name) {
                        case 'bonus_movement_speed':
                            if (!hasBoots && bootItems.indexOf(item) >= 0) {
                                if (item != 'tranquil_boots' || (item == 'tranquil_boots' && !isActive)) {
                                    totalAttribute += parseInt(attribute.value[0]);
                                    hasBoots = true;
                                }
                            }
                            //else if (!hasEuls && item == 'cyclone') {
                            else if (item == 'cyclone') {
                                totalAttribute += parseInt(attribute.value[0]);
                                hasEuls = true;
                            }
                        break;
                        case 'broken_movement_speed':
                            if (!hasBoots && bootItems.indexOf(item) >= 0) {
                                if (item == 'tranquil_boots' && isActive) {
                                    totalAttribute += parseInt(attribute.value[0]);
                                    hasBoots = true;
                                }
                            }
                        break;
                        case 'bonus_movement':
                            if (!hasBoots && bootItems.indexOf(item) >= 0) {
                                totalAttribute += parseInt(attribute.value[0]);
                                hasBoots = true;
                            }
                        break;
                        case 'movement_speed':
                            if (!hasWindLace && item == 'wind_lace') {
                                totalAttribute += parseInt(attribute.value[0]);
                                hasWindLace = true;
                            }
                        break;
                    }
                }
            }
            return totalAttribute;
        };
        self.getMovementSpeedPercent = function (e) {
            var totalAttribute = 0,
                excludeList = e || [],
                hasYasha = false,
                hasDrums = false,
                hasDrumsActive = false,
                hasPhaseActive = false,
                hasShadowBladeActive = false,
                hasButterflyActive = false,
                hasMoMActive = false,
                yashaItems = ['manta','yasha','sange_and_yasha'];
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
                if (!self.items()[i].enabled()) continue;
                for (var j = 0; j < my.prototype.itemData['item_' + item].attributes.length; j++) {
                    var attribute = my.prototype.itemData['item_' + item].attributes[j];
                    if (excludeList.indexOf(attribute.name) > -1) continue;
                    switch(attribute.name) {
                        case 'movement_speed_percent_bonus':
                            if (!hasYasha && yashaItems.indexOf(item) >= 0) {
                                totalAttribute += parseInt(attribute.value[0]);
                                hasYasha = true;
                            }
                        break;
                        case 'bonus_aura_movement_speed_pct':
                            if (!hasDrums && item == 'ancient_janggo') {
                                totalAttribute += parseInt(attribute.value[0]);
                                hasDrums = true;
                                excludeList.push(attribute.name);
                            }
                        break;
                        case 'phase_movement_speed':
                            if (isActive && !hasPhaseActive) {
                                totalAttribute += parseInt(attribute.value[0]);
                                hasPhaseActive = true;
                            }
                        break;
                        case 'bonus_movement_speed_pct':
                            if (isActive && !hasDrumsActive && item == 'ancient_janggo') {
                                totalAttribute += parseInt(attribute.value[0]);
                                hasDrumsActive = true;
                                excludeList.push(attribute.name);
                            }
                        break;
                        case 'windwalk_movement_speed':
                            if (isActive && !hasShadowBladeActive && (item == 'invis_sword' || item == 'silver_edge')) {
                                totalAttribute += parseInt(attribute.value[0]);
                                hasShadowBladeActive = true;
                            }
                        break;
                        case 'berserk_bonus_movement_speed':
                            if (isActive && !hasMoMActive && item == 'mask_of_madness') {
                                totalAttribute += parseInt(attribute.value[0]);
                                hasMoMActive = true;
                            }
                        break;
                        case 'bonus_movement_speed': //manta
                            if (!hasYasha && item == 'manta') {
                                totalAttribute += parseInt(attribute.value[0]);
                                hasYasha = true;
                            }
                            else if (item == 'smoke_of_deceit' && isActive) {
                                totalAttribute += parseInt(attribute.value[0]);
                            }
                        break;
                        case 'bonus_move_speed':
                            if (isActive && !hasButterflyActive && item == 'butterfly') {
                                totalAttribute += parseInt(attribute.value[0]);
                                hasButterflyActive = true;
                            }
                        break;
                    }
                }
            }
            return {value: totalAttribute/100, excludeList: excludeList};
        };
        
        self.getMovementSpeedPercentReduction = function (e) {
            var totalAttribute = 0,
                excludeList = e || [];
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
                if (!self.items()[i].enabled()) continue;
                for (var j = 0; j < my.prototype.itemData['item_' + item].attributes.length; j++) {
                    var attribute = my.prototype.itemData['item_' + item].attributes[j];
                    if (excludeList.indexOf(attribute.name) > -1) continue;
                    switch(attribute.name) {
                        case 'movespeed':
                            if (item == 'dust' && isActive) {
                                totalAttribute += parseInt(attribute.value[0]);
                            }
                        case 'blast_movement_speed':
                            if (item == 'shivas_guard' && isActive) {
                                totalAttribute += parseInt(attribute.value[0]);
                                excludeList.push(attribute.name);
                            }
                        case 'cold_movement_speed':
                            if (item == 'skadi') {
                                totalAttribute += parseInt(attribute.value[0]);
                            }
                        break;
                        case 'maim_movement_speed':
                            if (self.items()[i].debuff && self.items()[i].debuff == 'maim') {
                                totalAttribute += parseInt(attribute.value[0]);
                                excludeList.push(attribute.name);
                            }
                        break;
                    }
                }
            }
            return {value: totalAttribute/100, excludeList: excludeList};
        };
        
        self.getBonusDamage = function () {
            var totalAttribute = 0;
            var sources = {};
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
                if (!self.items()[i].enabled()) continue;
                for (var j = 0; j < my.prototype.itemData['item_' + item].attributes.length; j++) {
                    var attribute = my.prototype.itemData['item_' + item].attributes[j];
                    switch(attribute.name) {
                        case 'bonus_damage':
                            totalAttribute += parseInt(attribute.value[0]);
                            if (sources[item] == undefined) {
                                sources[item] = {
                                    'damage': parseInt(attribute.value[0]),
                                    'damageType': 'physical',
                                    'count':1,
                                    'displayname': my.prototype.itemData['item_' + item].displayname
                                }                            
                            }
                            else {
                                sources[item].count += 1;
                            }
                        break;
                        case 'unholy_bonus_damage':
                            if (isActive) {
                                totalAttribute += parseInt(attribute.value[0]);
                                if (sources[item + '_active'] == undefined) {
                                    sources[item + '_active'] = {
                                        'damage': parseInt(attribute.value[0]),
                                        'damageType': 'physical',
                                        'count':1,
                                        'displayname': my.prototype.itemData['item_' + item].displayname + ' Unholy Strength'
                                    }                            
                                }
                                else {
                                    sources[item].count += 1;
                                }
                            }
                        break;
                    }
                }
            }
            return { sources: sources, total: totalAttribute };
        };
        self.getBonusDamagePercent = function (s) {
            s = s || {sources:{},total:0};
            var totalAttribute = s.total || 0;
            var sources = s.sources || {};
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
                if (!self.items()[i].enabled()) continue;
                for (var j = 0; j < my.prototype.itemData['item_' + item].attributes.length; j++) {
                    var attribute = my.prototype.itemData['item_' + item].attributes[j];
                    switch(attribute.name) {
                        case 'damage_aura':
                            if (sources[item] == undefined) {
                                totalAttribute += parseInt(attribute.value[0]) / 100;
                                sources[item] = {
                                    'damage': parseInt(attribute.value[0]) / 100,
                                    'damageType': 'physical',
                                    'count':1,
                                    'displayname': my.prototype.itemData['item_' + item].displayname
                                }
                            }
                            // else {
                                // sources[item].count += 1;
                            // }
                        break;
                    }
                }
            }
            return { sources: sources, total: totalAttribute };
        };
        self.getAttackSpeed = function (e) {
            var totalAttribute = 0,
                hasPowerTreads = false,
                excludeList = e || [];
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
                if (!self.items()[i].enabled()) continue;
                for (var j = 0; j < my.prototype.itemData['item_' + item].attributes.length; j++) {
                    var attribute = my.prototype.itemData['item_' + item].attributes[j];
                    if (excludeList.indexOf(attribute.name) > -1) continue;
                    switch(attribute.name) {
                        case 'bonus_attack_speed':
                            if (item == 'power_treads') {
                                if (!hasPowerTreads) {
                                    totalAttribute += parseInt(attribute.value[0]);
                                    hasPowerTreads = true;
                                }
                            }
                            else if (item == 'moon_shard') {
                                if (!isActive) {
                                    totalAttribute += parseInt(attribute.value[0]);
                                }
                            }
                            else {
                                totalAttribute += parseInt(attribute.value[0]);
                            }
                        break;
                        case 'consumed_bonus':
                            if (item == 'moon_shard' && isActive) {
                                totalAttribute += parseInt(attribute.value[0]);
                            }
                        break;
                        break;
                        case 'bonus_speed':
                            totalAttribute += parseInt(attribute.value[0]);
                        break;
                        case 'aura_attack_speed':
                            if (item != 'shivas_guard') { totalAttribute += parseInt(attribute.value[0]); };
                        break;
                        // ancient_janggo
                        case 'bonus_aura_attack_speed_pct':
                            totalAttribute += parseInt(attribute.value[0]);
                            excludeList.push(attribute.name);
                        break;
                        // ancient_janggo
                        case 'bonus_attack_speed_pct':
                            if (isActive) {
                                totalAttribute += parseInt(attribute.value[0]);
                                excludeList.push(attribute.name);
                            }
                        break;
                        case 'unholy_bonus_attack_speed':
                            if (isActive) { totalAttribute += parseInt(attribute.value[0]); };
                        break;
                        case 'berserk_bonus_attack_speed':
                            if (isActive) { totalAttribute += parseInt(attribute.value[0]); };
                        break;
                    }
                }
            }
            return {value: totalAttribute, excludeList: excludeList};
        };
        self.getAttackSpeedReduction = function (e) {
            var totalAttribute = 0,
                excludeList = e || [];
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
                if (!self.items()[i].enabled()) continue;
                for (var j = 0; j < my.prototype.itemData['item_' + item].attributes.length; j++) {
                    var attribute = my.prototype.itemData['item_' + item].attributes[j];
                    if (excludeList.indexOf(attribute.name) > -1) continue;
                    switch(attribute.name) {
                        case 'aura_attack_speed':
                            if (item == 'shivas_guard') {
                                totalAttribute += parseInt(attribute.value[0]);
                                excludeList.push(attribute.name);
                            }
                        break;
                        case 'cold_attack_speed':
                            if (item == 'skadi') {
                                totalAttribute += parseInt(attribute.value[0]);
                                excludeList.push(attribute.name);
                            }
                        break;
                        case 'maim_attack_speed':
                            if (self.items()[i].debuff && self.items()[i].debuff == 'maim') {
                                totalAttribute += parseInt(attribute.value[0]);
                                excludeList.push(attribute.name);
                            }
                        break;
                    }
                }
            }
            return {value: totalAttribute, excludeList: excludeList};
        };
        self.getLifesteal = function () {
            var totalAttribute = 0;
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
                if (!self.items()[i].enabled()) continue;
                for (var j = 0; j < my.prototype.itemData['item_' + item].attributes.length; j++) {
                    var attribute = my.prototype.itemData['item_' + item].attributes[j];
                    switch(attribute.name) {
                        case 'lifesteal_percent':
                            if (item == 'satanic') {
                                if (!isActive) { return parseInt(attribute.value[0]); };
                            }
                            else {
                                return parseInt(attribute.value[0]);
                            }
                        break;
                        case 'unholy_lifesteal_percent':
                            if (isActive) { return parseInt(attribute.value[0]); };
                        break;
                    }
                }
            }
            return totalAttribute;
        };
        self.getLifestealAura = function (e) {
            var totalAttribute = 0,
                excludeList = e || [];
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
                if (!self.items()[i].enabled()) continue;
                for (var j = 0; j < my.prototype.itemData['item_' + item].attributes.length; j++) {
                    var attribute = my.prototype.itemData['item_' + item].attributes[j];
                    if (excludeList.indexOf(attribute.name) > -1) continue;
                    switch(attribute.name) {
                        case 'vampiric_aura':
                            totalAttribute += parseInt(attribute.value[0]);
                            excludeList.push(attribute.name);
                        break;
                    }
                }
            }
            return {value: totalAttribute, excludeList: excludeList};
        };
        self.getMagicResist = function () {
            var totalAttribute = 1;
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
                if (!self.items()[i].enabled()) continue;
                for (var j = 0; j < my.prototype.itemData['item_' + item].attributes.length; j++) {
                    var attribute = my.prototype.itemData['item_' + item].attributes[j];
                    switch(attribute.name) {
                        case 'bonus_magical_armor':
                            totalAttribute *= (1 - parseInt(attribute.value[0]) / 100);
                        break;
                        case 'bonus_spell_resist':
                            totalAttribute *= (1 - parseInt(attribute.value[0]) / 100);
                        break;
                        case 'magic_resistance':
                            totalAttribute *= (1 - parseInt(attribute.value[0]) / 100);
                        break;
                    }
                }
            }
            return totalAttribute;
        };
        self.getMagicResistReductionSelf = function () {
            var totalAttribute = 1;
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
                if (!self.items()[i].enabled()) continue;
                if (isActive) {
                    for (var j = 0; j < my.prototype.itemData['item_' + item].attributes.length; j++) {
                        var attribute = my.prototype.itemData['item_' + item].attributes[j];
                        switch(attribute.name) {
                            case 'extra_spell_damage_percent':
                            case 'ethereal_damage_bonus':
                                return (1 - parseInt(attribute.value[0]) / 100);
                            break;
                        }
                    }
                }
            }
            return totalAttribute;
        };   
        self.getMagicResistReduction = function () {
            var totalAttribute = 1;
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
                if (!self.items()[i].enabled()) continue;
                if (isActive) {
                    for (var j = 0; j < my.prototype.itemData['item_' + item].attributes.length; j++) {
                        var attribute = my.prototype.itemData['item_' + item].attributes[j];
                        switch(attribute.name) {
                            case 'ethereal_damage_bonus':
                                if (!self.isEthereal()) totalAttribute *= (1 - parseInt(attribute.value[0]) / 100);
                            case 'resist_debuff':
                                totalAttribute *= (1 - parseInt(attribute.value[0]) / 100);
                            break;
                        }
                    }
                }
            }
            return totalAttribute;
        };        

        self.getVisionRangeNight = ko.computed(function () {
            var totalAttribute = 0;
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
                if (!self.items()[i].enabled()) continue;
                for (var j = 0; j < my.prototype.itemData['item_' + item].attributes.length; j++) {
                    var attribute = my.prototype.itemData['item_' + item].attributes[j];
                    switch(attribute.name) {
                        case 'bonus_night_vision':
                            if (item != 'moon_shard' || !isActive) {
                                totalAttribute += parseInt(attribute.value[0]);
                            }
                        break;
                    }
                }
            }
            return totalAttribute;
        });
        
        self.getAttackRange = function (attacktype, aList) {
            var totalAttribute = 0,
                attributeList = aList || [];
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
                if (!self.items()[i].enabled()) continue;
                for (var j = 0;j < my.prototype.itemData['item_' + item].attributes.length; j++) {
                    var attribute = my.prototype.itemData['item_' + item].attributes[j];
                    if (attributeList.find(function (a) { return attribute.name == a.name; })) continue;
                    switch(attribute.name) {
                        // dragon_lance
                        case 'base_attack_range':
                            if (attacktype == 'DOTA_UNIT_CAP_RANGED_ATTACK') attributeList.push({'name':attribute.name, 'value': parseInt(attribute.value[0])});
                        break;
                    }
                }
            }
            
            totalAttribute = attributeList.reduce(function (memo, attribute) {
                return memo += attribute.value;
            }, 0);
            return {value: totalAttribute, attributes: attributeList};
        };
        
        self.getMissChance = function (e) {
            var totalAttribute = 1,
                excludeList = e || [];
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
                if (!self.items()[i].enabled()) continue;
                for (var j = 0; j < my.prototype.itemData['item_' + item].attributes.length; j++) {
                    var attribute = my.prototype.itemData['item_' + item].attributes[j];
                    if (excludeList.indexOf(attribute.name) > -1) continue;
                    switch(attribute.name) {
                        case 'miss_chance':
                            totalAttribute *= (1 - parseInt(attribute.value[0]) / 100);
                            excludeList.push(attribute.name);
                        break;
                        case 'blind_pct':
                            totalAttribute *= (1 - parseInt(attribute.value[0]) / 100);
                            excludeList.push(attribute.name);
                        break;
                    }
                }
            }
            return {value: totalAttribute, excludeList: excludeList};
        };
        
        self.getBaseDamageReductionPct = function () {
            var totalAttribute = 1;
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
                if (!self.items()[i].enabled()) continue;
                for (var j = 0; j < my.prototype.itemData['item_' + item].attributes.length; j++) {
                    var attribute = my.prototype.itemData['item_' + item].attributes[j];
                    switch(attribute.name) {
                        case 'backstab_reduction':
                            if (self.items()[i].debuff && self.items()[i].debuff == 'shadow_walk') {
                                totalAttribute *= (1 + parseInt(attribute.value[0]) / 100);
                            }
                        break;
                    }
                }
            }
            return totalAttribute;
        };    
        self.getBonusDamageReductionPct = function () {
            var totalAttribute = 1;
            for (var i = 0; i < self.items().length; i++) {
                var item = self.items()[i].item;
                var isActive = self.activeItems.indexOf(self.items()[i]) >= 0 ? true : false;
                if (!self.items()[i].enabled()) continue;
                for (var j = 0; j < my.prototype.itemData['item_' + item].attributes.length; j++) {
                    var attribute = my.prototype.itemData['item_' + item].attributes[j];
                    switch(attribute.name) {
                        case 'backstab_reduction':
                            if (self.items()[i].debuff && self.items()[i].debuff == 'shadow_walk') {
                                totalAttribute *= (1 + parseInt(attribute.value[0]) / 100);
                            }
                        break;
                    }
                }
            }
            return totalAttribute;
        };    
        
        self.itemOptions = ko.observableArray([]);
        var itemOptionsArr = [];
        for (var i = 0; i < my.prototype.validItems.length; i++) {
            itemOptionsArr.push(new my.prototype.ItemInput(my.prototype.validItems[i], my.prototype.itemData['item_' + my.prototype.validItems[i]].displayname));
        }
        self.itemOptions.push.apply(self.itemOptions, itemOptionsArr);
        /*for (i in my.prototype.itemData) {
            self.itemOptions.push(new my.prototype.ItemInput(i.replace('item_',''),my.prototype.itemData[i].displayname));
        }*/
        
        var itemBuffs = ['assault', 'ancient_janggo', 'headdress', 'mekansm', 'pipe', 'ring_of_aquila', 'vladmir', 'ring_of_basilius', 'buckler', 'solar_crest'];
        self.itemBuffOptions = ko.observableArray(itemBuffs.map(function(item) { return new my.prototype.ItemInput(item, my.prototype.itemData['item_' + item].displayname); }));
        self.selectedItemBuff = ko.observable('assault');

        var itemDebuffs = [
            {item: 'assault', debuff: null},
            {item: 'shivas_guard', debuff: null},
            {item: 'desolator', debuff: null},
            {item: 'medallion_of_courage', debuff: null},
            {item: 'radiance', debuff: null},
            {item: 'sheepstick', debuff: null},
            {item: 'veil_of_discord', debuff: null},
            {item: 'solar_crest', debuff: null},
            {item: 'silver_edge', debuff: {id: 'shadow_walk', name: 'Shadow Walk'}},
            {item: 'silver_edge', debuff: {id: 'maim', name: 'Lesser Maim'}}
        ]
        self.itemDebuffOptions = ko.observableArray(itemDebuffs.map(function(item) {
            return new my.prototype.ItemInput(item.item, my.prototype.itemData['item_' + item.item].displayname, item.debuff);
        }));
        self.selectedItemDebuff = ko.observable('assault');
        
        return self;
    };
    
});