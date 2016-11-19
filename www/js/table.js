require('./app/jquery-ui.custom');
var ko = require('./app/herocalc_knockout');
require("./app/herocalc_tooltips");
var getItemTooltipData = require("./herocalc/herocalc_tooltips_item");

ko.components.register('shop', require('./components/shop'));

ko.bindingHandlers.toggle = {
    init: function (element, valueAccessor) {
        var value = valueAccessor();
        ko.applyBindingsToNode(element, {
            click: function () {
                value(!value());
            }
        });
    }
};

ko.bindingHandlers['class'] = {
    'update': function(element, valueAccessor) {
        if (element['__ko__previousClassValue__']) {
            $(element).removeClass(element['__ko__previousClassValue__']);
        }
        var value = ko.utils.unwrapObservable(valueAccessor());
        $(element).addClass(value);
        element['__ko__previousClassValue__'] = value;
    }
};

hc = new HeroCalc();
hc.init("/media/js/herodata.json","/media/js/itemdata.json","/media/js/unitdata.json", function () {
    console.log('HeroCalc', HeroCalc.prototype);
    
    function ViewModel() {
        var self = this;
        self.loaded = ko.observable(false);
        
        self.filterVisible = ko.observable(false);
        self.toggleFilterVisibility = function() {
            self.filterVisible(!self.filterVisible());
        }
        self.columnsVisible = ko.observable(false);
        self.toggleColumnVisibility = function() {
            self.columnsVisible(!self.columnsVisible());
        }
        self.filterTemplateToUse = function(item) {
            return item.filterType + '-filter';
        }
        
        self.sortLabelClick = function(index, data, event) {
            self.sortColumns.remove(data);
        };
        self.labelHTML = function(index, data) {
            if (self.sortDirections()[self.sortColumns()[index()]]() == -1) {
                return "<a href=\"#\">" + data.header + "</a>"
            } else if (self.sortDirections()[self.sortColumns()[index()]]() == 1) {
                return "<a href=\"#\">" + data.header + "</a>"
            } else {
                return ""
            }
        }
        self.clearLabels = function() {
            self.sortColumns.removeAll();
        }
        self.clearFilters = function() {
            for (var i = 0; i < self.headers().length; i++) {
                if (self.headers()[i].filterValue != undefined) {
                    self.headers()[i].filterValue(null);
                }
            }
        }
        
        self.getCellClass = function (header, hero) {
            var s = 'text-' + header.align + ' td-' + header.id;
            if (header.id == 'displayname' && hero.heroData().displayname.length >= 12) {
                s += ' long-header';
            }
            return s;
        }
        
        self.getData = function (hero, i) {
            var header = self.headers()[i];
            var prop = self.headers()[i].id;
            var val;
            switch (prop) {
                case 'icon':
                    val = '<div class="heroes-sprite-' + hero.heroId() + ' heroes-sprite-32x18"></div>';
                break;
                case 'displayname':
                    val = hero.heroData()[prop];
                break;
                case 'attributeprimary':
                    val = hero.heroData()[prop].replace('DOTA_ATTRIBUTE_', '').slice(0, 3);
                break;
                case 'attacktype':
                    val = hero.heroData()[prop].replace('DOTA_UNIT_CAP_', '').replace('_ATTACK', '');
                break;
                case 'attributeagilitygain':
                case 'attributeintelligencegain':
                case 'attributestrengthgain':
                case 'attackpoint':
                case 'projectilespeed':
                    val = hero.heroData()[prop];
                break;
                case 'attackdamage':
                    val = hero.damageTotalInfo().totalRow[0]().toFixed(2);
                break;
                case 'dps':
                    val = hero.damageTotalInfo().totalRow[2]().toFixed(2);
                break;
                default:
                    val = hero[prop]();
                break;
            }
            if (header.filterType == 'numeric') return parseFloat(val);
            return val;
        }
        
        self.headers = ko.observableArray(require('./table.headers'));
        for (var i = 0; i < self.headers().length; i++) {
            self.headers()[i].defaultDisplay = ko.observable(self.headers()[i].display());
            (function (i) {
                self.headers()[i].display.subscribe(function(newValue) {
                    var j = i + 1;
                    var $td = $('td:nth-child(' + j + ')');
                    if (newValue) {
                        $td.show();
                    }
                    else {
                        $td.hide();
                    }
                });
            })(i);
        }
        self.headerHTML = function(index, data) {
            return data.header;
            if (self.sortDirections()[index()]() == -1) {
                return "<a href=\"#\">" + data.header + " <div class=\"glyphicon glyphicon-chevron-down\"></div></a>"
            } else if (self.sortDirections()[index()]() == 1) {
                return "<a href=\"#\">" + data.header + " <div class=\"glyphicon glyphicon-chevron-up\"></div></a>"
            } else {
                return ""
            }
        }
            
        this.selectedHeroLevel = ko.observable(1);
        this.selectedHeroLevel.subscribe(function (newValue) {
            self.heroes().forEach(function (hero) {
               hero.selectedHeroLevel(parseInt(newValue));
            });
            self.sortTable();
        });
        this.heroes = ko.observableArray([]);
        for (var h in HeroCalc.prototype.heroData) {
            var hero = new HeroCalc.prototype.HeroModel(h.replace('npc_dota_hero_', ''));
            hero.rowVisible = ko.observable(true);
            this.heroes.push(hero);
        }

        self.shiftKey = ko.observable(false);
        self.multiSortValue = ko.observable(false);
        self.multiSort = ko.pureComputed({
            read: function () {
                return this.multiSortValue() || this.shiftKey();
            },
            write: function (value) {
                this.multiSortValue(value);
            },
            owner: this
        });
        self.sortDirections = ko.observableArray([]);
        self.initSortDirections = function() {
            for (var i = 0; i < self.headers().length; i++) {
                self.sortDirections.push(new ko.observable(1));
            }
        }
        self.initSortDirections();
        self.sortColumn = ko.observable(1);
        self.columnClick = function(index, data, event) {
            self.sortDirections()[index()](-1 * self.sortDirections()[index()]());
            if (self.sortColumns.indexOf(index()) < 0) {
                if (event.shiftKey || self.multiSort()) {
                    self.sortColumns.push(index());
                } else {
                    self.sortColumns.removeAll();
                    self.sortColumns.push(index());
                }
            }
            self.sortColumn(index());
            
            self.sortTable();
        };
        self.sortColumns = ko.observableArray([]);
        self.sortColumns.push(1);
        
        self.hideAllColumns = function() {
            for (var i = 0; i < self.headers().length; i++) {
                self.headers()[i].display(false);
            }
        }
        self.resetColumns = function() {
            for (var i = 0; i < self.headers().length; i++) {
                self.headers()[i].display(self.headers()[i].defaultDisplay());
            }
        }
        
        self.toggleColumn = function(index, data, event) {
            self.headers()[index()].display(!self.headers()[index()].display())
        };
        
        self.sortTable = function () {
            self.heroes.sort(function(a, b) {
                var i = 0;
                while (i < self.sortColumns().length) {
                    var headerIndex = self.sortColumns()[i];
                    var prop = self.headers()[headerIndex].id;
                    var aval = self.getData(a, headerIndex);
                    var bval = self.getData(b, headerIndex);
                    //console.log(self.sortColumns().length, i, prop, aval, bval, aval > bval, aval < bval);
                    if (self.sortColumns()[i] > 2) {
                        if (aval > bval) return 1 * self.sortDirections()[self.sortColumns()[i]]();
                        if (aval < bval) return -1 * self.sortDirections()[self.sortColumns()[i]]();
                    } else {
                        if (aval > bval) return 1 * self.sortDirections()[self.sortColumns()[i]]();
                        if (aval < bval) return -1 * self.sortDirections()[self.sortColumns()[i]]();
                    }
                    i += 1;
                }
                return 0;
            });
        }
        
        self.doFilter = ko.computed(function () {
            self.heroes().forEach(function(hero) {
                var values = self.headers().map(function (header, i) {
                    return self.getData(hero, i);
                });
                hero.rowVisible(
                    values.every(function(item, i) {
                        if (!self.headers()[i].filter) return true;
                        if (!self.headers()[i].filterValue()) return true;
                        switch (self.headers()[i].filterType) {
                            case 'numeric':
                                switch (self.headers()[i].filterComparison()) {
                                    case 'gt':
                                        return item > parseFloat(self.headers()[i].filterValue());
                                        break;
                                    case 'lt':
                                        return item < parseFloat(self.headers()[i].filterValue());
                                        break;
                                    case 'ge':
                                        return item >= parseFloat(self.headers()[i].filterValue());
                                        break;
                                    case 'le':
                                        return item <= parseFloat(self.headers()[i].filterValue());
                                        break;
                                    case 'eq':
                                        return item == parseFloat(self.headers()[i].filterValue());
                                        break;
                                }
                                break;
                            case 'string':
                                return item.toLowerCase().indexOf(self.headers()[i].filterValue().toLowerCase()) != -1;
                                break;
                            case 'select':
                                return item == self.headers()[i].filterValue();
                                break;
                        }
                        return self.headers()[i].filter;
                    })
                );
            });
        }).extend({ deferred: true });;
        
        self.rowCount = ko.computed(function () {
            return self.heroes().filter(function (hero) {
                return hero.rowVisible();
            }).length;           
        });
        
        self.bonusAttributeLevel = ko.computed(function () {
            var hero = self.heroes()[0];
            var attributeBonus = hero.ability().getAbility('attribute_bonus');
            return attributeBonus.level() + '/' + Math.min(Math.floor((self.selectedHeroLevel()-1)/2 + 1), 10);
        });
        
        self.levelUpAttributeBonus = function () {
            self.heroes().forEach(function (hero) {
                var attributeBonus = hero.ability().getAbility('attribute_bonus');
                if (attributeBonus) {
                    var attributeBonusIndex = hero.ability().abilities.indexOf(attributeBonus);
                    hero.ability().levelUpAbility(ko.observable(attributeBonusIndex), attributeBonus, null, hero);
                }
            });
        }
        
        self.levelDownAttributeBonus = function () {
            self.heroes().forEach(function (hero) {
                var attributeBonus = hero.ability().getAbility('attribute_bonus');
                if (attributeBonus) {
                    var attributeBonusIndex = hero.ability().abilities.indexOf(attributeBonus);
                    hero.ability().levelDownAbility(ko.observable(attributeBonusIndex), attributeBonus, null, hero);
                }
            });
        }
        
        this.inventory = new HeroCalc.prototype.BasicInventoryViewModel();
        this.inventory.removeItem = (function (fn) {
            return function (item) {
                fn(item);
                self.heroes().forEach(function (hero) {
                    hero.inventory.removeItem(item);
                });
            }
        })(this.inventory.removeItem);
        this.inventory.toggleItem = (function (fn) {
            return function (index, data, event) {
                fn(index, data, event);
                self.heroes().forEach(function (hero) {
                    if (HeroCalc.prototype.itemsWithActive.indexOf(data.item) >= 0) {
                        if (hero.inventory.activeItems.indexOf(data) < 0) {
                            hero.inventory.activeItems.push(data);
                        }
                        else {
                            hero.inventory.activeItems.remove(data);
                        }
                    }
                });
            }
        })(this.inventory.removeItem);
        
        
        self.exportCSV = function() {
            var d = [];
            d.push(
                self.headers().filter(function (header) {
                    return header.display();
                }).map(function (header) {
                    return header.title;
                })
            );
            self.heroes().forEach(function (hero) {
                d.push(
                    self.headers().filter(function (header) {
                        return header.display();
                    }).map(function (header, i) {
                        return self.getData(hero, i);
                    })
                );
            });
            console.log(d);
            
            var csvContent = "data:text/csv;charset=utf-8,";
            d.forEach(function(infoArray, index){
               dataString = infoArray.join(",");
               csvContent += index < d.length ? dataString+ "\n" : dataString;
            }); 
            var encodedUri = encodeURI(csvContent);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "hero_stats.csv");
            document.body.appendChild(link); // Required for FF

            link.click();
            document.body.removeChild(link); // Required for FF
        }
        

        
        self.addItem = function (data, event) {
            self.inventory.addItem(data, event);
            var item = self.inventory.items()[self.inventory.items().length-1];
            self.heroes().forEach(function (hero) {
                hero.inventory.items.push(item);
            });
        }
        self.itemOptions = ko.computed(function () {
            return self.heroes()[0].inventory.itemOptions();
        });
    
        self.displayShop = ko.observable(false);
        self.displayShopItemTooltip = ko.observable(true);
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
                self.shopPopout(false);
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
        
        self.selectedItem = ko.observable();
        
        self.changeSelectedItem = function (data, event) {
            self.itemInputValue(1);
            self.selectedItem(event.target.id);
        }
        
        self.getItemTooltipData = ko.computed(function () {
            return getItemTooltipData(HeroCalc.prototype.itemData, self.selectedItem());
        }, this);
        self.getItemInputLabel = ko.computed(function () {
            if (HeroCalc.prototype.stackableItems.indexOf(self.selectedItem()) != -1) {
                return 'Stack Size'
            }
            else if (HeroCalc.prototype.levelitems.indexOf(self.selectedItem()) != -1) {
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
    }
    
    var vm = new ViewModel();
    
    document.body.addEventListener('keydown', function(event) {
        vm.shiftKey(!!event.shiftKey);
    }, true);

    document.body.addEventListener('keyup', function(event) {
        vm.shiftKey(!!event.shiftKey);
    }, true);
    
    console.log('vm', vm);
    ko.applyBindings(vm);
    
    $('#multiSort-tooltip').tooltip({container : 'body'});
    $('.header-tooltip').tooltip({container : 'body'});
    $('.header-row > th').tooltip({container : 'body'});
    console.log('done');
    vm.loaded(true);
    $('#spinner').hide();
})