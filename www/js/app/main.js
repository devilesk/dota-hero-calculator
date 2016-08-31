define(function (require, exports, module) {
    'use strict';
    var ko = require('herocalc_knockout');
    var $ = require('jquery');
    require('bootstrap');
    require('jquery-ui.custom');
    require('chartjs');
    require('chartjs-scatter');
    require('components');
    
    ko.components.register('hero-pane', { require: 'components/hero-pane' });
    ko.components.register('unit-pane', { require: 'components/unit-pane' });
    ko.components.register('clone-pane', { require: 'components/clone-pane' });
    ko.components.register('illusion-pane', { require: 'components/illusion-pane' });
    ko.components.register('buff-settings', { require: 'components/buff-settings' });
    ko.components.register('item-buff', { require: 'components/item-buff' });
    ko.components.register('item-debuff', { require: 'components/item-debuff' });
    ko.components.register('buff-section', { require: 'components/buff-section' });
    ko.components.register('damage-details', { require: 'components/damage-details' });
    ko.components.register('damage-amp', { require: 'components/damage-amp' });
    ko.components.register('ability', { require: 'components/ability' });
    ko.components.register('shop', { require: 'components/shop' });
    ko.components.register('stat', { require: 'components/stats/stat' });
    ko.components.register('stats0', { require: 'components/stats/stats0' });
    ko.components.register('stats1', { require: 'components/stats/stats1' });
    ko.components.register('stats2', { require: 'components/stats/stats2' });
    ko.components.register('stats3', { require: 'components/stats/stats3' });
    ko.components.register('stats-additional', { require: 'components/stats/stats-additional' });

    // The app extends the herocalc library, provides a frontend
    var my = require("herocalc").HEROCALCULATOR;
    console.log('app/main', my);
    
    my.prototype.PlayerColors = [
        "#2E6AE6", //Blue
        "#5DE6AD", //Teal
        "#AD00AD", //Purple
        "#DCD90A", //Yellow
        "#E66200", //Orange
        "#E67AB0", //Pink
        "#92A440", //Pus Yellow
        "#5CC5E0", //Light Blue
        "#00771F", //Green
        "#956000" //Brown
    ];
    
    my.prototype.Tab = function (id, href, data, text, color, template) {
        var self = this;
        self.id = id;
        self.href = href;
        self.color = color;
        self.data = data;
        self.data.id = ko.observable(self.href);
        self.text = text;
        self.template = template;
        return self;
    }
    my.prototype.Tab.prototype.toJS = function () {
        return {
            id: this.id,
            href: this.href,
            color: this.color,
            text: this.text,
            template: this.template
        }
    }
    
    my.prototype.TabGroup = function (hero, unit, clone) {
        var self = this;
        self.hero = hero;
        self.unit = unit;
        self.clone = clone;
        self.illusions = ko.observableArray([]);
        return self;
    }
    my.prototype.TabGroup.prototype.toJS = function () {
        return {
            hero: this.hero.toJS(),
            unit: this.unit.toJS(),
            clone: this.clone.toJS(),
            illusions: this.illusions().map(function (illusion) { return illusion.toJS(); })
        }
    }
    
    my.prototype.HeroCalculatorViewModel = function () {
        var self = this;
        self.heroes = [];

        for (var i = 0; i < 10; i++) {
            self.heroes.push(new my.prototype.HeroCalculatorModel(i));
        }
        
        for (var i = 0; i < 5; i++) {
            var arr = [];
            for (var j = 5; j < 10; j++) {
                arr.push(self.heroes[j]);
            }
            self.heroes[i].enemies.push.apply(self.heroes[i].enemies, arr);
        }
        for (var i = 5; i < 10; i++) {
            var arr = [];
            for (var j = 0; j < 5; j++) {
                arr.push(self.heroes[j]);
            }
            self.heroes[i].enemies.push.apply(self.heroes[i].enemies, arr);
        }
        for (var i = 0; i < 10; i++) {
            var arr = [];
            for (var j = 0; j < 10; j++) {
                if (i !== j) arr.push(self.heroes[j]);
            }
            self.heroes[i].otherHeroes.push.apply(self.heroes[i].otherHeroes, arr);
        }
        
        for (var i = 0; i < 10; i++) {
            self.heroes[i].clone = ko.observable(new my.prototype.CloneViewModel(0, self.heroes[i]));
            self.heroes[i].unit = ko.observable(new my.prototype.UnitViewModel(0, self.heroes[i]));
            
            self.heroes[i].selectedCompare(self.heroes[i].availableCompare()[i < 5 ? 4 + i : i - 5]);
            self.heroes[i].selectedEnemy(self.heroes[i].availableEnemies()[i % 5]);
            //self.heroes[i].enemy = ko.observable(self.heroes[i < 2 ? 2 : 0]);
            self.heroes[i].unit().enemy(self.heroes[i].enemy());
            //self.heroes[i].unit().enemy = ko.observable(self.heroes[i < 2 ? 2 : 0]);
            //self.heroes[i].heroCompare = ko.observable(self.heroes[1 - (i % 2) + (i < 2 ? 0 : 2)]);
            
            self.heroes[i].unit().selectedUnit(self.heroes[i].unit().availableUnits()[0]);
            //self.heroes[i].selectedHero(self.heroes[i].availableHeroes()[i < 2 ? 0 : 2]);
            self.heroes[i].illusions.subscribe(function (changes) {
                for (var i = 0; i < changes.length; i++) {
                    if (changes[i].status == 'added') {
                        var color = this.index < 2 ? '#5cb85c' : '#d9534f',
                            j = my.prototype.uniqueId();
                        self.tabs()[this.index].illusions.push(
                            new my.prototype.Tab(
                                'illusionTab' + this.index + '-' + j,
                                'illusionPane' + this.index + '-' + j,
                                self.heroes[this.index].illusions()[self.tabs()[this.index].illusions().length](),
                                'Illusion ' + j,
                                color,
                                'illusion-pane')
                        );
                    }
                }
            }, {vm: this, index: i}, "arrayChange");
        }
        //self.heroes[0].showUnitTab(true);
        self.heroes[0].bound(true);
        self.tabs = ko.observableArray([]);
        var tabsArr = [];
        for (var i = 0; i < 10; i++) {
            //var color = i < 5 ? '#5cb85c' : '#d9534f';
            var color = my.prototype.PlayerColors[i];
            var tabGroup = new my.prototype.TabGroup(
                new my.prototype.Tab('heroTab' + i, 'heroPane' + i, self.heroes[i], 'Hero ' + i, color, 'hero-pane'),
                new my.prototype.Tab('unitTab' + i, 'unitPane' + i, self.heroes[i].unit(), 'Unit ' + i, color, 'unit-pane'),
                new my.prototype.Tab('cloneTab' + i, 'clonePane' + i, self.heroes[i].clone(), 'Meepo Clone ' + i, color, 'clone-pane')
            );
            //self.tabs.push(tabGroup);
            tabsArr.push(tabGroup);
        }
        self.tabs.push.apply(self.tabs, tabsArr);//.slice(0, 1));

        self.selectedItem = ko.observable();
        self.layout = ko.observable("1");
        self.displayShop = ko.observable(true);
        self.displayShopItemTooltip = ko.observable(true);
        self.allItems = ko.observableArray([
            {name: 'Str, Agi, Int, MS, Turn, Sight', value: 'stats0'},
            {name: 'Armor, Health, Mana, Regen, EHP', value: 'stats1'},
            {name: 'Phys Res, Magic Res, Lifesteal, Evasion, Bash, Miss', value: 'stats2'},
            {name: 'Damage, IAS, BAT, Attack', value: 'stats3'}
        ]); // Initial items
        self.selectedItems = ko.observableArray([]); 
        self.moveUp = function () {
            var start = self.allItems.indexOf(self.selectedItems()[0]),
                end = self.allItems.indexOf(self.selectedItems()[self.selectedItems().length - 1]);
            if (start > 0) {
                var e = self.allItems.splice(start - 1, 1);
                self.allItems.splice(end, 0, e[0]);            
            }
        };
        self.moveDown = function () {
            var start = self.allItems.indexOf(self.selectedItems()[0]),
                end = self.allItems.indexOf(self.selectedItems()[self.selectedItems().length - 1]);        
            if (end < self.allItems().length - 1) {
                var e = self.allItems.splice(end + 1, 1);
                self.allItems.splice(start, 0, e[0]);
            }
        };
        self.selectedTabId = ko.observable('heroTab0');
        self.getSelectedTab = function (tabId) {
            var indices = tabId.replace('heroTab', '').replace('cloneTab', '').replace('unitTab', '').replace('illusionTab', '').split('-'),
                index = indices[0],
                tab = self.tabs()[index];
            return tab;
        }
        self.selectedTab = ko.computed(function () {
            /*var indices = self.selectedTabId().replace('heroTab', '').replace('cloneTab', '').replace('unitTab', '').replace('illusionTab', '').split('-'),
                index = indices[0],
                tab = self.tabs()[index];*/
            var tab = self.getSelectedTab(self.selectedTabId());
            if (self.selectedTabId().indexOf('hero') != -1) {
                return tab.hero;
            }
            else if (self.selectedTabId().indexOf('unit') != -1) {
                return tab.unit;
            }
            else if (self.selectedTabId().indexOf('clone') != -1) {
                return tab.clone;
            }
            else if (self.selectedTabId().indexOf('illusion') != -1) {
                return tab.illusions().find(function (tab) {
                    return tab.id == self.selectedTabId();
                });
            }
            else {
                return self.tabs()[0].hero;
            }
        });
        self.selectedTabs = ko.observableArray(['heroTab0', 'heroTab1']);
        //self.selectedTabs.push('heroTab0');
        //self.selectedTabs.push('heroTab1');
        self.boundSettings = ko.observable(false);
        self.clickTab = function (data, event, index) {
            /*if (event.target.id != 'settingsTab') {
                self.selectedTabId(event.target.id);
            }*/
            self.selectedTabId(event.target.id);
            if (self.selectedTabs()[1] != event.target.id) {
                self.selectedTabs.shift();
                self.selectedTabs.push(event.target.id);
            }
            if (self.selectedTab().data.hasOwnProperty('bound')) {
                self.selectedTab().data.bound(true);

                // make sure build explorer graph renders
                setTimeout(function () {
                    self.selectedTab().data.buildExplorer.graphData.valueHasMutated();
                }, 0);
            }
            if (event.target.id === 'settingsTab') self.boundSettings(true);
        };
        self.isSecondTab = function (id) {
            return self.selectedTabs().indexOf(id) > -1 && self.selectedTabId() != id;
        }
        
        self.showSideTabId = function (id) {
            return self.selectedTabs().indexOf(id) > -1 && self.sideView();
        };
        
        self.removeTab = function (index, data, event, tab) {
            if (data.id == self.selectedTabId()) {
                //self.selectedTabId('heroTab0');
                self.clickTab(null, {target: {id: 'heroTab0'}});
                $('#heroTab0').tab('show');
            }
            self.tabs()[tab].illusions.remove(function (illusion) {
                return illusion == data;
            });
            self.heroes[tab].illusions.remove(function (illusion) {
                return illusion() == data.data;
            });
        };
        
        self.sideView = ko.observable(false);
        self.sideView.subscribe(function (newValue) {
            if (newValue) {
                if (!self.shopPopout()) {
                    self.displayShop(false);
                }
                for (var i = 0; i < self.selectedTabs().length; i++) {
                    var tab = self.getSelectedTab(self.selectedTabs()[i]);
                    if (tab && tab.hero.data.hasOwnProperty('bound')) {
                        tab.hero.data.bound(true);
                    }
                }
                self.layout("0");
            }
        });
        var $window = $(window);
        self.windowWidth = ko.observable($window.width());
        self.windowHeight = ko.observable($window.height());
        $window.resize(function () { 
            self.windowWidth($window.width());
            self.windowHeight($window.height());
        });
        self.shopDock = ko.observable(false);
        self.shopDock.subscribe(function (newValue) {
            if (newValue) {

            }
            else {
            }
        });
    
        self.shopDockTrigger = ko.computed(function () {
            self.windowWidth();
            self.shopDock();
        });
        self.shopPopout = ko.observable(false);
        self.shopPopout.subscribe(function (newValue) {
            if (newValue) {
                self.displayShop(true);
                $( "#shop-dialog" ).dialog({
                    minWidth: 380,
                    minHeight: 0,
                    closeText: "",
                    open: function ( event, ui ) {
                        $(event.target.offsetParent).find('.ui-dialog-titlebar').find('button')
                            .addClass('close glyphicon glyphicon-remove shop-button btn btn-default btn-xs pull-right')
                            .removeClass('ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only ui-dialog-titlebar-close close')
                            .css('margin-right','0px')
                            .parent()
                                .append($('#shop-minimize'))
                                .append($('#shop-maximize'));
                        $(event.target.offsetParent).find('.ui-dialog-titlebar').dblclick(function () {
                            self.displayShop(!self.displayShop());
                        });
                    },
                    close: function ( event, ui ) {
                        self.shopPopout(false);
                    }
                });
            }
            else {
                $('#shop-container').prepend($('#shop-minimize')).prepend($('#shop-maximize'));
                $( "#shop-dialog" ).dialog("destroy");
            }
        });

        
        self.changeSelectedItem = function (data, event) {
            self.itemInputValue(1);
            self.selectedItem(event.target.id);
        }
        
        self.getItemTooltipData = ko.computed(function () {
            return my.prototype.getItemTooltipData(self.selectedItem());
        }, this);
        self.getItemInputLabel = ko.computed(function () {
            if (my.prototype.stackableItems.indexOf(self.selectedItem()) != -1) {
                return 'Stack Size'
            }
            else if (my.prototype.levelitems.indexOf(self.selectedItem()) != -1) {
                return 'Upgrade Level'
            }
            else if (self.selectedItem() == 'bloodstone') {
                return 'Charges'
            }
            else {
                return ''
            }
        }, this);
        self.itemInputValue = ko.observable(1);
        self.saveLink = ko.observable();
        self.getAppState = function () {
            var data = {
                selectedItem: self.selectedItem,
                layout: self.layout,
                displayShop: self.displayShop,
                displayShopItemTooltip: self.displayShopItemTooltip,
                allItems: self.allItems,
                selectedItems: self.selectedItems,
                selectedTabId: self.selectedTabId,
                selectedTabs: self.selectedTabs,
                boundSettings: self.boundSettings,
                sideView: self.sideView,
                windowWidth: self.windowWidth,
                windowHeight: self.windowHeight,
                shopDock: self.shopDock,
                shopPopout: self.shopPopout,
                itemInputValue: self.itemInputValue,
                saveLink: self.saveLink
            }
            data.tabs = self.tabs().map(function (tab) { return tab.toJS() });
            return ko.toJS(data);
        }
        self.getSaveData = function () {
            var data = {
                version: "1.3.0",
                heroes: []
            }
            for (var i = 0; i < 10; i++) {
                var hero = self.heroes[i];
                var d = {
                    hero: hero.selectedHero().heroName,
                    level: hero.selectedHeroLevel(),
                    items: [],
                    abilities: [],
                    skillPointHistory: hero.skillPointHistory(),
                    buffs: [],
                    itemBuffs: [],
                    debuffs: [],
                    itemDebuffs: [],
                    graphData: [],
                    enemyIndex: hero.enemy().index(),
                    heroCompareIndex: hero.heroCompare().index()
                }
                // items
                for (var j = 0; j < hero.inventory.items().length; j++) {
                    d.items.push(ko.toJS(hero.inventory.items()[j]));
                }
                // abilities
                for (var j = 0; j < hero.ability().abilities().length; j++) {
                    d.abilities.push({
                        level: hero.ability().abilities()[j].level(),
                        isActive: hero.ability().abilities()[j].isActive()
                    });
                }
                // buffs
                for (var j = 0; j < hero.buffs.buffs().length; j++) {
                    d.buffs.push({
                        name: hero.buffs.buffs()[j].name,
                        level: hero.buffs.buffs()[j].data.level(),
                        isActive: hero.buffs.buffs()[j].data.isActive()
                    });
                }
                
                // debuffs
                for (var j = 0; j < hero.debuffs.buffs().length; j++) {
                    d.debuffs.push({
                        name: hero.debuffs.buffs()[j].name,
                        level: hero.debuffs.buffs()[j].data.level(),
                        isActive: hero.debuffs.buffs()[j].data.isActive()
                    });
                }

                // item buffs
                for (var j = 0; j < hero.buffs.itemBuffs.items().length; j++) {
                    d.itemBuffs.push(ko.toJS(hero.buffs.itemBuffs.items()[j]));
                }
                
                // item debuffs
                for (var j = 0; j < hero.debuffs.itemBuffs.items().length; j++) {
                    d.itemDebuffs.push(ko.toJS(hero.debuffs.itemBuffs.items()[j]));
                }
                
                // graph data
                d.graphData = ko.toJS(hero.buildExplorer.graphData);
                
                data.heroes.push(d);
            }
            return data;
        }
        self.save = function () {
            var data = self.getSaveData();
            var serialized = JSON.stringify(data);
            $.ajax({
                type: "POST",
                url: "save.php",
                data: {'data': serialized},
                dataType: "json",
                success: function (data){
                    self.saveLink([location.protocol, '//', location.host, location.pathname].join('') + '?id=' + data.file);
                },
                failure: function (errMsg) {
                    alert("Save request failed.");
                }
            });
        }
        self.load = function (data) {
            for (var i = 0; i < data.heroes.length; i++) {
                var hero = self.heroes[i];
                hero.selectedHero(my.prototype.findWhere(hero.availableHeroes(), {'heroName': data.heroes[i].hero}));
                hero.selectedHeroLevel(data.heroes[i].level);
                hero.inventory.items.removeAll();
                hero.inventory.activeItems.removeAll();
                
                // load hero compare
                if (data.heroes[i].hasOwnProperty('heroCompareIndex')) {
                    var o = hero.availableCompare().filter(function (option) {
                        return option.hero.index() == data.heroes[i].heroCompareIndex;
                    });
                    if (o.length) {
                        hero.selectedCompare(o[0]);
                        hero.heroCompare(o[0].hero);
                    }
                }
                
                // load enemy
                if (data.heroes[i].hasOwnProperty('enemyIndex')) {
                    var o = hero.availableEnemies().filter(function (option) {
                        return option.hero.index() == data.heroes[i].enemyIndex;
                    });
                    if (o.length) {
                        hero.selectedEnemy(o[0]);
                        hero.enemy(o[0].hero);
                    }
                }
                
                // load items
                for (var j = 0; j < data.heroes[i].items.length; j++) {
                    var item = data.heroes[i].items[j];
                    var new_item = {
                        item: item.item,
                        state: ko.observable(item.state),
                        size: item.size,
                        enabled: ko.observable(item.enabled)
                    }
                    hero.inventory.items.push(new_item);
                }

                // load abilities
                for (var j = 0; j < data.heroes[i].abilities.length; j++) {
                    hero.ability().abilities()[j].level(data.heroes[i].abilities[j].level);
                    hero.ability().abilities()[j].isActive(data.heroes[i].abilities[j].isActive);
                }
                hero.skillPointHistory(data.heroes[i].skillPointHistory);

                // load buffs
                for (var j = 0; j < data.heroes[i].buffs.length; j++) {
                    hero.buffs.selectedBuff(my.prototype.findWhere(hero.buffs.availableBuffs(), {buffName: data.heroes[i].buffs[j].name}));
                    hero.buffs.addBuff(hero, {});
                    var b = my.prototype.findWhere(hero.buffs.buffs(), { name: data.heroes[i].buffs[j].name });
                    b.data.level(data.heroes[i].buffs[j].level);
                    b.data.isActive(data.heroes[i].buffs[j].isActive);
                }

                // load debuffs
                for (var j = 0; j < data.heroes[i].debuffs.length; j++) {
                    hero.debuffs.selectedBuff(my.prototype.findWhere(hero.debuffs.availableDebuffs(), {buffName: data.heroes[i].debuffs[j].name}));
                    hero.debuffs.addBuff(hero, {});
                    var b = my.prototype.findWhere(hero.debuffs.buffs(), { name: data.heroes[i].debuffs[j].name });
                    b.data.level(data.heroes[i].debuffs[j].level);
                    b.data.isActive(data.heroes[i].debuffs[j].isActive);
                }

                // load item buffs
                if (data.heroes[i].itemBuffs) {
                    for (var j = 0; j < data.heroes[i].itemBuffs.length; j++) {
                        var item = data.heroes[i].itemBuffs[j];
                        var new_item = {
                            item: item.item,
                            state: ko.observable(item.state),
                            size: item.size,
                            enabled: ko.observable(item.enabled)
                        }
                        hero.buffs.itemBuffs.items.push(new_item);
                    }
                }

                // load item debuffs
                if (data.heroes[i].itemDebuffs) {
                    for (var j = 0; j < data.heroes[i].itemDebuffs.length; j++) {
                        var item = data.heroes[i].itemDebuffs[j];
                        var new_item = {
                            item: item.item,
                            state: ko.observable(item.state),
                            size: item.size,
                            enabled: ko.observable(item.enabled)
                        }
                        hero.debuffs.itemBuffs.items.push(new_item);
                    }
                }
                
                // load graph data
                if (data.heroes[i].graphData) {
                    hero.buildExplorer.loadGraphData(data.heroes[i].graphData);
                }
            }
        }
        
        self.sendReport = function () {
            if ($('#BugReportFormText').val()) {
                $.post( "report.php", { name: $('#BugReportFormName').val(), email: $('#BugReportFormEmail').val(), body: $('#BugReportFormText').val() })
                .done(function (data) {
                    if (data == 'Success') {
                        alert('Report successfully sent. Thanks!');
                        $('#BugReportFormText').val('');
                    }
                    else {
                        alert('Failed to send report. Try again later or email admin@devilesk.com');
                    }
                });
                $('#myModal').modal('hide');
            }
            else {
                alert('Message is required.');
            }
        }
        
        self.getProperty = function (obj, properties) {
            var result = obj;
            for (var i = 0; i < properties.length; i++) {
                result = result[properties[i]];
            }
            return result;
        };
        
        self.getDiffTextWrapper = function (hero, property) {
            return self.getDiffText(self.getDiffMagnitude(hero, property));
        }
        
        self.getDiffMagnitude = function (hero, property) {
            var properties = property.split('.');
            return self.getProperty(hero.damageTotalInfo(), properties).toFixed(2) - self.getProperty(hero.heroCompare().damageTotalInfo(), properties).toFixed(2);
        }
        
        self.getDiffText = function (value) {
            if (value > 0) {
                return '+' + parseFloat(value.toFixed(2));
            }
            else if (value < 0) {
                return '&minus;' + parseFloat(value.toFixed(2)*-1).toString();
            }
            else {
                return '';
            }
        }
        self.highlightedTabInternal = ko.observable('');
        self.highlightedTab = ko.computed(function () {
            return self.highlightedTabInternal();
        }).extend({ throttle: 100 });
        self.highlightTab = function (data) {
            self.highlightedTabInternal(data);
        }
        self.unhighlightTab = function (data) {
            self.highlightedTabInternal('');
        }
    }

    my.prototype.theme = ko.observable('dark'); //ko.observable($('#theme-select').val());
    my.prototype.heroCalculator = {};
    
    my.prototype.run = function () {
        my.prototype.heroCalculator = new my.prototype.HeroCalculatorViewModel();
        ko.applyBindings(my.prototype.heroCalculator);
        /*$('#theme-select').change(function () {
            my.prototype.theme($(this).val());
        });*/
        $('#spinner').hide();
        $('.initial-hidden').css('display', 'inline-block');
        $('#popHero0').addClass('active');
        $('#heroPane0').addClass('active');
        $('[data-toggle="tooltip"]').tooltip();
        var saveId = my.prototype.getParameterByName('id');
        if (saveId) {
            $.get('save/' + saveId + '.json', function (data) {
                my.prototype.heroCalculator.load(data);
            });
        }
    }
    
    my.prototype.inventoryClipBoard = {
        items: [],
        activeItems: []
    };

    my.prototype.getParameterByName = function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    
    exports.HEROCALCULATOR = my;
});