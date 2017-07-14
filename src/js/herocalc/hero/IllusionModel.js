'use strict';
var HeroModel = require("./HeroModel");
var illusionData = require("../illusion/illusionData");
var findWhere = require("../util/findWhere");

var IllusionModel = function (heroData, itemData, h,p, abilityLevel) {
    var self = this;
    HeroModel.call(this, heroData, itemData, h);
    self.illusionAbilityLevel = ko.observable(abilityLevel);
    self.parent = p;
    
    self.totalAgi = ko.computed(function () {
        return (self.heroData().attributebaseagility
                + self.heroData().attributeagilitygain * (self.selectedHeroLevel() - 1) 
                + self.inventory.getAttributes('agi') 
                + self.ability().getAttributeBonusLevel() * 2
                + self.ability().getAgility()
                + self.enemy().ability().getAllStatsReduction()
                + self.debuffs.getAllStatsReduction()
               ).toFixed(2);
    });
    self.intStolen = ko.observable(0).extend({ numeric: 0 });
    self.totalInt = ko.computed(function () {
        return (self.heroData().attributebaseintelligence 
                + self.heroData().attributeintelligencegain * (self.selectedHeroLevel() - 1) 
                + self.inventory.getAttributes('int') 
                + self.ability().getAttributeBonusLevel() * 2
                + self.ability().getIntelligence()
                + self.enemy().ability().getAllStatsReduction()
                + self.debuffs.getAllStatsReduction() + self.intStolen()
               ).toFixed(2);
    });
    self.totalStr = ko.computed(function () {
        return (self.heroData().attributebasestrength 
                + self.heroData().attributestrengthgain * (self.selectedHeroLevel() - 1) 
                + self.inventory.getAttributes('str') 
                + self.ability().getAttributeBonusLevel() * 2
                + self.ability().getStrength()
                + self.enemy().ability().getAllStatsReduction()
                + self.debuffs.getAllStatsReduction()
               ).toFixed(2);
    });
    
    self.getAbilityAttributeValue = function(hero, ability, attributeName, level) {
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
        else if (level > attribute.length) {
            return parseFloat(attribute.value[0]);
        }
        else {
            return parseFloat(attribute.value[level - 1]);
        }
    }
    
    self.getIncomingDamageMultiplier = function(illusionType, hasScepter, attackType) {
        if (illusionType == 'item_manta') {
            if (attackType == 'DOTA_UNIT_CAP_MELEE_ATTACK') {
                return (1 + self.getAbilityAttributeValue(illusionData[self.illusionType()].hero, self.illusionType(), illusionData[illusionType].incoming_damage_melee, self.illusionAbilityLevel())/100)
            }
            else {
                return (1 + self.getAbilityAttributeValue(illusionData[self.illusionType()].hero, self.illusionType(), illusionData[illusionType].incoming_damage_ranged, self.illusionAbilityLevel())/100)
            }
        }
        else {
            return (1 + self.getAbilityAttributeValue(illusionData[self.illusionType()].hero, self.illusionType(), illusionData[illusionType].incoming_damage, self.illusionAbilityLevel())/100)
        }
    }
    self.getOutgoingDamageMultiplier = function(illusionType, hasScepter, attackType) {
        if (illusionType == 'item_manta') {
            if (attackType == 'DOTA_UNIT_CAP_MELEE_ATTACK') {
                return (1 + self.getAbilityAttributeValue(illusionData[self.illusionType()].hero, self.illusionType(), illusionData[illusionType].outgoing_damage_melee, self.illusionAbilityLevel())/100);
            }
            else {
                return (1 + self.getAbilityAttributeValue(illusionData[self.illusionType()].hero, self.illusionType(), illusionData[illusionType].outgoing_damage_ranged, self.illusionAbilityLevel())/100);
            }
        }
        else {
            return (1 + self.getAbilityAttributeValue(illusionData[self.illusionType()].hero, self.illusionType(), illusionData[illusionType].outgoing_damage, self.illusionAbilityLevel())/100);
        }
    }

    self.baseDamage = ko.computed(function() {
        return [Math.floor(heroData['npc_dota_hero_' + self.heroId()].attackdamagemin + self.totalAttribute(self.primaryAttribute()) + self.ability().getBaseDamage().total)
                * self.getOutgoingDamageMultiplier(self.illusionType(), false, self.heroData().attacktype),
                Math.floor(heroData['npc_dota_hero_' + self.heroId()].attackdamagemax + self.totalAttribute(self.primaryAttribute()) + self.ability().getBaseDamage().total)
                * self.getOutgoingDamageMultiplier(self.illusionType(), false, self.heroData().attacktype)];
    });
    
    self.damage = ko.computed(function() {
        return [self.baseDamage()[0],
                self.baseDamage()[1]];
    });
    
    self.ehpPhysical = ko.computed(function() {
        var ehp = (self.health() * (1 + .06 * self.totalArmorPhysical())) / (1 - (1 - (self.inventory.getEvasion() * self.ability().getEvasion())))
        ehp *= (self.inventory.activeItems().some(function(item) {return item.item == 'mask_of_madness';}) ? (1 / 1.3) : 1);
        ehp *= (1 / self.getIncomingDamageMultiplier(self.illusionType(), false, self.heroData().attacktype));
        return ehp.toFixed(2);
    });
    self.ehpMagical = ko.computed(function() {
        var ehp = self.health() / self.totalMagicResistanceProduct();
        ehp *= (1 / self.getIncomingDamageMultiplier(self.illusionType(), false, self.heroData().attacktype));
        return ehp.toFixed(2);
    });
    
    self.totalArmorPhysical = ko.computed(function() {
        return (self.enemy().ability().getArmorBaseReduction() * self.debuffs.getArmorBaseReduction() * (heroData['npc_dota_hero_' + self.heroId()].armorphysical + self.totalAgi() * .14)
                + self.ability().getArmor() + self.enemy().ability().getArmorReduction() + self.buffs.getArmor() + self.debuffs.getArmorReduction()).toFixed(2);
    });
    
    self.ias = ko.computed(function() {
        var val = parseFloat(self.totalAgi()) 
                + self.ability().getAttackSpeed() 
                + self.enemy().ability().getAttackSpeedReduction() 
                + self.buffs.getAttackSpeed() 
                + self.debuffs.getAttackSpeedReduction()
                + self.unit().ability().getAttackSpeed(); 
        if (val < -80) {
            return -80;
        }
        else if (val > 400) {
            return 400;
        }
        return val.toFixed(2);
    });
    
    return self;
}
IllusionModel.prototype = Object.create(HeroModel.prototype);
IllusionModel.prototype.constructor = IllusionModel;

module.exports = IllusionModel;