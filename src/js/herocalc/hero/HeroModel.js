'use strict';
var ko = require('../herocalc_knockout');

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
    self.heroData = ko.computed(function () {
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
    
    self.selectedTalents = ko.computed(function () {
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
        if (a === 'agi') return parseFloat(self.totalAgi());
        if (a === 'int') return parseFloat(self.totalInt());
        if (a === 'str') return parseFloat(self.totalStr());
        return 0;
    };
    self.totalAgi = ko.pureComputed(function () {
        return (self.heroData().attributebaseagility
                + self.heroData().attributeagilitygain * (self.selectedHeroLevel() - 1) 
                + self.inventory.getAttributes('agi') 
                + self.ability().getAttributeBonusLevel() * 2
                + self.ability().getAgility()
                + TalentController.getAgility(self.selectedTalents())
                + self.enemy().ability().getAllStatsReduction()
                + self.debuffs.getAllStatsReduction()
               ).toFixed(2);
    });
    self.intStolen = ko.observable(0).extend({ numeric: 0 });
    self.totalInt = ko.pureComputed(function () {
        return (self.heroData().attributebaseintelligence 
                + self.heroData().attributeintelligencegain * (self.selectedHeroLevel() - 1) 
                + self.inventory.getAttributes('int') 
                + self.ability().getAttributeBonusLevel() * 2
                + self.ability().getIntelligence()
                + TalentController.getIntelligence(self.selectedTalents())
                + self.enemy().ability().getAllStatsReduction()
                + self.debuffs.getAllStatsReduction() + self.intStolen()
               ).toFixed(2);
    });
    self.totalStr = ko.pureComputed(function () {
        return (self.heroData().attributebasestrength 
                + self.heroData().attributestrengthgain * (self.selectedHeroLevel() - 1) 
                + self.inventory.getAttributes('str') 
                + self.ability().getAttributeBonusLevel() * 2
                + self.ability().getStrength()
                + TalentController.getStrength(self.selectedTalents())
                + self.enemy().ability().getStrengthReduction()
                + self.enemy().ability().getAllStatsReduction()
                + self.debuffs.getAllStatsReduction()
               ).toFixed(2);
    });
    // + % status resistance
    self.perkStr = ko.pureComputed(function () {
        return self.totalStr() * 0.15;
    });
    // + % ms
    self.perkAgi = ko.pureComputed(function () {
        return self.totalAgi() * 0.06;
    });
    // + % magic resistance
    self.perkInt = ko.pureComputed(function () {
        return self.totalInt() * 0.15;
    });
    self.health = ko.pureComputed(function () {
        return (self.heroData().statushealth + Math.floor(self.totalStr()) * 20 
                + self.inventory.getHealth()
                + self.ability().getHealth()
                + TalentController.getHealth(self.selectedTalents())
                ).toFixed(2);
    });
    self.healthregen = ko.pureComputed(function () {
        var healthRegenAura = [self.inventory.getHealthRegenAura, self.buffs.itemBuffs.getHealthRegenAura].reduce(function (memo, fn) {
            var obj = fn(memo.excludeList);
            obj.value += memo.value;
            return obj;
        }, {value: 0, excludeList: []});
        return (self.heroData().statushealthregen + self.totalStr() * .06 
                + (self.isIllusion() ? 0 : self.inventory.getHealthRegen() 
                    + self.ability().getHealthRegen()
                    + TalentController.getHealthRegen(self.selectedTalents())
                    + self.buffs.getHealthRegen()
                    + healthRegenAura.value
                    )
                ).toFixed(2);
    });
    self.mana = ko.pureComputed(function () {
        return (self.heroData().statusmana
                + self.totalInt() * 12
                + self.inventory.getMana()
                + TalentController.getMana(self.selectedTalents())
                + self.ability().getMana()).toFixed(2);
    });
    self.manaregen = ko.pureComputed(function () {
        return ((self.heroData().statusmanaregen 
                + self.totalInt() * .04 
                + self.ability().getManaRegen()
                + TalentController.getManaRegen(self.selectedTalents())
                ) 
                * (1 + self.inventory.getManaRegenPercent()) 
                + (self.heroId() === 'crystal_maiden' ? self.ability().getManaRegenArcaneAura() * 2 : self.buffs.getManaRegenArcaneAura())
                + self.inventory.getManaRegenBloodstone()
                + self.inventory.getManaRegen()
                - self.enemy().ability().getManaRegenReduction()).toFixed(2);
    });
    self.totalArmorPhysical = ko.pureComputed(function () {
        var armorAura = [self.inventory.getArmorAura, self.buffs.itemBuffs.getArmorAura].reduce(function (memo, fn) {
            var obj = fn(memo.attributes);
            return obj;
        }, {value:0, attributes:[]});
        var armorReduction = [self.enemy().inventory.getArmorReduction, self.debuffs.itemBuffs.getArmorReduction].reduce(function (memo, fn) {
            var obj = fn(memo.excludeList);
            obj.value += memo.value;
            return obj;
        }, {value: 0, excludeList: []});
        var armorReductionAura = [self.enemy().inventory.getArmorReductionAura, self.debuffs.itemBuffs.getArmorReductionAura].reduce(function (memo, fn) {
            var obj = fn(memo.excludeList);
            obj.value += memo.value;
            return obj;
        }, {value: 0, excludeList: []});
        return (self.enemy().ability().getArmorBaseReduction() * self.debuffs.getArmorBaseReduction() * (self.heroData().armorphysical + self.totalAgi() * 1/6)
                + (self.isIllusion() ? 0 : self.inventory.getArmor()
                    //+ self.inventory.getArmorAura().value
                    //+ self.enemy().inventory.getArmorReduction()
                    + self.ability().getArmor()
                    + TalentController.getArmor(self.selectedTalents())
                    + self.buffs.getArmor()
                    + armorAura.value
                    + armorReductionAura.value
                    )
                + self.enemy().ability().getArmorReduction()
                //+ self.buffs.itemBuffs.getArmor()
                + self.debuffs.getArmorReduction()
                //+ self.buffs.itemBuffs.getArmorAura().value
                + armorReduction.value
                //+ self.debuffs.getArmorReduction()
                ).toFixed(2);
    });
    self.totalArmorPhysicalReduction = ko.pureComputed(function () {
        var totalArmor = self.totalArmorPhysical();
        if (totalArmor >= 0) {
            return ((0.06 * self.totalArmorPhysical()) / (1 + 0.06 * self.totalArmorPhysical()) * 100).toFixed(2);
        }
        else {
            return -((0.06 * -self.totalArmorPhysical()) / (1 + 0.06 * -self.totalArmorPhysical()) * 100).toFixed(2);
        }
    });
    self.spellAmp = ko.pureComputed(function () {
        return (self.totalInt() / 14
                + self.inventory.getSpellAmp()
                + self.ability().getSpellAmp()
                + TalentController.getSpellAmp(self.selectedTalents())
                + self.buffs.getSpellAmp()
                ).toFixed(2);
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
        return ((1 - self.cooldownReductionProduct()) * 100).toFixed(2);
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
            return Math.max(
                self.enemy().inventory.isSheeped() || self.debuffs.itemBuffs.isSheeped() ? 140 :
                (self.heroData().movementspeed + movementSpeedFlat.value + self.ability().getMovementSpeedFlat() + TalentController.getMovementSpeedFlat(self.selectedTalents())) * 
                (1 //+ self.inventory.getMovementSpeedPercent() 
                   + movementSpeedPercent.value
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
                        ? ((self.heroId() == 'drow_ranger') ? self.ability().getBonusDamagePrecisionAura().total[0] * self.totalAgi() : self.buffs.getBonusDamagePrecisionAura().total[1])
                        : 0)
                  )
                + Math.floor(
                    ((self.heroId() == 'riki') ? self.ability().getBonusDamageBackstab().total[0] * self.totalAgi() : 0)
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
    self.totalMagicResistanceProduct = ko.pureComputed(function () {
        return (1 - self.heroData().magicalresistance / 100)
                * (self.isIllusion() ? 1 :
                    self.inventory.getMagicResist()
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
        return ((1 - self.totalMagicResistanceProduct()) * 100).toFixed(2);
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
        var val = parseFloat(self.totalAgi()) 
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
    self.evasion = ko.pureComputed(function () {
        if (self.enemy().inventory.isSheeped() || self.debuffs.itemBuffs.isSheeped()) return 0;
        var e = self.ability().setEvasion();
        if (e) {
            return (e * 100).toFixed(2);
        }
        else {
            return (
                (
                    1 - (
                        self.inventory.getEvasion()
                        * self.ability().getEvasion()
                        * self.ability().getEvasionBacktrack()
                        * TalentController.getEvasion(self.selectedTalents())
                        * self.buffs.itemBuffs.getEvasion()
                    )
                ) * 100
            ).toFixed(2);
        }
    });
    self.ehpPhysical = ko.pureComputed(function () {
        var evasion = self.enemy().inventory.isSheeped() || self.debuffs.itemBuffs.isSheeped() ? 1 : self.inventory.getEvasion() * self.ability().getEvasion() * self.buffs.itemBuffs.getEvasion();
        if (self.totalArmorPhysical() >= 0) {
            var ehp = self.health() * (1 + .06 * self.totalArmorPhysical());
        }
        else {
            var ehp = self.health() * (1 - .06 * self.totalArmorPhysical()) / (1 - .12 * self.totalArmorPhysical());
        }
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
        var ehp = self.health() / self.totalMagicResistanceProduct();
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
        return ((1 - (self.inventory.getBash(attacktype) * self.ability().getBash())) * 100).toFixed(2);
    });
    
    self.critChance = ko.pureComputed(function () {
        return ((1 - (self.inventory.getCritChance() * self.ability().getCritChance())) * 100).toFixed(2);
    });

    HeroDamageMixin(self, itemData);
    
    /*self.critDamage = ko.computed(function () {
        self.critInfo();
        return 0;
    });*/
    self.missChance = ko.pureComputed(function () {
        var missDebuff = [self.enemy().inventory.getMissChance, self.debuffs.itemBuffs.getMissChance].reduce(function (memo, fn) {
            var obj = fn(memo.excludeList);
            obj.value *= memo.value;
            return obj;
        }, {value:1, excludeList:[]});
        return ((1 - (self.enemy().ability().getMissChance() * self.debuffs.getMissChance() * missDebuff.value)) * 100).toFixed(2);
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
        return (total).toFixed(2);
    });
    
    self.diffProperties = diffProperties;
    self.diff = {};

    for (var i = 0; i < self.diffProperties.length; i++) {
        var index = i;
        self.diff[self.diffProperties[index]] = self.getDiffFunction(self.diffProperties[index]);
    }
};

HeroModel.prototype.getDiffFunction = function (prop) {
    var self = this;
    return ko.computed(function () {
        if (prop == 'baseDamage') {
            return [self[prop]()[0] - self.heroCompare()[prop]()[0], self[prop]()[1] - self.heroCompare()[prop]()[1]];
        }
        else {
            return self[prop]() - self.heroCompare()[prop]();
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