'use strict';
var ko = require('./herocalc_knockout');
    
var my = require("../herocalc/main");

my.prototype.GraphPropertyOption = function (id, label) {
    this.id = id;
    this.label = label;
};

my.prototype.AbilityModel.prototype.isQWER = function (ability) {
    return (ability.displayname != 'Empty' &&  (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_HIDDEN') == -1 || ability.name.indexOf('invoker_') != -1) && ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE') == -1)
}

my.prototype.BuildExplorerViewModel = function (h) {
var self = this;
    self.parent = h;

    self.itemBuild = ko.observableArray([]);
    self.skillBuild = ko.observableArray([]);
    self.graphDataItemRows = [];
    for (var i = 0; i < 25; i++) {
        self.itemBuild.push(new my.prototype.BasicInventoryViewModel());
        self.itemBuild()[i].carryOver = ko.observable(true);
        self.skillBuild.push(ko.observable(-1));
        self.graphDataItemRows.push(ko.observable(false));
    }
    self.toggleItemBuildCarryOver = function (index) {
        self.itemBuild()[index].carryOver(!self.itemBuild()[index].carryOver());
    }
    
    self.abilityMapData = [0,1,2,3,4];
    self.abilityMapHero = self.parent.selectedHero().heroName;
    self.abilityMap = ko.computed(function () {
        if (self.abilityMapHero == self.parent.selectedHero().heroName) return;
        self.abilityMapHero = self.parent.selectedHero().heroName;
        var newMap = self.parent.ability().abilities.map(function(ability, index) {
            if (self.parent.ability().isQWER(ability)) {
                return index;
            }
            else {
                return -1;
            }
        }).filter(function(element) { return element != -1; });
        for (var i = 0; i < 25; i++) {
            var abilityValue = self.skillBuild()[i]();
            if (abilityValue == -1) continue;
            
            var abilityIndex = self.abilityMapData.indexOf(abilityValue);
            var newValue = newMap[abilityIndex];
            if (newValue != abilityValue) {
                self.skillBuild()[i](newValue);
            }
        }
        self.abilityMapData = newMap;
    });
    
    self.availableSkillBuildPoints = ko.computed(function () {
        return self.skillBuild().reduce(function(memo, num){ return memo + (num() == -1); }, 0);
    });
    self.getSkillBuildAbilityLevel = function (index) {
        return self.skillBuild().reduce(function(memo, num){ return memo + (num() == index); }, 0);
    };
    self.toggleAbilitySkillBuild = function (index, abilityIndex, data, event) {
        if (self.skillBuild()[index]() != abilityIndex) {
            var ability = self.parent.ability().abilities[abilityIndex],
                abilityType = ability.abilitytype,
                skillBuildSlice = self.skillBuild().slice(0, index),
                currentAbilityLevel = self.skillBuild().reduce(function(memo, num){ return memo + (num() == abilityIndex); }, 0),
                n = skillBuildSlice.reduce(function(memo, num){ return memo + (num() == abilityIndex); }, 0);
            
            if (self.IsValidAbilityLevel(ability, self.parent.selectedHero().heroName, index + 1, n)) {
                self.skillBuild()[index](abilityIndex);
                for (var i = index + 1; i < 25; i++) {
                    if (self.skillBuild()[i]() == abilityIndex) {
                        n++;
                        if (!self.IsValidAbilityLevel(ability, self.parent.selectedHero().heroName, i + 1, n)) {
                            self.skillBuild()[i](-1);
                            n--;
                        }
                    }
                }
            }
            else if (n > 0 && self.IsValidAbilityLevel(ability, self.parent.selectedHero().heroName, index + 1, n - 1)) {
                for (var i = skillBuildSlice.length - 1; i >= 0; i--) {
                    if (skillBuildSlice[i]() == abilityIndex) {
                        self.skillBuild()[i](-1);
                        self.skillBuild()[index](abilityIndex);
                        break;
                    }
                }
            }
        }
        else {
            self.skillBuild()[index](-1);
        }
    };
    self.IsValidAbilityLevel = function (ability, heroName, heroLevel, abilityLevel) {
        var a = 1, b = 2, m = 4;
        if (ability.name == 'attribute_bonus') {
            m = 10;
        }
        else {
            if (ability.abilitytype == 'DOTA_ABILITY_TYPE_ULTIMATE') {
                if (heroName == 'invoker') {
                    a = 2;
                    b = 5;
                }
                else if (heroName == 'meepo') {
                    a = 3;
                    b = 7;
                    m = 3;
                }
                else {
                    a = 6;
                    b = 5;
                    m = 3;
                }
            }
            else {
                if (heroName == 'invoker') {
                    m = 7;
                }
            }                
        }
        
        return heroLevel >= a + b * abilityLevel && abilityLevel < m;
    }
    
    self.resetItemBuild = function (index) {
        self.itemBuild()[index].removeAll();
    };        
    self.resetAllItemBuilds = function () {
        for (var i = 0; i < 25; i++) {
            self.itemBuild()[i].removeAll();
            self.itemBuild()[i].carryOver(true);
        }
    };
    self.resetSkillBuild = function () {
        for (var i = 0; i < 25; i++) {
            self.skillBuild()[i](-1);
        }
    };
    self.graphData = ko.observableArray([]);
    self.graphDataHeader = ko.observable(self.parent.selectedHero().heroDisplayName);
    self.parent.selectedHero.subscribe(function (newValue) {
        self.graphDataHeader(self.parent.selectedHero().heroDisplayName);
    });
    self.graphDataDescription = ko.observable('');
    self.graphProperties = ko.observableArray([
        new my.prototype.GraphPropertyOption('totalArmorPhysical', 'Armor'),
        new my.prototype.GraphPropertyOption('totalArmorPhysicalReduction', 'Physical Damage Reduction'),
        new my.prototype.GraphPropertyOption('totalMagicResistance', 'Magical Resistance'),
        new my.prototype.GraphPropertyOption('health', 'Health'),
        new my.prototype.GraphPropertyOption('healthregen', 'Health Regeneration'),
        new my.prototype.GraphPropertyOption('mana', 'Mana'),
        new my.prototype.GraphPropertyOption('manaregen', 'Mana Regeneration'),
        new my.prototype.GraphPropertyOption('ehpPhysical', 'EHP Physical'),
        new my.prototype.GraphPropertyOption('ehpMagical', 'EHP Magical'),
        new my.prototype.GraphPropertyOption('damage', 'Damage per attack'),
        new my.prototype.GraphPropertyOption('dps', 'Damage per second'),
        new my.prototype.GraphPropertyOption('attacksPerSecond', 'Attacks per second'),
        new my.prototype.GraphPropertyOption('attackTime', 'Time per attack')
    ]);
    self.graph = function() {
        var savedAbilityLevels = [],
            savedLevel = self.parent.selectedHeroLevel(),
            savedItems = self.parent.inventory.items(),
            savedActiveItems = self.parent.inventory.activeItems(),
            s = ko.toJS(self.skillBuild),
            carryOverItems = [],
            carryOverActiveItems = [],
            dataset = [];
        for (var i = 0; i < self.parent.ability().abilities.length; i++) {
            savedAbilityLevels.push(self.parent.ability().abilities[i].level());
        }
        for (var i = 1; i < 26; i++) {
            self.parent.selectedHeroLevel(i);
            var skillBuildSubset = s.slice(0, i);
            for (var j = 0; j < self.parent.ability().abilities.length; j++) {
                var a = self.parent.ability().abilities[j],
                    count = skillBuildSubset.reduce(function(memo, num) {
                        return memo + (num == j);
                    }, 0);
                a.level(count);
            }

            if (!self.itemBuild()[i - 1].carryOver()) {
                carryOverItems = [];
                carryOverActiveItems = [];
            }
            carryOverItems = carryOverItems.concat(self.itemBuild()[i - 1].items());
            carryOverActiveItems = carryOverActiveItems.concat(self.itemBuild()[i - 1].activeItems());

            self.parent.inventory.items(carryOverItems);
            self.parent.inventory.activeItems(carryOverActiveItems);
            var dataObj = {};
            for (var j = 0; j < self.graphProperties().length; j++) {
                var prop = self.graphProperties()[j];
                switch (prop.id) {
                    case 'dps':
                        dataObj[prop.id] = self.parent['damageTotalInfo']().totalRow[2]().toFixed(2);
                        break;
                    case 'damage':
                        dataObj[prop.id] = self.parent['damageTotalInfo']().totalRow[0]().toFixed(2);
                        break;
                    default:
                        dataObj[prop.id] = self.parent[prop.id]();
                        break;
                }
            }

            dataObj.items = carryOverItems.map(function(item) {
                return ko.toJS(item);
            });
            dataset.push(dataObj);
            if (carryOverItems > 0) {
                self.graphDataItemRows[i - 1](true);
            }
        }
        var data = {
            header: self.graphDataHeader(),
            description: self.graphDataDescription(),
            items: self.parent.inventory.items().map(function(item) {
                return ko.toJS(item);
            }),
            skillBuild: ko.toJS(self.skillBuild),
            data: dataset,
            abilityMap: self.abilityMapData.slice(0),
            cumulativeSkillBuild: [],
            visible: ko.observable(true)
        }
        for (var i = 0; i < 25; i++) {
            var skillBuildAtLevel = [],
                skillBuildSlice = data.skillBuild.slice(0, i + 1);
            for (var j = 0; j < data.abilityMap.length; j++) {
                var abilityIndex = data.abilityMap[j];
                skillBuildAtLevel.push(skillBuildSlice.reduce(function(memo, num) {
                    return memo + (num == abilityIndex);
                }, 0));
            }
            data.cumulativeSkillBuild.push(skillBuildAtLevel);
        }

        self.graphData.push(data);
        self.parent.selectedHeroLevel(savedLevel);
        for (var i = 0; i < self.parent.ability().abilities.length; i++) {
            self.parent.ability().abilities[i].level(savedAbilityLevels[i]);
        }
        self.parent.inventory.items(savedItems);
        self.parent.inventory.activeItems(savedActiveItems);
    };
    self.removeGraphDataSet = function (data) {
        self.graphData.remove(data);
    }
    self.selectedGraphProperty = ko.observable(self.graphProperties()[0].id);
    
    self.graphChartOptions = ko.computed(function () {
        //var color = my.prototype.theme() == 'dark' ? 'rgb(151, 154, 162)' : 'rgb(51, 51, 51)';
        var color = 'rgb(151, 154, 162)';
        return {
            responsive: true,
            datasetStroke: false,
            datasetStrokeWidth: -1,
            datasetFill: false,
            pointHitDetectionRadius : 10,
            scaleFontColor: color,
            scaleLineColor: color.replace('rgb', 'rgba').replace(')', ', .1)'),
            scaleGridLineColor: color.replace('rgb', 'rgba').replace(')', ', .1)')
        }
    });
    self.graphChartData = ko.computed(function () {
        var data = {
            labels: [],
            datasets: []
        }
        for (var i = 0; i < 25; i++) {
            data.labels.push((i+1).toString());
        }
        for (var i = 0; i < self.graphData().length; i++) {
            var dataObj = self.graphData()[i],
                dataset = {
                    label: dataObj.header,
                    fillColor: self.graphDistinctColor(self.graphData().length, i, .1),
                    strokeColor: self.graphDistinctColor(self.graphData().length, i, 1),
                    pointColor: self.graphDistinctColor(self.graphData().length, i, 1),
                    pointStrokeColor: self.graphDistinctColor(self.graphData().length, i, 1),
                    pointHighlightFill: self.graphDistinctColor(self.graphData().length, i, .1),
                    pointHighlightStroke: self.graphDistinctColor(self.graphData().length, i, .5),
                    data: dataObj.data.map(function (o) {
                        return o[self.selectedGraphProperty()]
                    })
                };
            data.datasets.push(dataset);
        }
        return data;
    });
    self.graphDistinctColor = function (max, index, alpha) {
        var alpha = alpha || 1,
            rgba = self.hslToRgb((1 / max) * index % 1, 1, .5);
        rgba.push(alpha);
        return "rgba(" + rgba.join() + ")";
    }
    self.getDistinctColor = function (max, index, alpha) {
        var alpha = alpha || 1;
        rgba = self.hslToRgb((1 / max) * index % 1, 1, .5);
        rgba.push(alpha);
        return rgba;
    }
    self.hslToRgb = function(h, s, l) {
        var r, g, b;
        if (s == 0) {
            r = g = b = l; // achromatic
        }
        else {
            var hue2rgb = function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
    
    self.showGraphItemBuildRows = ko.observable(false);
    self.showGraphSkillBuildColumns = ko.observable(false);
    self.graphRowHasItems = function (index) {
        return self.graphData().some(function (dataset) {
            return dataset.visible() && dataset.data[index].items.length > 0;
        });
    }

    self.selectInventory = function (index) {
        self.parent.selectedInventory(self.parent.selectedInventory() == index ? -1 : index);
    }
    self.getSelectedInventory = ko.pureComputed(function () {
        if (self.parent.selectedInventory() == -1) {
            return self.parent.inventory;
        }
        else {
            return self.itemBuild()[self.parent.selectedInventory()];
        }
    });
    self.copyInventory = function (index) {
        if (self.parent.selectedInventory() != -1 && self.parent.selectedInventory() != index) {
            self.itemBuild()[self.parent.selectedInventory()].items(self.itemBuild()[self.parent.selectedInventory()].items().concat(self.itemBuild()[index].items()));
            self.itemBuild()[self.parent.selectedInventory()].activeItems(my.prototype.union(self.itemBuild()[self.parent.selectedInventory()].activeItems(), self.itemBuild()[index].activeItems()));
        }
    }
    self.copyInventoryToClipBoard = function (index) {
        if (index == -1) {
            my.prototype.inventoryClipBoard.items = self.parent.inventory.items.slice(0);
            my.prototype.inventoryClipBoard.activeItems = self.parent.inventory.activeItems.slice(0);            
        }
        else {
            my.prototype.inventoryClipBoard.items = self.itemBuild()[index].items.slice(0);
            my.prototype.inventoryClipBoard.activeItems = self.itemBuild()[index].activeItems.slice(0);
        }
    }
    self.pasteInventoryFromClipBoard = function (index) {
        if (my.prototype.inventoryClipBoard.items.length > 0) {
            if (index == -1) {
                self.parent.inventory.items(self.parent.inventory.items().concat(my.prototype.inventoryClipBoard.items));
                self.parent.inventory.activeItems(my.prototype.union(self.parent.inventory.activeItems(), my.prototype.inventoryClipBoard.activeItems));    
            }
            else {
                self.itemBuild()[index].items(self.itemBuild()[index].items().concat(my.prototype.inventoryClipBoard.items));
                self.itemBuild()[index].activeItems(my.prototype.union(self.itemBuild()[index].activeItems(), my.prototype.inventoryClipBoard.activeItems));
            }
        }
    }
    self.loadGraphData = function (data) {
        self.parent.sectionDisplay()['skillbuild'](true);
        for (var i = 0; i < data.length; i++) {
            data[i].visible = ko.observable(data[i].visible);
        }
        self.graphData(data);
    }
    self.graphChartContext = ko.observable();
    self.exportImage = function () {
        var w = window.open();
        w.document.write('<img src="'+ self.graphChartContext().canvas.toDataURL() +'"/>');
    }
    return self;
}