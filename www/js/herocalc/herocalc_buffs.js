'use strict';
var ko = require('./herocalc_knockout');
    
var my = require("./herocalc_core");

my.prototype.BuffOption = function (hero, ability) {
    this.buffName = ability;
    if (my.prototype.heroData['npc_dota_hero_' + hero] == undefined) {
        this.hero = hero;
        this.abilityData = my.prototype.findWhere(my.prototype.unitData[hero].abilities, {name: ability})
        this.buffDisplayName = my.prototype.unitData[hero].displayname + ' - ' + this.abilityData.displayname;
    }
    else {
        this.hero = 'npc_dota_hero_' + hero;
        this.abilityData = my.prototype.findWhere(my.prototype.heroData['npc_dota_hero_' + hero].abilities, {name: ability})
        this.buffDisplayName = my.prototype.heroData['npc_dota_hero_' + hero].displayname + ' - ' + this.abilityData.displayname;        
        if (ability == 'sven_gods_strength') {
            this.buffDisplayName += ' (Aura for allies)';
        }
    }

};

my.prototype.ItemBuffOption = function (item) {
    this.buffName = item;
    if (my.prototype.heroData['npc_dota_hero_' + hero] == undefined) {
        this.hero = hero;
        this.abilityData = my.prototype.findWhere(my.prototype.unitData[hero].abilities, {name: item})
        this.buffDisplayName = my.prototype.unitData[hero].displayname + ' - ' + this.abilityData.displayname;        
    }
    else {
        this.hero = 'npc_dota_hero_' + hero;
        this.abilityData = my.prototype.findWhere(my.prototype.heroData['npc_dota_hero_' + hero].abilities, {name: item})
        this.buffDisplayName = my.prototype.heroData['npc_dota_hero_' + hero].displayname + ' - ' + this.abilityData.displayname;        
    }

};

my.prototype.BuffViewModel = function (a) {
    var self = new my.prototype.AbilityModel(ko.observableArray([]));
    self.availableBuffs = ko.observableArray(my.prototype.availableBuffs);
    self.availableDebuffs = ko.observableArray(my.prototype.availableDebuffs);
    self.selectedBuff = ko.observable(self.availableBuffs()[0]);
    
    self.buffs = ko.observableArray([]);
    self.itemBuffs = new my.prototype.InventoryViewModel();
    
    self.addBuff = function (data, event) {
        if (my.prototype.findWhere(self.buffs(), { name: self.selectedBuff().buffName })  == undefined) {
            var a = ko.wrap.fromJS(self.selectedBuff().abilityData);
            a.isActive = ko.observable(false);
            a.isDetail = ko.observable(false);
            a.baseDamage = ko.observable(0);
            a.bash = ko.observable(0);
            a.bashBonusDamage = ko.observable(0);
            a.bonusDamage = ko.observable(0);
            a.bonusDamageOrb = ko.observable(0);
            a.bonusDamagePct = ko.observable(0);
            a.bonusDamagePrecisionAura = ko.observable(0);
            a.bonusDamageReduction = ko.observable(0);
            a.bonusHealth = ko.observable(0);
            a.bonusStrength = ko.observable(0);
            a.bonusStrength2 = ko.observable(0);
            a.bonusAgility = ko.observable(0);
            a.bonusAgility2 = ko.observable(0);
            a.bonusInt = ko.observable(0);
            a.bonusAllStatsReduction = ko.observable(0);
            a.damageAmplification = ko.observable(0);
            a.damageReduction = ko.observable(0);
            a.evasion = ko.observable(0);
            a.magicResist = ko.observable(0);
            a.manaregen = ko.observable(0);
            a.manaregenreduction = ko.observable(0);
            a.missChance = ko.observable(0);
            a.movementSpeedFlat = ko.observable(0);
            a.movementSpeedPct = ko.observable(0);
            a.movementSpeedPctReduction = ko.observable(0);
            a.turnRateReduction = ko.observable(0);
            a.attackrange = ko.observable(0);
            a.attackspeed = ko.observable(0);
            a.attackspeedreduction = ko.observable(0);
            a.armor = ko.observable(0);
            a.armorReduction = ko.observable(0);
            a.healthregen = ko.observable(0);
            a.lifesteal = ko.observable(0);
            a.visionnight = ko.observable(0);
            a.visionday = ko.observable(0);
            switch (a.name) {
                case 'invoker_cold_snap':
                case 'invoker_ghost_walk':
                case 'invoker_tornado':
                case 'invoker_emp':
                case 'invoker_alacrity':
                case 'invoker_chaos_meteor':
                case 'invoker_sun_strike':
                case 'invoker_forge_spirit':
                case 'invoker_ice_wall':
                case 'invoker_deafening_blast':
                    a.level(1);
                break;
            }
            self.abilities.push(a);
            self.buffs.push({ name: self.selectedBuff().buffName, hero: self.selectedBuff().hero, data: a });
        }
    };
    
    self.removeBuff = function (data, event, abilityName) {
        if (my.prototype.findWhere(self.buffs(), { name: abilityName })  != undefined) {
                self.buffs.remove(my.prototype.findWhere(self.buffs(), { name: abilityName }));
                if (self.abilityControlData[abilityName] != undefined) {
                    for (var i = 0; i < self.abilityControlData[abilityName].data.length; i++) {
                        if (self.abilityControlData[abilityName].data[i].controlVal.dispose != undefined) {
                            self.abilityControlData[abilityName].data[i].controlVal.dispose();
                        }
                        if (self.abilityControlData[abilityName].data[i].clean != undefined) {
                            self.abilityControlData[abilityName].data[i].clean.dispose();
                        }
                    }
                    self.abilityControlData[abilityName] = undefined;
                }
                for (var i = 0; i < self.abilities.length; i++) {
                    if (self.abilities[i].name == abilityName) {
                        self.abilities[i].level(0);
                        self.abilities.remove(self.abilities[i]);
                        break;
                    }
                }
        }
    };
    self.toggleBuff = function (index, data, event) {
        if (self.buffs()[index()].data.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') < 0) {
            if (self.buffs()[index()].data.isActive()) {
                self.buffs()[index()].data.isActive(false);
                self.abilities[index()].isActive(false);
            }
            else {
                self.buffs()[index()].data.isActive(true);
                self.abilities[index()].isActive(true);
            }
        }
    }.bind(this);

    self.toggleBuffDetail = function (index, data, event) {
        if (self.buffs()[index()].data.isDetail()) {
            self.buffs()[index()].data.isDetail(false);
        }
        else {
            self.buffs()[index()].data.isDetail(true);
        }
    }.bind(this);

    // Overrides the ability module function to remove available skill point check
    self.levelUpAbility = function (index, data, event, hero) {
        if (self.abilities[index()].level() < hero.getAbilityLevelMax(data)) {
            switch(self.abilities[index()].abilitytype) {
                case 'DOTA_ABILITY_TYPE_ULTIMATE':
                    self.abilities[index()].level(self.abilities[index()].level() + 1);
                break;
                default:
                    self.abilities[index()].level(self.abilities[index()].level() + 1);
                break;
            }
            switch (self.abilities[index()].name) {
                case 'beastmaster_call_of_the_wild':
                case 'chen_test_of_faith':
                case 'morphling_morph_agi':
                case 'shadow_demon_shadow_poison':
                    self.abilities[index() + 1].level(self.abilities[index()].level());
                break;
                case 'morphling_morph_str':
                    self.abilities[index() - 1].level(self.abilities[index()].level());
                break;
                case 'keeper_of_the_light_spirit_form':
                    self.abilities[index() - 1].level(self.abilities[index()].level());
                    self.abilities[index() - 2].level(self.abilities[index()].level());
                case 'nevermore_shadowraze1':
                    self.abilities[index() + 1].level(self.abilities[index()].level());
                    self.abilities[index() + 2].level(self.abilities[index()].level());
                break;
                case 'nevermore_shadowraze2':
                    self.abilities[index() - 1].level(self.abilities[index()].level());
                    self.abilities[index() + 1].level(self.abilities[index()].level());
                break;
                case 'nevermore_shadowraze3':
                    self.abilities[index() - 1].level(self.abilities[index()].level());
                    self.abilities[index() - 2].level(self.abilities[index()].level());
                break;
            }
        }
    };
    self.levelDownAbility = function (index, data, event, hero) {
        if (self.abilities[index()].level() > 0) {
            self.abilities[index()].level(self.abilities[index()].level() - 1);
            switch (self.abilities[index()].name) {
                case 'beastmaster_call_of_the_wild':
                case 'chen_test_of_faith':
                case 'morphling_morph_agi':
                case 'shadow_demon_shadow_poison':
                    self.abilities[index() + 1].level(self.abilities[index()].level());
                break;
                case 'morphling_morph_str':
                    self.abilities[index() - 1].level(self.abilities[index()].level());
                break;
                case 'keeper_of_the_light_spirit_form':
                    self.abilities[index() - 1].level(self.abilities[index()].level());
                    self.abilities[index() - 2].level(self.abilities[index()].level());
                case 'nevermore_shadowraze1':
                    self.abilities[index() + 1].level(self.abilities[index()].level());
                    self.abilities[index() + 2].level(self.abilities[index()].level());
                break;
                case 'nevermore_shadowraze2':
                    self.abilities[index() - 1].level(self.abilities[index()].level());
                    self.abilities[index() + 1].level(self.abilities[index()].level());
                break;
                case 'nevermore_shadowraze3':
                    self.abilities[index() - 1].level(self.abilities[index()].level());
                    self.abilities[index() - 2].level(self.abilities[index()].level());
                break;
                case 'ember_spirit_fire_remnant':
                    self.abilities[index() - 1].level(self.abilities[index()].level());
                break;
                case 'lone_druid_true_form':
                    self.abilities[index() - 1].level(self.abilities[index()].level());
                break;
            }
        }
    };
    
    return self;
}