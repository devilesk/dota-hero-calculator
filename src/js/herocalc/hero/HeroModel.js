'use strict';
var ko = require('../herocalc_knockout');

var constants = require("../constants");
var StatModel = require("../StatModel");
var AbilityModel = require("../AbilityModel");
var BuffViewModel = require("../BuffViewModel");
var InventoryViewModel = require("../inventory/InventoryViewModel");
var diffProperties = require("./diffProperties");
var HeroDamageMixin = require("./HeroDamageMixin");
var TalentController = require("./TalentController");
var totalExp = require("./totalExp");
var nextLevelExp = require("./nextLevelExp");
var illusionData = require("../illusion/illusionData");
var findWhere = require("../util/findWhere");
var extend = require("../util/extend");

var HeroModel = function (heroData, itemData, h) {
    var self = this;
    self.heroId = ko.observable(h);
    self.illusionId = ko.observable('');
    self.isIllusion = ko.observable(false);
    self.selectedHeroLevel = ko.observable(1);
    self.inventory = new InventoryViewModel(itemData, self);
    self.selectedInventory = ko.observable(-1);
    self.buffs = new BuffViewModel(itemData);
    self.buffs.hasScepter = self.inventory.hasScepter;
    self.debuffs = new BuffViewModel(itemData);
    self.heroData = ko.pureComputed(function () {
      return heroData['npc_dota_hero_' + self.heroId()];
    });
    self.heroCompare = ko.observable(self);
    self.enemy = ko.observable(self);
    self.unit = ko.observable(self);
    self.clone = ko.observable(self);
    
    self.talents = [
        ko.observable(-1),
        ko.observable(-1),
        ko.observable(-1),
        ko.observable(-1)
    ];
    
    self.selectedTalents = ko.pureComputed(function () {
        var arr = [];
        for (var i = 0; i < 4; i++) {
            if (self.talents[i]() !== -1) {
                arr.push(self.heroData().talents[i][self.talents[i]()]);
            }
        }
        return arr;
    });
    
    self.skillPointHistory = ko.observableArray();
    
    self.ability = ko.computed(function () {
        var a = new AbilityModel(ko.observableArray(JSON.parse(JSON.stringify(self.heroData().abilities))), self);
        switch (self.heroId()) {
            case 'earth_spirit':
            case 'ogre_magi':
                a._abilities[3].level(1);
            break;
            case 'monkey_king':
                a._abilities[5].level(1);
            break;
            case 'invoker':
                for (var i = 5; i < 16; i++) {
                    a._abilities[i].level(1);
                }
            break;
        }
        self.skillPointHistory.removeAll();
        a.hasScepter = self.inventory.hasScepter
        return a;
    });

    self.availableSkillPoints = ko.computed(function () {
        var c = self.selectedHeroLevel();
        for (var i = 0; i < 4; i++) {
            if (self.selectedHeroLevel() < i * 5 + 10) self.talents[i](-1);
        }
        c -= self.talents.filter(function (talent) { return talent() !== -1 }).length;
        for (var i = 0; i < self.ability().abilities().length; i++) {
            switch(self.ability().abilities()[i].abilitytype) {
                case 'DOTA_ABILITY_TYPE_ULTIMATE':
                    if (self.heroId() === 'invoker') {
                        /*while (
                            ((self.ability().abilities()[i].level() == 1) && (parseInt(self.selectedHeroLevel()) < 2)) ||
                            ((self.ability().abilities()[i].level() == 2) && (parseInt(self.selectedHeroLevel()) < 7)) ||
                            ((self.ability().abilities()[i].level() == 3) && (parseInt(self.selectedHeroLevel()) < 11)) ||
                            ((self.ability().abilities()[i].level() == 4) && (parseInt(self.selectedHeroLevel()) < 17))
                        ) {
                            self.ability().levelDownAbility(i, null, null, self);
                        }*/
                    }
                    else if (self.heroId() === 'meepo') {
                        while ((self.ability().abilities()[i].level()-1) * 7 + 3 > parseInt(self.selectedHeroLevel())) {
                            self.ability().levelDownAbility(i, null, null, self);
                        }
                    }
                    else {
                        while (self.ability().abilities()[i].level() * 5 + 1 > parseInt(self.selectedHeroLevel())) {
                            self.ability().levelDownAbility(i, null, null, self);
                        }
                    }
                break;
                default:
                    while (self.ability().abilities()[i].level() * 2 - 1 > parseInt(self.selectedHeroLevel())) {
                        self.ability().levelDownAbility(i, null, null, self);
                    }
                break;
            }
        }
        while (self.skillPointHistory().length > c) {
            self.ability().levelDownAbility(self.skillPointHistory()[self.skillPointHistory().length-1], null, null, self);
        }
        return c-self.skillPointHistory().length;
    }, this);
    
    self.getAbilityAttributeValue = function(hero, ability, attributeName, level) {
        if (!attributeName) return 0;
        ability = ability.indexOf('phantom_lancer_doppelwalk') == -1 ? ability : 'phantom_lancer_doppelwalk';
        if (ability == 'item_manta') {
            var abilityObj = itemData[ability];
        }
        else {
            var abilityObj = findWhere(heroData['npc_dota_hero_' + hero].abilities, {name: ability});
        }
        var attribute = findWhere(abilityObj.attributes, {name: attributeName});
        if (level == 0) {
            return parseFloat(attribute.value[0]);
        }
        else if (level > attribute.value.length) {
            return parseFloat(attribute.value[0]);
        }
        else {
            return parseFloat(attribute.value[level - 1]);
        }
    }
    
    self.illusionAbilityLevel = ko.observable(0);
    
    self.getIncomingDamageMultiplier = function(illusionType, hasScepter, attackType) {
        console.log('illusionType', illusionType);
        if (!illusionType) return 1;
        var sign = illusionData[illusionType].incoming_damage_sign || 1;
        if (illusionType == 'item_manta') {
            if (attackType == 'DOTA_UNIT_CAP_MELEE_ATTACK') {
                return (1 + sign * self.getAbilityAttributeValue(illusionData[illusionType].hero, illusionType, illusionData[illusionType].incoming_damage_melee, self.illusionAbilityLevel())/100)
            }
            else {
                return (1 + sign * self.getAbilityAttributeValue(illusionData[illusionType].hero, illusionType, illusionData[illusionType].incoming_damage_ranged, self.illusionAbilityLevel())/100)
            }
        }
        else {
            return (1 + sign * self.getAbilityAttributeValue(illusionData[illusionType].hero, illusionType, illusionData[illusionType].incoming_damage, self.illusionAbilityLevel())/100)
        }
    }
    self.getOutgoingDamageMultiplier = function(illusionType, hasScepter, attackType) {
        console.log('illusionType', illusionType);
        if (!illusionType) return 1;
        var sign = illusionData[illusionType].outgoing_damage_sign || 1;
        if (illusionType == 'item_manta') {
            if (attackType == 'DOTA_UNIT_CAP_MELEE_ATTACK') {
                return (1 + sign * self.getAbilityAttributeValue(illusionData[illusionType].hero, illusionType, illusionData[illusionType].outgoing_damage_melee, self.illusionAbilityLevel())/100);
            }
            else {
                return (1 + sign * self.getAbilityAttributeValue(illusionData[illusionType].hero, illusionType, illusionData[illusionType].outgoing_damage_ranged, self.illusionAbilityLevel())/100);
            }
        }
        else {
            return (1 + sign * self.getAbilityAttributeValue(illusionData[illusionType].hero, illusionType, illusionData[illusionType].outgoing_damage, self.illusionAbilityLevel())/100);
        }
    }
    
    self.primaryAttribute = ko.pureComputed(function () {
        var v = self.heroData().attributeprimary;
        if (v === 'DOTA_ATTRIBUTE_AGILITY') return 'agi';
        if (v === 'DOTA_ATTRIBUTE_INTELLECT') return 'int';
        if (v === 'DOTA_ATTRIBUTE_STRENGTH') return 'str';
        return '';
    });
    self.totalExp = ko.pureComputed(function () {
        return totalExp[self.selectedHeroLevel() - 1];
    });
    self.nextLevelExp = ko.pureComputed(function () {
        return nextLevelExp[self.selectedHeroLevel() - 1];
    });
    self.startingArmor = ko.pureComputed(function () {
        return (self.heroData().attributebaseagility * .14 + self.heroData().armorphysical).toFixed(2);
    });
    self.respawnTime = ko.pureComputed(function () {
        var level = self.selectedHeroLevel();
        var reduction = TalentController.getRespawnReduction(self.selectedTalents());
        if (level >= 1 && level <= 5) {
            return (level - 1) * 2 + 8 - reduction;
        }
        else if (level >= 6 && level <= 11) {
            return (level - 6) * 2 + 26 - reduction;
        }
        else if (level >= 12 && level <= 17) {
            return (level - 12) * 2 + 46 - reduction;
        }
        else if (level >= 18 && level <= 24) {
            return (level - 18) * 4 + 66 - reduction;
        }
        else if (level == 25) {
            return 100 - reduction;
        }
    });
    self.totalAttribute = function (a) {
        if (a === 'agi') return self.totalAgi().total;
        if (a === 'int') return self.totalInt().total;
        if (a === 'str') return self.totalStr().total;
        return 0;
    };
    self.totalAgi = ko.pureComputed(function () {
        var s = new StatModel(self.heroData().attributebaseagility, 'Base');
        s.add(self.heroData().attributeagilitygain * (self.selectedHeroLevel() - 1), 'Level')
            .concat(self.inventory.getAttributes('agi'))
            .concat(self.ability().getAgility())
            .concat(TalentController.getAgility(self.selectedTalents()))
            .concat(self.enemy().ability().getAllStatsReduction())
            .concat(self.debuffs.getAllStatsReduction())
        return s;
    });
    self.intStolen = ko.observable(0).extend({ numeric: 0 });
    self.totalInt = ko.pureComputed(function () {
        var s = new StatModel(self.heroData().attributebaseintelligence, 'Base');
        s.add(self.heroData().attributeintelligencegain * (self.selectedHeroLevel() - 1), 'Level')
            .concat(self.inventory.getAttributes('int'))
            .concat(self.ability().getIntelligence())
            .concat(TalentController.getIntelligence(self.selectedTalents()))
            .concat(self.enemy().ability().getAllStatsReduction())
            .concat(self.debuffs.getAllStatsReduction())
            .add(self.intStolen(), 'Int Stolen')
            .add(-self.enemy().intStolen(), 'Int Stolen')
        return s;
    });
    self.totalStr = ko.pureComputed(function () {
        var s = new StatModel(self.heroData().attributebasestrength, 'Base');
        s.add(self.heroData().attributestrengthgain * (self.selectedHeroLevel() - 1), 'Level')
            .concat(self.inventory.getAttributes('str'))
            .concat(self.ability().getStrength())
            .concat(TalentController.getStrength(self.selectedTalents()))
            .concat(self.enemy().ability().getStrengthReduction())
            .concat(self.enemy().ability().getAllStatsReduction())
            .concat(self.debuffs.getAllStatsReduction())
        return s;
    });
    // + % status resistance
    self.perkStr = ko.pureComputed(function () {
        return self.totalStr().total * constants.statusResPerStrength;
    });
    // + % ms
    self.perkAgi = ko.pureComputed(function () {
        return self.totalAgi().total * constants.moveSpeedPerAgi;
    });
    // + % magic resistance
    self.perkInt = ko.pureComputed(function () {
        return self.totalInt().total * constants.magicResPerInt;
    });
    self.health = ko.pureComputed(function () {
        var s = new StatModel(self.heroData().statushealth, 'Base');
        self.totalStr().components.forEach(function (component) {
            s.add(component.value * constants.healthPerStrength, component.label == 'Base' ? 'Base Str' : component.label);
        });
        s.concat(self.inventory.getHealth())
        .concat(self.ability().getHealth())
        .concat(TalentController.getHealth(self.selectedTalents()))
        return s;
    });
    // Health Regeneration = (Base + Sum of Flat Bonuses) * (1 + strength * (5/700))
    self.healthregen = ko.pureComputed(function () {
        var healthRegenAura = [self.inventory.getHealthRegenAura, self.buffs.itemBuffs.getHealthRegenAura].reduce(function (memo, fn) {
            return fn(memo.sources, memo.excludeList);
        }, {sources: new StatModel(), excludeList: []});
        
        var s = new StatModel(self.heroData().statushealthregen, 'Base');
        if (!self.isIllusion()) {
            s.concat(self.inventory.getHealthRegen())
            .concat(self.ability().getHealthRegen())
            .concat(self.buffs.getHealthRegen())
            .concat(TalentController.getHealthRegen(self.selectedTalents()))
            .concat(healthRegenAura.sources)
        }
        s.mult(1 + self.totalStr().total * constants.healthRegenPerStrength, 'Str Regen Amp %');
        console.log('healthregen', s);
        return s;
    });
    self.mana = ko.pureComputed(function () {
        var s = new StatModel(self.heroData().statusmana, 'Base');
        self.totalInt().components.forEach(function (component) {
            s.add(component.value * constants.manaPerInt, component.label == 'Base' ? 'Base Int' : component.label);
        });
        s.concat(self.inventory.getMana())
        .concat(self.ability().getMana())
        .concat(TalentController.getMana(self.selectedTalents()))
        return s;
    });
    // Mana Regeneration = (Base + Sum of Flat Bonuses) * (1 + intelligence * 0.02)
    self.manaregen = ko.pureComputed(function () {
        var s = new StatModel(self.heroData().statusmanaregen, 'Base');
        s.concat(self.inventory.getManaRegen())
        .concat(self.inventory.getManaRegenBloodstone())
        .concat(self.ability().getManaRegen())
        .concat(TalentController.getManaRegen(self.selectedTalents()))
        if (self.heroId() == 'crystal_maiden') {
            s.concat(self.ability().getManaRegenSelfArcaneAura())
        }
        else {
            s.concat(self.buffs.getManaRegenArcaneAura())
        }
        s.concat(self.enemy().ability().getManaRegenReduction())
        s.mult(1 + self.totalInt().total * constants.manaRegenPerInt, 'Mana Regen Amp %');                
        return s;
    });
    self.totalArmorPhysical = ko.pureComputed(function () {
        var armorAura = [self.inventory.getArmorAura, self.buffs.itemBuffs.getArmorAura].reduce(function (memo, fn) {
            return fn(memo);
        }, null);
        
        var armorReduction = [self.enemy().inventory.getArmorReduction, self.debuffs.itemBuffs.getArmorReduction].reduce(function (memo, fn) {
            return fn(memo);
        }, null);
        
        var armorReductionAura = [self.enemy().inventory.getArmorReductionAura, self.debuffs.itemBuffs.getArmorReductionAura].reduce(function (memo, fn) {
            return fn(memo);
        }, null);
        
        var armorBaseReduction = self.enemy().ability().getArmorBaseReduction() * self.debuffs.getArmorBaseReduction();
        
        var s = new StatModel(self.heroData().armorphysical, 'Base');
        self.totalAgi().components.forEach(function (component) {
            s.add(component.value * constants.armorPerAgi, component.label == 'Base' ? 'Base Agi' : component.label);
        });
        if (armorBaseReduction != 1) {
            s.mult(self.enemy().ability().getArmorBaseReduction() * self.debuffs.getArmorBaseReduction(), 'Base Armor Reduction %');
        }
        if (!self.isIllusion()) {
            s.concat(self.inventory.getArmor())
            .concat(self.ability().getArmor())
            .concat(TalentController.getArmor(self.selectedTalents()))
            .concat(self.buffs.getArmor())
            .concat(armorAura)
            .concat(armorReductionAura)
        }
        s.concat(self.enemy().ability().getArmorReduction())
        .concat(self.debuffs.getArmorReduction())
        .concat(armorReduction)
        return s;
    });
    self.totalArmorPhysicalReduction = ko.pureComputed(function () {
        var totalArmor = self.totalArmorPhysical().total;
        return (constants.armorMult * totalArmor) / (1 + constants.armorMult * Math.abs(totalArmor))
    });
    self.spellAmp = ko.pureComputed(function () {
        var s = new StatModel();
        self.totalInt().components.forEach(function (component) {
            s.add(component.value * constants.spellDmgPerInt, component.label == 'Base' ? 'Base Int' : component.label);
        });
        s.concat(self.inventory.getSpellAmp())
        .concat(self.ability().getSpellAmp())
        .concat(TalentController.getSpellAmp(self.selectedTalents()))
        .concat(self.buffs.getSpellAmp())
        return s;
    });
    self.cooldownReductionFlat = ko.pureComputed(function () {
        return self.inventory.getCooldownReductionFlat()
                + self.ability().getCooldownReductionFlat()
                + TalentController.getCooldownReductionFlat(self.selectedTalents())
                + self.buffs.getCooldownReductionFlat()
                - self.enemy().inventory.getCooldownIncreaseFlat()
                - self.enemy().ability().getCooldownIncreaseFlat()
                - self.debuffs.getCooldownIncreaseFlat()
                - self.debuffs.itemBuffs.getCooldownIncreaseFlat();
    });
    self.cooldownReductionProduct = ko.pureComputed(function () {
        return self.inventory.getCooldownReductionPercent().value
                * self.ability().getCooldownReductionPercent()
                * TalentController.getCooldownReductionPercent(self.selectedTalents())
                * self.buffs.getCooldownReductionPercent()
                * self.enemy().inventory.getCooldownIncreasePercent()
                * self.enemy().ability().getCooldownIncreasePercent()
                * self.debuffs.getCooldownIncreasePercent()
                * self.debuffs.itemBuffs.getCooldownIncreasePercent();
    });
    self.cooldownReductionPercent = ko.pureComputed(function () {
        return 1 - self.cooldownReductionProduct();
    });
    self.totalMovementSpeed = ko.pureComputed(function () {
        var MIN_MOVESPEED = 100;
        var ms = (self.ability().setMovementSpeed() > 0 ? self.ability().setMovementSpeed() : self.buffs.setMovementSpeed());
        if (ms > 0) {
            return ms;
        }
        else {
            var movementSpeedFlat = [self.inventory.getMovementSpeedFlat, self.buffs.itemBuffs.getMovementSpeedFlat].reduce(function (memo, fn) {
                var obj = fn(memo.excludeList);
                obj.value += memo.value;
                return obj;
            }, {value:0, excludeList:[]});
            var movementSpeedPercent = [self.inventory.getMovementSpeedPercent, self.buffs.itemBuffs.getMovementSpeedPercent].reduce(function (memo, fn) {
                var obj = fn(memo.excludeList);
                obj.value += memo.value;
                return obj;
            }, {value:0, excludeList:[]});
            var movementSpeedPercentReduction = [self.enemy().inventory.getMovementSpeedPercentReduction, self.debuffs.itemBuffs.getMovementSpeedPercentReduction].reduce(function (memo, fn) {
                var obj = fn(memo.excludeList);
                obj.value += memo.value;
                return obj;
            }, {value:0, excludeList:[]});
            // If agility is a hero's primary attribute, every point in agility increases their movement speed by 0.06%.
            var agiMovementSpeedPercent = self.primaryAttribute() == 'agi' ? self.totalAgi().total * (0.0006) : 0;
            return Math.max(
                self.enemy().inventory.isSheeped() || self.debuffs.itemBuffs.isSheeped() ? 140 :
                (self.heroData().movementspeed + movementSpeedFlat.value + self.ability().getMovementSpeedFlat() + TalentController.getMovementSpeedFlat(self.selectedTalents())) * 
                (1 //+ self.inventory.getMovementSpeedPercent() 
                   + movementSpeedPercent.value
                   + agiMovementSpeedPercent
                   + movementSpeedPercentReduction.value
                   + self.ability().getMovementSpeedPercent() 
                   //+ self.enemy().inventory.getMovementSpeedPercentReduction() 
                   + self.enemy().ability().getMovementSpeedPercentReduction() 
                   + self.buffs.getMovementSpeedPercent() 
                   + self.debuffs.getMovementSpeedPercentReduction()
                   + self.unit().ability().getMovementSpeedPercent() 
                )
            , MIN_MOVESPEED).toFixed(2);
        }
    });
    self.totalTurnRate = ko.pureComputed(function () {
        return (self.heroData().movementturnrate 
                * (1 + self.enemy().ability().getTurnRateReduction()
                     + self.debuffs.getTurnRateReduction())).toFixed(2);
    });
    self.baseDamage = ko.pureComputed(function () {
        var totalAttribute = self.totalAttribute(self.primaryAttribute()),
            abilityBaseDamage = self.ability().getBaseDamage(),
            minDamage = self.heroData().attackdamagemin,
            maxDamage = self.heroData().attackdamagemax;
        console.log('abilityBaseDamage.multiplier', abilityBaseDamage.multiplier);
        var multiplier = self.ability().getSelfBaseDamageReductionPct()
            * self.enemy().ability().getBaseDamageReductionPct()
            * self.debuffs.getBaseDamageReductionPct()
            * self.debuffs.itemBuffs.getBaseDamageReductionPct()
            * abilityBaseDamage.multiplier
            * (self.isIllusion() ? self.getOutgoingDamageMultiplier(self.illusionId(), false, self.heroData().attacktype) : 1);
        return [
            Math.floor((minDamage + totalAttribute + abilityBaseDamage.total) * multiplier),
            Math.floor((maxDamage + totalAttribute + abilityBaseDamage.total) * multiplier)
        ];
    });
    self.baseDamageAvg = ko.pureComputed(function () {
        return (self.baseDamage()[0] + self.baseDamage()[1]) / 2;
    });
    self.baseDamageMin = ko.pureComputed(function () {
        return self.baseDamage()[0];
    });
    self.baseDamageMax = ko.pureComputed(function () {
        return self.baseDamage()[1];
    });
    self.bonusDamage = ko.pureComputed(function () {
        return self.isIllusion() ? 0 : ((self.inventory.getBonusDamage().total
                + self.ability().getBonusDamage().total
                + TalentController.getBonusDamage(self.selectedTalents()).total
                + self.buffs.getBonusDamage().total
                + Math.floor((self.baseDamage()[0] + self.baseDamage()[1]) / 2 
                              * (self.buffs.itemBuffs.getBonusDamagePercent(self.inventory.getBonusDamagePercent()).total
                                 + self.ability().getBonusDamagePercent().total
                                 + self.buffs.getBonusDamagePercent().total
                                )
                            )
                + Math.floor(
                    (self.heroData().attacktype == 'DOTA_UNIT_CAP_RANGED_ATTACK' 
                        ? ((self.heroId() == 'drow_ranger') ? self.ability().getBonusDamagePrecisionAura().total[0] * self.totalAgi().total : self.buffs.getBonusDamagePrecisionAura().total[1])
                        : 0)
                  )
                + Math.floor(
                    ((self.heroId() == 'riki') ? self.ability().getBonusDamageBackstab().total[0] * self.totalAgi().total : 0)
                  )
                ) * self.ability().getSelfBaseDamageReductionPct()
                  * self.enemy().ability().getBaseDamageReductionPct()
                  * self.debuffs.itemBuffs.getBaseDamageReductionPct());
    });
    self.bonusDamageReduction = ko.pureComputed(function () {
        return Math.abs(self.enemy().ability().getBonusDamageReduction() + self.debuffs.getBonusDamageReduction());
    });
    self.damageAvg = ko.pureComputed(function () {
        return (self.baseDamage()[0] + self.baseDamage()[1]) / 2 + self.bonusDamage();
    });
    self.damageMin = ko.pureComputed(function () {
        return self.baseDamage()[0] + self.bonusDamage();
    });
    self.damageMax = ko.pureComputed(function () {
        return self.baseDamage()[1] + self.bonusDamage();
    });
    self.damage = ko.pureComputed(function () {
        return [self.baseDamage()[0] + self.bonusDamage(),
                self.baseDamage()[1] + self.bonusDamage()];
    });
    self.totalStatusResistanceProduct = ko.pureComputed(function() {
        // If strength is a hero's primary attribute, every point in strength increases their status resistance by 0.15%.
        var strStatusResistance = self.primaryAttribute() == 'str' ? 1 - self.totalStr().total * (0.0015) : 1;
        return strStatusResistance;
    });
    self.totalStatusResistance = ko.pureComputed(function () {
        return 1 - self.totalStatusResistanceProduct();
    });
    self.totalMagicResistanceProduct = ko.pureComputed(function () {
        //If intelligence is a hero's primary attribute, every point in intelligence increases their magic resistance by 0.15%.
        var intMagicResistance = self.primaryAttribute() == 'int' ? 1 + self.totalInt().total * (0.0015) : 1;
        return (1 - self.heroData().magicalresistance / 100)
                * (self.isIllusion() ? 1 :
                    self.inventory.getMagicResist()
                    * intMagicResistance
                    * self.ability().getMagicResist()
                    * TalentController.getMagicResist(self.selectedTalents())
                    * self.buffs.getMagicResist()
                    * self.inventory.getMagicResistReductionSelf()
                    * self.enemy().inventory.getMagicResistReduction()
                    * self.enemy().ability().getMagicResistReduction()
                    * self.debuffs.getMagicResistReduction()
                    * self.debuffs.itemBuffs.getMagicResistReduction()
                  );
    });
    self.totalMagicResistance = ko.pureComputed(function () {
        return 1 - self.totalMagicResistanceProduct();
    });
    self.bat = ko.pureComputed(function () {
        var abilityBAT = self.ability().getBAT();
        if (abilityBAT > 0) {
            return abilityBAT;
        }
        return self.heroData().attackrate;
    });
    self.ias = ko.pureComputed(function () {
        var attackSpeed = [self.inventory.getAttackSpeed].reduce(function (memo, fn) {
            var obj = fn(memo.excludeList);
            obj.value += memo.value;
            return obj;
        }, {value:0, excludeList:[]});
        var attackSpeedAura = [self.inventory.getAttackSpeedAura, self.buffs.itemBuffs.getAttackSpeedAura].reduce(function (memo, fn) {
            var obj = fn(memo.excludeList);
            obj.value += memo.value;
            return obj;
        }, {value: 0, excludeList: []});
        var attackSpeedReduction = [self.enemy().inventory.getAttackSpeedReduction, self.debuffs.itemBuffs.getAttackSpeedReduction].reduce(function (memo, fn) {
            var obj = fn(memo.excludeList);
            obj.value += memo.value;
            return obj;
        }, {value:0, excludeList: []});
        var val = self.totalAgi().total
                //+ self.inventory.getAttackSpeed() 
                + attackSpeed.value
                + attackSpeedAura.value
                + attackSpeedReduction.value
                //+ self.enemy().inventory.getAttackSpeedReduction() 
                + self.ability().getAttackSpeed() 
                + TalentController.getAttackSpeed(self.selectedTalents()) 
                + self.enemy().ability().getAttackSpeedReduction() 
                + self.buffs.getAttackSpeed() 
                + self.debuffs.getAttackSpeedReduction()
                + self.unit().ability().getAttackSpeed(); 
        if (val < -80) {
            return -80;
        }
        else if (val > 500) {
            return 500;
        }
        return val.toFixed(2);
    });
    self.attackTime = ko.pureComputed(function () {
        return (self.bat() / (1 + self.ias() / 100)).toFixed(2);
    });
    self.attacksPerSecond = ko.pureComputed(function () {
        return ((1 + self.ias() / 100) / self.bat()).toFixed(2);
    });
    self.totalAccuracyProduct = ko.pureComputed(function () {
        var accuracySources = self.inventory.getAccuracySource(self.heroData().attacktype);
        extend(accuracySources, self.enemy().debuffs.itemBuffs.getAccuracyDebuffSource());
        var accuracySourcesArray = [];
        for (var prop in accuracySources) {
            var el = accuracySources[prop];
            el.name = prop
            accuracySourcesArray.push(el);
        }
        return accuracySourcesArray.reduce(function (memo, source) {
            return memo * Math.pow((1 - source.chance), source.count)
        }, 1);
    });
    self.accuracy = ko.pureComputed(function () {
        return 1 - self.totalAccuracyProduct();
    });
    self.totalEvasionProduct = ko.pureComputed(function () {
        return self.inventory.getEvasion()
            * self.ability().getEvasion()
            * self.ability().getEvasionBacktrack()
            * TalentController.getEvasion(self.selectedTalents())
            * self.buffs.itemBuffs.getEvasion()
    });
    self.evasion = ko.pureComputed(function () {
        if (self.enemy().inventory.isSheeped() || self.debuffs.itemBuffs.isSheeped()) return 0;
        return 1 - self.totalEvasionProduct();
    });
    self.ehpPhysical = ko.pureComputed(function () {
        var evasion = self.enemy().inventory.isSheeped() || self.debuffs.itemBuffs.isSheeped() ? 1 : self.inventory.getEvasion() * self.ability().getEvasion() * self.buffs.itemBuffs.getEvasion();
        var ehp = self.health().total / (1 - self.totalArmorPhysicalReduction());
        ehp /= (1 - (1 - (evasion * self.ability().getEvasionBacktrack())));
        ehp /= (1 - parseFloat(self.enemy().missChance()) / 100);
        ehp *= (self.inventory.activeItems().some(function (item) {return item.item == 'mask_of_madness';}) ? (1 / 1.3) : 1);
        ehp *= (1 / self.ability().getDamageReduction());
        ehp *= (1 / self.buffs.getDamageReduction());
        ehp *= (1 / self.enemy().ability().getDamageAmplification());
        ehp *= (1 / self.debuffs.getDamageAmplification());
        if (self.isIllusion()) ehp *= (1 / self.getIncomingDamageMultiplier(self.illusionId(), false, self.heroData().attacktype));
        return ehp.toFixed(2);
    });
    self.ehpMagical = ko.pureComputed(function () {
        var ehp = self.health().total / self.totalMagicResistanceProduct();
        ehp *= (self.inventory.activeItems().some(function (item) {return item.item == 'mask_of_madness';}) ? (1 / 1.3) : 1);
        ehp *= (1 / self.ability().getDamageReduction());
        ehp *= (1 / self.buffs.getDamageReduction());
        ehp *= (1 / self.ability().getEvasionBacktrack());
        ehp *= (1 / self.enemy().ability().getDamageAmplification());
        ehp *= (1 / self.debuffs.getDamageAmplification());
        if (self.isIllusion()) ehp *= (1 / self.getIncomingDamageMultiplier(self.illusionId(), false, self.heroData().attacktype));
        return ehp.toFixed(2);
    });
    self.bash = ko.pureComputed(function () {
        var attacktype = self.heroData().attacktype;
        return 1 - self.inventory.getBash(attacktype) * self.ability().getBash();
    });
    
    self.critChance = ko.pureComputed(function () {
        return 1 - self.inventory.getCritChance() * self.ability().getCritChance();
    });

    HeroDamageMixin(self, itemData);
    
    self.missChance = ko.pureComputed(function () {
        var blindDebuff = [self.enemy().inventory.getBlindSource, self.debuffs.itemBuffs.getBlindSource].reduce(function (memo, fn) {
            var obj = fn(memo.excludeList);
            obj.total += memo.total;
            return obj;
        }, {total:0, excludeList:[]});
        var blind = 1 - Math.min(self.enemy().ability().getBlindSource().total + self.debuffs.getBlindSource().total + blindDebuff.total, 1);
        return 1 - self.enemy().totalEvasionProduct() * blind;
    });
    self.hitChance = ko.pureComputed(function () {
        return 1 - (parseFloat(self.missChance())/100) * (1 - parseFloat(self.accuracy())/100);
    });
    self.totalattackrange = ko.pureComputed(function () {
        var attacktype = self.heroData().attacktype;
        return self.heroData().attackrange
             + self.ability().getAttackRange()
             + TalentController.getAttackRange(self.selectedTalents())
             + self.inventory.getAttackRange(attacktype).value;
    });
    self.visionrangeday = ko.pureComputed(function () {
        return (self.heroData().visiondaytimerange) * (1 + self.enemy().ability().getVisionRangePctReduction() + self.debuffs.getVisionRangePctReduction());
    });
    self.visionrangenight = ko.pureComputed(function () {
        return (self.heroData().visionnighttimerange + self.inventory.getVisionRangeNight() + self.ability().getVisionRangeNight()) * (1 + self.enemy().ability().getVisionRangePctReduction() + self.debuffs.getVisionRangePctReduction());
    });
    self.lifesteal = ko.pureComputed(function () {
        var total = self.inventory.getLifesteal()
                  + self.ability().getLifesteal()
                  + TalentController.getLifesteal(self.selectedTalents())
                  + self.buffs.getLifesteal();
        if (self.heroData().attacktype == 'DOTA_UNIT_CAP_MELEE_ATTACK') {
            var lifestealAura = [self.inventory.getLifestealAura, self.buffs.itemBuffs.getLifestealAura].reduce(function (memo, fn) {
                var obj = fn(memo.excludeList);
                obj.value += memo.value;
                return obj;
            }, {value: 0, excludeList: []});
            total += lifestealAura.value;
        }
        return total;
    });
    
    self.diffProperties = diffProperties;
    self.diff = {};
    self.diff2 = {};

    for (var i = 0; i < self.diffProperties.length; i++) {
        var index = i;
        self.diff[self.diffProperties[index]] = self.getDiffFunction(self.diffProperties[index]);
        self.diff2[self.diffProperties[index]] = self.getDiffFunction2(self.diffProperties[index]);
    }
};

HeroModel.prototype.getDiffFunction = function (prop) {
    var self = this;
    return ko.pureComputed(function () {
        if (prop == 'baseDamage') {
            return [self[prop]()[0] - self.heroCompare()[prop]()[0], self[prop]()[1] - self.heroCompare()[prop]()[1]];
        }
        else {
            return self[prop]() - self.heroCompare()[prop]();
        }
    }, this, { deferEvaluation: true });
}

HeroModel.prototype.getDiffFunction2 = function (prop) {
    var self = this;
    return ko.pureComputed(function () {
        if (prop == 'baseDamage') {
            return [self[prop]()[0] - self.heroCompare()[prop]()[0], self[prop]()[1] - self.heroCompare()[prop]()[1]];
        }
        else {
            return self[prop]().total - self.heroCompare()[prop]().total;
        }
    }, this, { deferEvaluation: true });
}

HeroModel.prototype.getAbilityLevelMax = function (data) {
    if (data.abilitytype === 'DOTA_ABILITY_TYPE_ATTRIBUTES') {
        return 1;
    }
    else if (data.name === 'invoker_quas' || data.name === 'invoker_wex' || data.name === 'invoker_exort') {
        return 7;
    }
    else if (data.name === 'invoker_invoke') {
        return 1;
    }
    else if (data.name === 'earth_spirit_stone_caller' || data.name === 'ogre_magi_unrefined_fireblast' || data.name === 'monkey_king_mischief') {
        return 1;
    }
    else if (data.abilitytype === 'DOTA_ABILITY_TYPE_ULTIMATE' || data.name === 'keeper_of_the_light_recall' ||
             data.name === 'keeper_of_the_light_blinding_light' || data.name === 'ember_spirit_activate_fire_remnant' ||
             data.name === 'lone_druid_true_form_battle_cry') {
        return 3;
    }
    else if (data.name === 'puck_ethereal_jaunt'  || data.name === 'shadow_demon_shadow_poison_release' ||
             data.name === 'templar_assassin_trap' || data.name === 'spectre_reality') {
        return 0;
    }
    else if (data.name === 'invoker_cold_snap'  || data.name === 'invoker_ghost_walk' || data.name === 'invoker_tornado' || 
             data.name === 'invoker_emp' || data.name === 'invoker_alacrity' || data.name === 'invoker_chaos_meteor' || 
             data.name === 'invoker_sun_strike' || data.name === 'invoker_forge_spirit' || data.name === 'invoker_ice_wall' || 
             data.name === 'invoker_deafening_blast') {
        return 0;
    }
    else if (data.name === 'techies_minefield_sign' || data.name === 'techies_focused_detonate') {
        return 0;
    }
    else {
        return 4;
    }
};

HeroModel.prototype.toggleTalent = function (talentTier, talentIndex) {
    if (this.talents[talentTier]() === talentIndex) {
        this.talents[talentTier](-1);
    }
    else if (this.availableSkillPoints() > 0 || this.talents[talentTier]() == 1 - talentIndex) {
        if (parseInt(this.selectedHeroLevel()) >= talentTier * 5 + 10) {
            this.talents[talentTier](talentIndex);
        }
    }
}

module.exports = HeroModel;