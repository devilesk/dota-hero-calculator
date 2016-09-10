'use strict';
var ko = require('./herocalc_knockout');
    
var my = require("./herocalc_core");

my.prototype.illusionData = {
    chaos_knight_phantasm: {
        hero: 'chaos_knight',
        displayName: 'Chaos Knight Phantasm',
        use_selected_hero: false,
        max_level: 3,
        outgoing_damage: 'outgoing_damage',
        incoming_damage: 'incoming_damage'
    },
    naga_siren_mirror_image: {
        hero: 'naga_siren',
        displayName: 'Naga Siren Mirror Image',
        use_selected_hero: false,
        max_level: 4,
        outgoing_damage: 'outgoing_damage',
        incoming_damage: 'incoming_damage'
    },
    dark_seer_wall_of_replica: {
        hero: 'dark_seer',
        displayName: 'Dark Seer Wall of Replica',
        use_selected_hero: true,
        max_level: 3,
        outgoing_damage: 'replica_damage_outgoing',
        incoming_damage: 'replica_damage_incoming',
        outgoing_damage_scepter: 'replica_damage_outgoing_scepter'
    },
    morphling_replicate: {
        hero: 'morphling',
        displayName: 'Morphling Replicate',
        use_selected_hero: true,
        max_level: 3,
        outgoing_damage: 'illusion_damage_out_pct',
        incoming_damage: 'illusion_damage_in_pct'
    },
    phantom_lancer_doppelwalk: {
        hero: 'phantom_lancer',
        displayName: 'Phantom Lancer Doppelwalk',
        use_selected_hero: false,
        max_level: 4,
        outgoing_damage: 'illusion_damage_out_pct',
        incoming_damage: 'illusion_damage_in_pct'        
    },
    phantom_lancer_juxtapose: {
        hero: 'phantom_lancer',
        displayName: 'Phantom Lancer Juxtapose',
        use_selected_hero: false,
        max_level: 4,
        outgoing_damage: 'illusion_damage_out_pct',
        incoming_damage: 'illusion_damage_in_pct'        
    },
    phantom_lancer_spirit_lance: {
        hero: 'phantom_lancer',
        displayName: 'Phantom Lancer Spirit Lance',
        use_selected_hero: false,
        max_level: 4,
        outgoing_damage: 'illusion_damage_out_pct',
        incoming_damage: 'illusion_damage_in_pct'        
    },
    shadow_demon_disruption: {
        hero: 'shadow_demon',
        displayName: 'Shadow Demon Disruption',
        use_selected_hero: true,
        max_level: 4,
        outgoing_damage: 'illusion_outgoing_damage',
        incoming_damage: 'illusion_incoming_damage'        
    },
    spectre_haunt: {
        hero: 'spectre',
        displayName: 'Spectre Haunt',
        use_selected_hero: false,
        max_level: 3,
        outgoing_damage: 'illusion_damage_outgoing',
        incoming_damage: 'illusion_damage_incoming'        
    },
    terrorblade_conjure_image: {
        hero: 'terrorblade',
        displayName: 'Terrorblade Conjure Image',
        use_selected_hero: false,
        max_level: 4,
        outgoing_damage: 'illusion_outgoing_damage',
        incoming_damage: 'illusion_incoming_damage'        
    },
    terrorblade_reflection: {
        hero: 'terrorblade',
        displayName: 'Terrorblade Reflection',
        use_selected_hero: true,
        max_level: 4,
        outgoing_damage: 'illusion_outgoing_damage'     
    },
    item_manta: {
        hero: '',
        is_item: true,
        displayName: 'Manta Style Illusion',
        use_selected_hero: true,
        max_level: 1,
        outgoing_damage_melee: 'images_do_damage_percent_melee',
        incoming_damage_melee: 'images_take_damage_percent_melee',
        outgoing_damage_ranged: 'images_do_damage_percent_ranged',
        incoming_damage_ranged: 'images_take_damage_percent_ranged'
    }
}

my.prototype.IllusionViewModel = function (h, p, abilityLevel) {
    var self = new my.prototype.HeroCalculatorModel(0);
    self.parent = p;
    self.inventory = self.parent.inventory;
    self.illusionType = ko.observable(self.parent.selectedIllusion().illusionName);
    self.illusionDisplayName = ko.observable(self.parent.selectedIllusion().illusionDisplayName);
    self.illusionAbilityLevel(abilityLevel);
    self.illusionAbilityMaxLevel = ko.observable(my.prototype.illusionData[self.parent.selectedIllusion().illusionName].max_level);
    if (!my.prototype.illusionData[self.illusionType()].use_selected_hero) {
        self.selectedHero(my.prototype.findWhere(self.availableHeroes(), {heroName: self.parent.selectedIllusion().baseHero}));
    }
    else {
        self.selectedHero(self.parent.selectedHero());
    }
    self.selectedHeroLevel(self.parent.selectedHeroLevel());
    self.hero = ko.computed(function() {
        return ko.wrap.fromJS(my.prototype.heroData['npc_dota_hero_' + self.selectedHero().heroName]);
    });
    
    self.ability().getAttributeBonusLevel = self.parent.ability().getAttributeBonusLevel;
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
            var abilityObj = my.prototype.itemData[ability];
        }
        else {
            var abilityObj = my.prototype.findWhere(my.prototype.heroData['npc_dota_hero_' + hero].abilities, {name: ability});
        }
        var attribute = my.prototype.findWhere(abilityObj.attributes, {name: attributeName});
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
                return (1 + self.getAbilityAttributeValue(my.prototype.illusionData[self.illusionType()].hero, self.illusionType(), my.prototype.illusionData[illusionType].incoming_damage_melee, self.illusionAbilityLevel())/100)
            }
            else {
                return (1 + self.getAbilityAttributeValue(my.prototype.illusionData[self.illusionType()].hero, self.illusionType(), my.prototype.illusionData[illusionType].incoming_damage_ranged, self.illusionAbilityLevel())/100)
            }
        }
        else {
            return (1 + self.getAbilityAttributeValue(my.prototype.illusionData[self.illusionType()].hero, self.illusionType(), my.prototype.illusionData[illusionType].incoming_damage, self.illusionAbilityLevel())/100)
        }
    }
    self.getOutgoingDamageMultiplier = function(illusionType, hasScepter, attackType) {
        if (illusionType == 'item_manta') {
            if (attackType == 'DOTA_UNIT_CAP_MELEE_ATTACK') {
                return (1 + self.getAbilityAttributeValue(my.prototype.illusionData[self.illusionType()].hero, self.illusionType(), my.prototype.illusionData[illusionType].outgoing_damage_melee, self.illusionAbilityLevel())/100);
            }
            else {
                return (1 + self.getAbilityAttributeValue(my.prototype.illusionData[self.illusionType()].hero, self.illusionType(), my.prototype.illusionData[illusionType].outgoing_damage_ranged, self.illusionAbilityLevel())/100);
            }
        }
        else {
            return (1 + self.getAbilityAttributeValue(my.prototype.illusionData[self.illusionType()].hero, self.illusionType(), my.prototype.illusionData[illusionType].outgoing_damage, self.illusionAbilityLevel())/100);
        }
    }

    self.baseDamage = ko.computed(function() {
        return [Math.floor(my.prototype.heroData['npc_dota_hero_' + self.selectedHero().heroName].attackdamagemin + self.totalAttribute(self.primaryAttribute()) + self.ability().getBaseDamage().total)
                * self.getOutgoingDamageMultiplier(self.illusionType(), false, self.hero().attacktype()),
                Math.floor(my.prototype.heroData['npc_dota_hero_' + self.selectedHero().heroName].attackdamagemax + self.totalAttribute(self.primaryAttribute()) + self.ability().getBaseDamage().total)
                * self.getOutgoingDamageMultiplier(self.illusionType(), false, self.hero().attacktype())];
    });
    
    self.damage = ko.computed(function() {
        return [self.baseDamage()[0],
                self.baseDamage()[1]];
    });
    
    self.ehpPhysical = ko.computed(function() {
        var ehp = (self.health() * (1 + .06 * self.totalArmorPhysical())) / (1 - (1 - (self.inventory.getEvasion() * self.ability().getEvasion())))
        ehp *= (self.inventory.activeItems().some(function(item) {return item.item == 'mask_of_madness';}) ? (1 / 1.3) : 1);
        ehp *= (1 / self.getIncomingDamageMultiplier(self.illusionType(), false, self.hero().attacktype()));
        return ehp.toFixed(2);
    });
    self.ehpMagical = ko.computed(function() {
        var ehp = self.health() / self.totalMagicResistanceProduct();
        ehp *= (1 / self.getIncomingDamageMultiplier(self.illusionType(), false, self.hero().attacktype()));
        return ehp.toFixed(2);
    });
    
    self.totalArmorPhysical = ko.computed(function() {
        return (self.enemy().ability().getArmorBaseReduction() * self.debuffs.getArmorBaseReduction() * (my.prototype.heroData['npc_dota_hero_' + self.selectedHero().heroName].armorphysical + self.totalAgi() * .14)
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