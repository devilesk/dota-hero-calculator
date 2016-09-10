'use strict';
var ko = require('./herocalc_knockout');
    
var my = require("./herocalc_core");

my.prototype.UnitOption = function (name, displayname, levels, image, level) {
    this.heroName = ko.computed(function() {
        return (levels > 0) ? name + (level() <= levels ? level() : 1) : name;
    });
    this.heroDisplayName = displayname;
    this.image = image;
    this.levels = levels;
};

my.prototype.UnitViewModel = function (h,p) {
    var self = new my.prototype.HeroModel(h);
    self.parent = p;
    self.selectedUnitLevel = ko.observable(1);
    self.availableUnits = ko.observableArray([
        new my.prototype.UnitOption('npc_dota_lone_druid_bear', 'Lone Druid Spirit Bear',4,'/media/images/units/spirit_bear.png', self.selectedUnitLevel),
        new my.prototype.UnitOption('npc_dota_brewmaster_earth_','Brewmaster Earth Warrior',3,'/media/images/units/npc_dota_brewmaster_earth.png', self.selectedUnitLevel),
        new my.prototype.UnitOption('npc_dota_brewmaster_fire_','Brewmaster Fire Warrior',3,'/media/images/units/npc_dota_brewmaster_fire.png', self.selectedUnitLevel),
        new my.prototype.UnitOption('npc_dota_brewmaster_storm_','Brewmaster Storm Warrior',3,'/media/images/units/npc_dota_brewmaster_storm.png', self.selectedUnitLevel),
        new my.prototype.UnitOption('npc_dota_necronomicon_archer_','Necronomicon Archer',3,'/media/images/units/npc_dota_necronomicon_archer.png', self.selectedUnitLevel),
        new my.prototype.UnitOption('npc_dota_necronomicon_warrior_','Necronomicon Warrior',3,'/media/images/units/npc_dota_necronomicon_warrior.png', self.selectedUnitLevel),
        new my.prototype.UnitOption('npc_dota_lycan_wolf','Lycan Wolf',4,'/media/images/units/npc_dota_lycan_wolf.png', self.selectedUnitLevel),
        new my.prototype.UnitOption('npc_dota_visage_familiar','Visage Familiar',3,'/media/images/units/npc_dota_visage_familiar.png', self.selectedUnitLevel)
    ]);
    self.selectedUnit = ko.observable(self.availableUnits()[0]);
    self.selectedUnit.subscribe(function(newValue) {
        if (newValue.heroName().indexOf('npc_dota_lone_druid_bear') != -1) {
            self.inventory.hasInventory(true);
            self.inventory.items.removeAll();
            self.inventory.activeItems.removeAll();
        }
        else {
            self.inventory.hasInventory(false);
            self.inventory.items.removeAll();
            self.inventory.activeItems.removeAll();
        }
    });
    self.hero = ko.computed(function() {
        return ko.wrap.fromJS(my.prototype.unitData[self.selectedUnit().heroName()]);
    });
    self.heroData = ko.computed(function() {
        return my.prototype.unitData[self.selectedUnit().heroName()];
    });
    self.getAbilityLevelMax = function(data) {
        if (data.abilitytype == 'DOTA_ABILITY_TYPE_ATTRIBUTES') {
            return 10;
        }
        else if (data.name == 'necronomicon_archer_mana_burn' || data.name == 'necronomicon_archer_aoe'
            || data.name == 'necronomicon_warrior_mana_burn' || data.name == 'necronomicon_warrior_last_will') {
            return 3;
        }
        else if (data.name == 'necronomicon_warrior_sight') {
            return 1;
        }
        else {
            return 4;
        }
    };
    self.ability = ko.computed(function() {
        var a = new my.prototype.AbilityModel(ko.mapping.fromJS(my.prototype.unitData[self.selectedUnit().heroName()].abilities));
        a.hasScepter = self.inventory.hasScepter
        switch (self.selectedUnit().heroName()) {
            case 'npc_dota_necronomicon_archer_1':
            case 'npc_dota_necronomicon_warrior_1':
                a.abilities[0].level(1);
                a.abilities[1].level(1);
            break;
            case 'npc_dota_necronomicon_archer_2':
            case 'npc_dota_necronomicon_warrior_2':
                a.abilities[0].level(2);
                a.abilities[1].level(2);
            break;
            case 'npc_dota_necronomicon_archer_3':
                a.abilities[0].level(3);
                a.abilities[1].level(3);
            break;
            case 'npc_dota_necronomicon_warrior_3':
                a.abilities[0].level(3);
                a.abilities[1].level(3);
                a.abilities[2].level(1);
            break;
        }
        a.levelUpAbility = function(index, data, event, hero) {
            switch (a.abilities[index()].name) {
                case 'necronomicon_archer_mana_burn':
                case 'necronomicon_archer_aoe':
                case 'necronomicon_warrior_mana_burn':
                case 'necronomicon_warrior_last_will':
                case 'necronomicon_warrior_sight':
                break;
                default:
                    if (a.abilities[index()].level() < hero.getAbilityLevelMax(data)) {
                        a.abilities[index()].level(a.abilities[index()].level()+1);
                    }                    
                break;
            }

        };
        a.levelDownAbility = function(index, data, event, hero) {            
            switch (a.abilities[index()].name) {
                case 'necronomicon_archer_mana_burn':
                case 'necronomicon_archer_aoe':
                case 'necronomicon_warrior_mana_burn':
                case 'necronomicon_warrior_last_will':
                case 'necronomicon_warrior_sight':
                break;
                default:
                    if (a.abilities[index()].level()>0) {
                        a.abilities[index()].level(a.abilities[index()].level()-1);
                    }
                break;
            }
        };
        return a;
    });        
    self.primaryAttribute = ko.computed(function() {
        //var v = my.prototype.unitData[self.selectedUnit().heroName()].attributeprimary;
        var v = 0;
        if (v == 'DOTA_ATTRIBUTE_AGILITY') {
            return 'agi'
        }
        else if (v == 'DOTA_ATTRIBUTE_INTELLECT') {
            return 'int'
        }
        else if (v == 'DOTA_ATTRIBUTE_STRENGTH') {
            return 'str'
        }
        else {
            return ''
        }
    });
    self.totalAttribute = function(a) {
        if (a == 'agi') {
            return parseFloat(self.totalAgi());
        }
        if (a == 'int') {
            return parseFloat(self.totalInt());
        }
        if (a == 'str') {
            return parseFloat(self.totalStr());
        }
        return 0;
    };
    self.totalAgi = ko.computed(function() {
        return (my.prototype.unitData[self.selectedUnit().heroName()].attributebaseagility
                + my.prototype.unitData[self.selectedUnit().heroName()].attributeagilitygain * (self.selectedHeroLevel() - 1) 
                //+ self.inventory.getAttributes('agi') 
                + self.ability().getAttributeBonusLevel()*2
                + self.ability().getAgility()
                + self.enemy().ability().getAllStatsReduction()
                + self.debuffs.getAllStatsReduction()
               ).toFixed(2);
    });
    self.totalInt = ko.computed(function() {
        return (my.prototype.unitData[self.selectedUnit().heroName()].attributebaseintelligence 
                + my.prototype.unitData[self.selectedUnit().heroName()].attributeintelligencegain * (self.selectedHeroLevel() - 1) 
                //+ self.inventory.getAttributes('int') 
                + self.ability().getAttributeBonusLevel()*2
                + self.ability().getIntelligence()
                + self.enemy().ability().getAllStatsReduction()
                + self.debuffs.getAllStatsReduction()
               ).toFixed(2);
    });
    self.totalStr = ko.computed(function() {
        return (my.prototype.unitData[self.selectedUnit().heroName()].attributebasestrength 
                + my.prototype.unitData[self.selectedUnit().heroName()].attributestrengthgain * (self.selectedHeroLevel() - 1) 
                //+ self.inventory.getAttributes('str') 
                + self.ability().getAttributeBonusLevel()*2
                + self.ability().getStrength()
                + self.enemy().ability().getAllStatsReduction()
                + self.debuffs.getAllStatsReduction()
               ).toFixed(2);
    });
    /*self.health = ko.computed(function() {
        return (my.prototype.unitData[self.selectedUnit().heroName()].statushealth + self.totalStr()*19 
                + self.inventory.getHealth()
                + self.ability().getHealth()).toFixed(2);
    });
    self.healthregen = ko.computed(function() {
        return (my.prototype.unitData[self.selectedUnit().heroName()].statushealthregen + self.totalStr()*.03 
                + self.inventory.getHealthRegen() 
                + self.ability().getHealthRegen()
                + self.buffs.getHealthRegen()).toFixed(2);
    });
    self.mana = ko.computed(function() {
        return (my.prototype.unitData[self.selectedUnit().heroName()].statusmana + self.totalInt()*13 + self.inventory.getMana()).toFixed(2);
    });
    self.manaregen = ko.computed(function() {
        return ((my.prototype.unitData[self.selectedUnit().heroName()].statusmanaregen 
                + self.totalInt()*.04 
                + self.ability().getManaRegen()) 
                * (1 + self.inventory.getManaRegenPercent()) 
                + (self.selectedHero().heroName == 'crystal_maiden' ? self.ability().getManaRegenArcaneAura() * 2 : self.buffs.getManaRegenArcaneAura())
                + self.inventory.getManaRegenBloodstone()
                - self.enemy().ability().getManaRegenReduction()).toFixed(2);
    });
    self.totalArmorPhysical = ko.computed(function() {
        return (self.enemy().ability().getArmorBaseReduction() * self.debuffs.getArmorBaseReduction() * (my.prototype.unitData[self.selectedUnit().heroName()].armorphysical + self.totalAgi()*.14)
                + self.inventory.getArmor() + self.ability().getArmor() + self.enemy().ability().getArmorReduction() + self.buffs.getArmor() + self.debuffs.getArmorReduction()).toFixed(2);
    });
    self.totalArmorPhysicalReduction = ko.computed(function() {
        return ((0.06 * self.totalArmorPhysical()) / (1 + 0.06 * self.totalArmorPhysical()) * 100).toFixed(2);
    });
    self.totalMovementSpeed = ko.computed(function() {
        if (self.parent.ability().isShapeShiftActive()) {
            return 522;
        }
        var ms = (self.ability().setMovementSpeed() > 0 ? self.ability().setMovementSpeed() : self.buffs.setMovementSpeed());
        if (ms > 0) {
            return ms;
        }
        else {
            return ((my.prototype.unitData[self.selectedUnit().heroName()].movementspeed + self.inventory.getMovementSpeedFlat()+ self.ability().getMovementSpeedFlat()) * 
                    (1 + self.inventory.getMovementSpeedPercent() 
                       + self.ability().getMovementSpeedPercent() 
                       + self.enemy().inventory.getMovementSpeedPercentReduction() 
                       + self.enemy().ability().getMovementSpeedPercentReduction() 
                       + self.buffs.getMovementSpeedPercent() 
                       + self.debuffs.getMovementSpeedPercentReduction()
                    )).toFixed(2);
        }
    });
    self.totalTurnRate = ko.computed(function() {
        return (my.prototype.unitData[self.selectedUnit().heroName()].movementturnrate 
                * (1 + self.enemy().ability().getTurnRateReduction()
                     + self.debuffs.getTurnRateReduction())).toFixed(2);
    });
    */
    self.baseDamage = ko.computed(function() {
        return [Math.floor(my.prototype.unitData[self.selectedUnit().heroName()].attackdamagemin + self.totalAttribute(self.primaryAttribute()) + self.ability().getBaseDamage().total),
                Math.floor(my.prototype.unitData[self.selectedUnit().heroName()].attackdamagemax + self.totalAttribute(self.primaryAttribute()) + self.ability().getBaseDamage().total)];
    });
    /*self.bonusDamage = ko.computed(function() {
        return self.inventory.getBonusDamage().total
                + self.ability().getBonusDamage().total
                + self.buffs.getBonusDamage().total
                + Math.floor((self.baseDamage()[0] + self.baseDamage()[1])/2 
                              * (self.inventory.getBonusDamagePercent().total
                                 + self.ability().getBonusDamagePercent().total
                                 + self.buffs.getBonusDamagePercent().total
                                )
                            )
                + Math.floor(
                    (self.hero().attacktype() == 'DOTA_UNIT_CAP_RANGED_ATTACK' 
                        ? ((self.selectedHero().heroName == 'drow_ranger') ? self.ability().getBonusDamagePrecisionAura().total[0] * self.totalAgi() : self.buffs.getBonusDamagePrecisionAura().total[1])
                        : 0)
                  );
    });*/
    /*self.bonusDamageReduction = ko.computed(function() {
        return Math.abs(self.enemy().ability().getBonusDamageReduction() + self.debuffs.getBonusDamageReduction());
    });
    self.damage = ko.computed(function() {
        return [self.baseDamage()[0] + self.bonusDamage()[0],
                self.baseDamage()[1] + self.bonusDamage()[1]];
    });*/
    self.totalMagicResistanceProduct = ko.computed(function() {
        return (1 - my.prototype.unitData[self.selectedUnit().heroName()].magicalresistance / 100) 
                   * (1 - self.inventory.getMagicResist() / 100) 
                   * (1 - self.ability().getMagicResist() / 100) 
                   * (1 - self.buffs.getMagicResist() / 100) 
                   * self.enemy().inventory.getMagicResistReduction()
                   * self.enemy().ability().getMagicResistReduction() 
                   * self.debuffs.getMagicResistReduction();
    });
    self.totalMagicResistance = ko.computed(function() {
        return (1 - self.totalMagicResistanceProduct());
    });
    self.bat = ko.computed(function() {
        var abilityBAT = self.ability().getBAT();
        if (abilityBAT > 0) {
            return abilityBAT;
        }
        return my.prototype.unitData[self.selectedUnit().heroName()].attackrate;
    });
    /*
    self.ias = ko.computed(function() {
        var val = parseFloat(self.totalAgi()) 
                + self.inventory.getAttackSpeed() 
                + self.ability().getAttackSpeed() 
                + self.enemy().ability().getAttackSpeedReduction() 
                + self.buffs.getAttackSpeed() 
                + self.debuffs.getAttackSpeedReduction();
        if (val < -80) {
            return -80;
        }
        else if (val > 400) {
            return 400;
        }
        return (val).toFixed(2);
    });*/
    self.attackTime = ko.computed(function() {
        return (self.bat() / (1 + self.ias() / 100)).toFixed(2);
    });
    self.attacksPerSecond = ko.computed(function() {
        return (1 + self.ias() / 100) / self.bat();
    });
    self.evasion = ko.computed(function() {
        var e = self.ability().setEvasion();
        if (e) {
            return (e * 100).toFixed(2) + '%';
        }
        else {
            return ((1-(self.inventory.getEvasion() * self.ability().getEvasion())) * 100).toFixed(2) + '%';
        }
    });
    self.ehpPhysical = ko.computed(function() {
        return ((self.health() * (1 + .06 * self.totalArmorPhysical())) / (1-(1-(self.inventory.getEvasion() * self.ability().getEvasion())))).toFixed(2);
    });
    self.ehpMagical = ko.computed(function() {
        return (self.health() / self.totalMagicResistanceProduct()).toFixed(2);
    });
    
    return self;
}