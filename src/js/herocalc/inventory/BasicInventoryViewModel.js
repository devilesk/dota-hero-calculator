var ko = require("knockout");
var stackableItems = require("./stackableItems");
var levelItems = require("./levelItems");
var itemsWithActive = require("./itemsWithActive");

var BasicInventoryViewModel = function (h) {
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
                    new_item.size = Math.min(new_item.size, 2);
                break;
                case 'necronomicon':
                    new_item.size = Math.min(new_item.size, 3);
                break;
            }
            this.items.push(new_item);
            if (data.selectedItem() === 'ring_of_aquila' || data.selectedItem() === 'ring_of_basilius' || data.selectedItem() === 'heart') {
                this.toggleItem(undefined, new_item, undefined);
            }
        }
    }.bind(this);
    self.toggleItem = function (index, data, event) {
        if (itemsWithActive.indexOf(data.item) >= 0) {
            if (this.activeItems.indexOf(data) < 0) {
                this.activeItems.push(data);
            }
            else {
                this.activeItems.remove(data);
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
        this.activeItems.remove(item);
        this.items.remove(item);
    }.bind(this);
    self.toggleMuteItem = function (item) {
        item.enabled(!item.enabled());
    }.bind(this);
    self.removeAll = function () {
        this.activeItems.removeAll();
        this.items.removeAll();
    }.bind(this);
}
BasicInventoryViewModel.prototype.getItemImage = function (data) {
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
BasicInventoryViewModel.prototype.getItemSizeLabel = function (data) {
    if (stackableItems.indexOf(data.item) != -1) {
        return '<span style="font-size:10px">Qty: </span>' + data.size;
    }
    else if (levelItems.indexOf(data.item) != -1) {
        return '<span style="font-size:10px">Lvl: </span>' + data.size;
    }
    else if (data.item == 'bloodstone') {
        return '<span style="font-size:10px">Charges: </span>' + data.size;
    }
    else {
        return '';
    }
};
BasicInventoryViewModel.prototype.getActiveBorder = function (data) {
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
BasicInventoryViewModel.prototype.getItemAttributeValue = function (attributes, attributeName, level) {
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

module.exports = BasicInventoryViewModel;