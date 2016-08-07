define(function (require, exports, module) {
    'use strict';
    var ko = require('herocalc_knockout');
        
    var my = require("./herocalc_core").HEROCALCULATOR;

    my.prototype.AbilityModel = function (a, h) {
        var self = this;
        self.hero = h;
        self.abilityData = my.prototype.abilityData;
        self.hasScepter = ko.observable(false);
        self.isShapeShiftActive = ko.observable(false);
        self.abilities = a;
        for (var i = 0; i < self.abilities().length; i++) {
            self.abilities()[i].isActive = ko.observable(false);
            self.abilities()[i].isDetail = ko.observable(false);
            self.abilities()[i].baseDamage = ko.observable(0);
            self.abilities()[i].baseDamageReductionPct = ko.observable(0);
            self.abilities()[i].baseDamageMultiplier = ko.observable(0);
            self.abilities()[i].bash = ko.observable(0);
            self.abilities()[i].bashBonusDamage = ko.observable(0);
            self.abilities()[i].bonusDamage = ko.observable(0);
            self.abilities()[i].bonusDamageOrb = ko.observable(0);
            self.abilities()[i].bonusDamagePct = ko.observable(0);
            self.abilities()[i].bonusDamagePrecisionAura = ko.observable(0);
            self.abilities()[i].bonusDamageReduction = ko.observable(0);
            self.abilities()[i].bonusHealth = ko.observable(0);
            self.abilities()[i].bonusStrength = ko.observable(0);
            self.abilities()[i].bonusStrength2 = ko.observable(0);
            self.abilities()[i].bonusAgility = ko.observable(0);
            self.abilities()[i].bonusAgility2 = ko.observable(0);
            self.abilities()[i].bonusInt = ko.observable(0);
            self.abilities()[i].bonusAllStatsReduction = ko.observable(0);
            self.abilities()[i].damageAmplification = ko.observable(0);
            self.abilities()[i].damageReduction = ko.observable(0);
            self.abilities()[i].evasion = ko.observable(0);
            self.abilities()[i].magicResist = ko.observable(0);
            self.abilities()[i].manaregen = ko.observable(0);
            self.abilities()[i].manaregenreduction = ko.observable(0);
            self.abilities()[i].missChance = ko.observable(0);
            self.abilities()[i].movementSpeedFlat = ko.observable(0);
            self.abilities()[i].movementSpeedPct = ko.observable(0);
            self.abilities()[i].movementSpeedPctReduction = ko.observable(0);
            self.abilities()[i].turnRateReduction = ko.observable(0);
            self.abilities()[i].attackrange = ko.observable(0);
            self.abilities()[i].attackspeed = ko.observable(0);
            self.abilities()[i].attackspeedreduction = ko.observable(0);
            self.abilities()[i].armor = ko.observable(0);
            self.abilities()[i].armorReduction = ko.observable(0);
            self.abilities()[i].healthregen = ko.observable(0);
            self.abilities()[i].lifesteal = ko.observable(0);
            self.abilities()[i].visionnight = ko.observable(0);
            self.abilities()[i].visionday = ko.observable(0);
        }
        self.abilityControlData = {};
        self.abilitySettingsData = function (data, parent, index) {
            if (self.abilityControlData[data] == undefined) {
                return self.processAbility(data, parent, index, self.abilityData[data]);
            }
            else {
                return self.abilityControlData[data];
            }
        }
        
        self.processAbility = function (data, parent, index, args) {
            var result = {};
            result.data = [];
            var v;
            var v_list = [];
            for (var i=0; i < args.length; i++) {
                switch (args[i].controlType) {
                    case 'input':
                        v = ko.observable(0).extend({ numeric: 2 });
                        v.controlValueType = args[i].controlValueType;
                        v_list.push(v);
                        result.data.push({ labelName: args[i].label.toUpperCase() + ':', controlVal: v, controlType: args[i].controlType, display: args[i].display });
                    break;
                    case 'checkbox':
                        v = ko.observable(false);
                        v.controlValueType = args[i].controlValueType;
                        v_list.push(v);
                        result.data.push({ labelName: args[i].label.toUpperCase() + '?', controlVal: v, controlType: args[i].controlType, display: args[i].display });
                    break;
                    case 'radio':
                        v = ko.observable(args[i].controlOptions[0].value);
                        v.controlValueType = args[i].controlValueType;
                        v_list.push(v);
                        result.data.push({ labelName: args[i].label.toUpperCase() + '?', controlVal: v, controlType: args[i].controlType, display: args[i].display, controlOptions: args[i].controlOptions });
                    break;
                    case 'method':
                    case 'text':
                        // single input abilities
                        if (args[i].controls == undefined) {
                            if (args[i].noLevel) {
                                var attributeValue = function (attributeName) {
                                    return {fn: ko.computed(function () {
                                        var _ability = self.abilities().find(function(b) {
                                            return b.name() == data;
                                        });
                                        return self.getAbilityAttributeValue(_ability.attributes(), attributeName, 0);
                                    })};
                                };
                            }
                            else {
                                var attributeValue = function (attributeName) {
                                    return {fn: ko.computed(function () {
                                        var _ability = self.abilities().find(function(b) {
                                            return b.name() == data;
                                        });
                                        return self.getAbilityAttributeValue(_ability.attributes(), attributeName, _ability.level());
                                    })};
                                };
                            }
                            var g = attributeValue(args[i].attributeName)
                            var r = self.getComputedFunction(v, g.fn, args[i].fn, parent, index, self, args[i].returnProperty, undefined, data);
                            if (args[i].ignoreTooltip) {
                                var tooltip = args[i].label || args[i].attributeName;
                            }
                            else {
                                var tooltip = self.getAbilityAttributeTooltip(self.abilities()[index].attributes(), args[i].attributeName) || args[i].label || args[i].attributeName;
                            }
                            result.data.push({ labelName: tooltip.toUpperCase(), controlVal: r, controlType: args[i].controlType, display: args[i].display, clean: g.fn });
                        }
                        // multi input abilities
                        else {
                            if (args[i].noLevel) {
                                var attributeValue = function (attributeName) {
                                    return {fn: ko.computed(function () {
                                        return self.getAbilityAttributeValue(self.abilities()[index].attributes(), attributeName, 0);
                                    })};
                                };
                            }
                            else {
                                var attributeValue = function (attributeName) {
                                    return {fn: ko.computed(function () {
                                        return self.getAbilityAttributeValue(self.abilities()[index].attributes(), attributeName, self.abilities()[index].level());
                                    })};
                                };
                            }
                            var g = attributeValue(args[i].attributeName)
                            var r = self.getComputedFunction(v_list, g.fn, args[i].fn, parent, index, self, args[i].returnProperty, args[i].controls, data);
                            if (args[i].ignoreTooltip) {
                                var tooltip = args[i].label || args[i].attributeName;
                            }
                            else {
                                var tooltip = self.getAbilityAttributeTooltip(self.abilities()[index].attributes(), args[i].attributeName) || args[i].label || args[i].attributeName;
                            }
                            result.data.push({ labelName: tooltip.toUpperCase(), controlVal: r, controlType: args[i].controlType, display: args[i].display, clean: g.fn });
                        }
                        
                        if (args[i].controlType == 'method') {
                            v_list.push(r);
                        }
                    break;
                }
            }
            self.abilityControlData[data] = result;
            return result;
        }

        self.getComputedFunction = function (v, attributeValue, fn, parent, index, abilityModel, returnProperty, controls, abilityName) {
            var _ability = abilityModel.abilities().find(function(b) {
                return b.name() == abilityName;
            });
            return ko.pureComputed(function () {                
                var inputValue;
                if (controls == undefined) {
                    if (v == undefined) {
                        inputValue = v;
                    }
                    else if (typeof v() == 'boolean') {
                        inputValue = v();
                    }
                    else if (v.controlValueType == undefined) {
                        inputValue = parseFloat(v());
                    }
                    else if (v.controlValueType == 'string') {
                        inputValue = v();
                    }
                    else {
                        inputValue = parseFloat(v());
                    }
                }
                else {
                    var v_list = [];
                    for (var i=0;i<controls.length;i++) {
                        switch (typeof v[controls[i]]()) {
                            case 'boolean':
                            case 'object':
                                v_list.push(v[controls[i]]());
                            break;
                            default:
                                v_list.push(parseFloat(v[controls[i]]()));
                            break;
                        }
                    }
                    inputValue = v_list;
                }
                
                var returnVal = fn.call(this, inputValue, attributeValue(), parent, index, abilityModel, _ability);
                if (returnProperty != undefined) {
                    _ability[returnProperty](returnVal);
                }
                return returnVal;
            }, this);
        }

        self.getAbilityAttributeValue = function (attributes, attributeName, level) {
            for (var i=0; i < attributes.length; i++) {
                if (attributes[i].name() == attributeName) {
                    if (level == 0) {
                        return parseFloat(attributes[i].value()[0]);
                    }
                    else if (level > attributes[i].value().length) {
                        return parseFloat(attributes[i].value()[0]);
                    }
                    else {
                        return parseFloat(attributes[i].value()[level-1]);
                    }
                }
            }
        }

        self.getAbilityAttributeTooltip = function (attributes, attributeName) {
            for (var i=0; i<attributes.length; i++) {
                if (attributes[i].name() == attributeName) {
                    if (attributes[i].hasOwnProperty('tooltip')) {
                        var d = attributes[i].tooltip().replace(/\\n/g, '');
                        return d;
                    }
                    else {
                        return '';
                    }
                }
            }
            return '';
        }
        
        self.getAbilityLevelByAbilityName = function (abilityName) {
            for (var i = 0; i < self.abilities().length; i++) {
                if (self.abilities()[i].name() == abilityName) {
                    return self.abilities()[i].level();
                }
            }
            return -1;
        }

        self.getAbilityByName = function (abilityName) {
            for (var i = 0; i < self.abilities().length; i++) {
                if (self.abilities()[i].name() == abilityName) {
                    return self.abilities()[i];
                }
            }
            return undefined;
        }

        self.getAbilityPropertyValue = function (ability, property) {
            return parseFloat(ability[property]()[ability.level()-1]);
        }
        
        self.getAttributeBonusLevel = function () {
            for (var i = 0; i < self.abilities().length; i++) {
                if (self.abilities()[i].name() == 'attribute_bonus') {
                    return self.abilities()[i].level();
                }
            }
            return 0;        
        }
        
        self.getAllStatsReduction = ko.computed(function () {
            var totalAttribute = 0;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            /*switch(attribute.name()) {
                                // invoker_quas
                                case 'bonus_strength':
                                    totalAttribute += parseInt(attribute.value()[ability.level()-1]);
                                break;
                            }*/
                        }
                    }
                }
                else if (ability.bonusAllStatsReduction != undefined) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        // slark_essence_shift
                        totalAttribute+=ability.bonusAllStatsReduction();
                    }
                }
            }
            return totalAttribute;
        });
        
        self.getStrengthReduction = ko.computed(function () {
            var totalAttribute = 0;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            /*switch(attribute.name()) {
                                // invoker_quas
                                case 'bonus_strength':
                                    totalAttribute += parseInt(attribute.value()[ability.level()-1]);
                                break;
                            }*/
                        }
                    }
                }
                else if (ability.bonusStrength != undefined && ability.name() == 'undying_decay') {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        // undying_decay
                        totalAttribute-=ability.bonusStrength();
                    }
                }
            }
            return totalAttribute;
        });
        
        self.getStrength = ko.computed(function () {
            var totalAttribute = 0;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            /*switch(attribute.name()) {
                                // invoker_quas
                                case 'bonus_strength':
                                    totalAttribute += parseInt(attribute.value()[ability.level()-1]);
                                break;
                            }*/
                        }
                    }
                }
                else {
                    if (ability.bonusStrength != undefined) {
                        if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1) || ability.name() == 'invoker_quas')) {
                            // pudge_flesh_heap,invoker_quas,morphling_morph_str,morphling_morph_agi,undying_decay
                            totalAttribute+=ability.bonusStrength();
                        }
                    }
                    if (ability.bonusStrength2 != undefined) {
                        if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                            // morphling_morph_str
                            totalAttribute+=ability.bonusStrength2();
                        }
                    }
                }
            }
            return totalAttribute;
        });
        
        self.getAgility = ko.computed(function () {
            var totalAttribute = 0;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // drow_ranger_marksmanship
                                case 'marksmanship_agility_bonus':
                                    totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                break;
                            }
                        }
                    }
                }
                else {
                    if (ability.bonusAgility != undefined) {
                        if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1) || ability.name() == 'invoker_wex')) {
                            // invoker_wex,morphling_morph_agi,morphling_morph_str
                            totalAttribute+=ability.bonusAgility();
                        }
                    }
                    if (ability.bonusAgility2 != undefined) {
                        if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                            // invoker_wex,morphling_morph_agi,morphling_morph_str
                            totalAttribute+=ability.bonusAgility2();
                        }
                    }
                }
            }
            return totalAttribute;
        });

        self.getIntelligence = ko.computed(function () {
            var totalAttribute = 0;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // invoker_exort
                            /*    case 'bonus_intelligence':
                                    totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                break;*/
                            }
                        }
                    }
                }
                else if (ability.bonusInt != undefined) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1) || ability.name() == 'invoker_exort')) {
                        // invoker_exort
                        totalAttribute+=ability.bonusInt();
                    }
                }
            }
            return totalAttribute;
        });
        
        self.getArmor = ko.computed(function () {
            var totalAttribute = 0;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // axe_berserkers_call,dragon_knight_dragon_blood,troll_warlord_berserkers_rage,lycan_shapeshift,enraged_wildkin_toughness_aura
                                case 'bonus_armor':
                                    if (ability.name() != 'templar_assassin_meld') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                    }
                                break;
                                // sven_warcry
                                case 'warcry_armor':
                                    totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                break;
                                // lich_frost_armor,ogre_magi_frost_armor
                                case 'armor_bonus':
                                    if (ability.name() == 'lich_frost_armor' || ability.name() == 'ogre_magi_frost_armor') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                    }
                                break;
                            }
                        }
                    }
                }
                else if (ability.armor != undefined) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        // shredder_reactive_armor,visage_gravekeepers_cloak
                        totalAttribute+=ability.armor();
                    }
                }
            }
            return totalAttribute;
        });

        self.getArmorBaseReduction = ko.computed(function () {
            var totalAttribute = 1;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        switch(ability.name()) {
                            //elder_titan_natural_order
                            case 'elder_titan_natural_order':
                                totalAttribute *= (1-self.getAbilityAttributeValue(self.abilities()[i].attributes(), 'armor_reduction_pct', ability.level())/100);
                            break;
                        }
                    }
                }
            }
            return totalAttribute;
        });
        
        self.getArmorReduction = ko.computed(function () {
            var totalAttribute = 0;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        switch(ability.name()) {
                            //templar_assassin_meld
                            case 'templar_assassin_meld':
                                totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), 'bonus_armor', ability.level());
                            break;
                            // tidehunter_gush
                            case 'tidehunter_gush':
                                totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), 'armor_bonus', ability.level());
                            break;
                            // naga_siren_rip_tide
                            case 'naga_siren_rip_tide':
                            // slardar_amplify_damage
                            case 'slardar_amplify_damage':
                            // vengefulspirit_wave_of_terror
                            case 'vengefulspirit_wave_of_terror':
                                totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), 'armor_reduction', ability.level());
                            break;
                            // nevermore_dark_lord
                            case 'nevermore_dark_lord':
                                totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), 'presence_armor_reduction', ability.level());
                            break;
                        }
                    }
                }
                else if (ability.armorReduction != undefined) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        // alchemist_acid_spray
                        totalAttribute+=ability.armorReduction();
                    }
                }
            }
            return totalAttribute;
        });

        self.getHealth = ko.computed(function () {
            var totalAttribute = 0;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // lone_druid_true_form,lycan_shapeshift,troll_warlord_berserkers_rage
                                case 'bonus_hp':
                                    totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                break;
                                // lone_druid_synergy
                                case 'true_form_hp_bonus':
                                    if (self.isTrueFormActive()) {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                    }
                                break;
                            }
                        }
                    }
                }
                else if (ability.bonusHealth != undefined) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        // clinkz_death_pact
                        totalAttribute+=ability.bonusHealth();
                    }
                }
            }
            return totalAttribute;
        });
        
        self.isTrueFormActive = function () {
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (ability.isActive() && ability.name() == 'lone_druid_true_form') {
                    return true;
                }
            }
            return false;
        }

        self.getHealthRegen = ko.computed(function () {
            var totalAttribute = 0;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // alchemist_chemical_rage, dragon_knight_dragon_blood
                                case 'bonus_health_regen':
                                // broodmother_spin_web
                                case 'heath_regen':
                                // omniknight_guardian_angel,treant_living_armor,satyr_hellcaller_unholy_aura
                                case 'health_regen':
                                    totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                break;
                                // legion_commander_press_the_attack
                                case 'hp_regen':
                                    totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                break;
                            }
                        }
                    }
                }
                else if (ability.healthregen != undefined) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        // shredder_reactive_armor,invoker_quas,necrolyte_sadist
                        totalAttribute+=ability.healthregen();
                    }
                }
            }
            return totalAttribute;
        });

        self.getMana = ko.computed(function () {
            var totalAttribute = 0;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // obsidian_destroyer_essence_aura
                                case 'bonus_mana':
                                    totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                break;
                            }
                        }
                    }
                }
            }
            return totalAttribute;
        });
        
        self.getManaRegen = ko.computed(function () {
            var totalAttribute = 0;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // alchemist_chemical_rage
                                case 'bonus_mana_regen':
                                    totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                break;
                            }
                        }
                    }
                }
                else if (ability.manaregen != undefined) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        // necrolyte_sadist
                        totalAttribute+=ability.manaregen();
                    }
                }
            }
            return totalAttribute;
        });
        
        self.getManaRegenArcaneAura = ko.computed(function () {
            var totalAttribute = 0;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // crystal_maiden_brilliance_aura
                                case 'mana_regen':
                                    if (ability.name() == 'crystal_maiden_brilliance_aura') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                    }
                                break;
                            }
                        }
                    }
                }
            }
            return totalAttribute;
        });

        self.getManaRegenReduction = ko.computed(function () {
            var totalAttribute = 0;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            //switch(attribute.name()) {
                            //    // 
                            //    case '':
                            //        totalAttribute += parseInt(attribute.value()[ability.level()-1]);
                            //    break;
                            //}
                        }
                    }
                }
                else if (ability.manaregenreduction != undefined) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        // pugna_nether_ward
                        totalAttribute+=ability.manaregenreduction();
                    }
                }
            }
            return totalAttribute;
        });
        
        self.getAttackRange = ko.computed(function () {
            var totalAttribute = 0;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // winter_wyvern_arctic_burn
                                case 'attack_range_bonus':
                                    totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                break;
                                // templar_assassin_psi_blades,sniper_take_aim
                                case 'bonus_attack_range':
                                // terrorblade_metamorphosis,troll_warlord_berserkers_rage
                                case 'bonus_range':
                                    if (ability.name() == 'terrorblade_metamorphosis') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                    }
                                    if (ability.name() == 'troll_warlord_berserkers_rage') {
                                        totalAttribute -= self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                    }
                                break;
                                // tiny_grow
                                case 'bonus_range_scepter':
                                    if (ability.name() == 'tiny_grow' && self.hasScepter()) {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                    }
                                break;
                                // enchantress_impetus
                                case 'bonus_attack_range_scepter':
                                    if (ability.name() == 'enchantress_impetus' && self.hasScepter()) {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                    }
                                break;
                            }
                        }
                        // lone_druid_true_form
                        if (ability.name() == 'lone_druid_true_form') {
                            totalAttribute -= 422;
                        }
                    }
                    else if (ability.level() > 0 && ability.name() == 'enchantress_impetus' && self.hasScepter()) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                              case 'bonus_attack_range_scepter':
                                totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                              break;
                            }
                        }
                    }
                }
                else if (ability.attackrange != undefined) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        // dragon_knight_elder_dragon_form
                        totalAttribute+=ability.attackrange();
                    }
                }
            }
            return totalAttribute;
        });
        
        self.getAttackSpeed = ko.computed(function () {
            var totalAttribute = 0;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // abaddon_frostmourne,troll_warlord_battle_trance
                                case 'attack_speed':
                                // visage_grave_chill
                                case 'attackspeed_bonus':
                                // mirana_leap
                                case 'leap_speedbonus_as':
                                // life_stealer
                                case 'attack_speed_bonus':
                                    totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                break;
                                // clinkz_strafe,ursa_overpower
                                case 'attack_speed_bonus_pct':
                                    if (ability.name() == 'clinkz_strafe' || ability.name() == 'ursa_overpower') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                    }
                                break;
                                // axe_culling_blade,necronomicon_archer_aoe
                                case 'speed_bonus':
                                    if (ability.name() == 'axe_culling_blade' || ability.name() == 'necronomicon_archer_aoe') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                    }
                                break;
                                // ancient_apparition_chilling_touch
                                case 'attack_speed_pct':
                                    if (ability.name() == 'ancient_apparition_chilling_touch') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                    }
                                break;
                                // beastmaster_inner_beast,lycan_feral_impulse,lone_druid_rabid,tiny_grow,phantom_assassin_phantom_strike,windrunner_focusfire,ogre_magi_bloodlust,centaur_khan_endurance_aura
                                case 'bonus_attack_speed':
                                    if (ability.name() == 'beastmaster_inner_beast' 
                                     || ability.name() == 'lycan_feral_impulse' 
                                     || ability.name() == 'lone_druid_rabid' 
                                     || ability.name() == 'tiny_grow' 
                                     || ability.name() == 'phantom_assassin_phantom_strike' 
                                     || ability.name() == 'windrunner_focusfire' 
                                     || ability.name() == 'ogre_magi_bloodlust'
                                     || ability.name() == 'centaur_khan_endurance_aura') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                    }
                                break;
                            }
                        }
                    }
                }
                else if (ability.attackspeed != undefined) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        // troll_warlord_fervor,wisp_overcharge,lina_fiery_soul,invoker_alacrity,invoker_wex,huskar_berserkers_blood
                        totalAttribute+=ability.attackspeed();
                    }
                }
            }
            return totalAttribute;
        });

        self.getAttackSpeedReduction = ko.computed(function () {
            var totalAttribute = 0;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // night_stalker_void,crystal_maiden_crystal_nova,ghost_frost_attack,ogre_magi_frost_armor,polar_furbolg_ursa_warrior_thunder_clap
                                case 'attackspeed_slow':
                                // lich_frost_armor,lich_frost_nova,enchantress_untouchable
                                case 'slow_attack_speed':
                                // beastmaster_primal_roar
                                case 'slow_attack_speed_pct':
                                // storm_spirit_overload
                                case 'overload_attack_slow':
                                    totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                break;
                                // omniknight_degen_aura
                                case 'speed_bonus':
                                    if (ability.name() == 'omniknight_degen_aura') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                    }
                                break;
                                // tusk_frozen_sigil,crystal_maiden_freezing_field
                                case 'attack_slow':
                                    if (ability.name() == 'crystal_maiden_freezing_field' && !self.hasScepter()) {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                    }
                                    else if (ability.name() == 'tusk_frozen_sigil') {
                                        totalAttribute -= self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                    }
                                break;
                                case 'attack_slow_scepter':
                                    if (ability.name() == 'crystal_maiden_freezing_field' && self.hasScepter()) {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                    }
                                break;
                                // faceless_void_time_walk
                                case 'attack_speed_pct':
                                    if (ability.name() == 'faceless_void_time_walk') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                    }
                                break;
                                // bounty_hunter_jinada
                                case 'bonus_attackspeed':
                                    if (ability.name() == 'bounty_hunter_jinada') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                    }
                                break;
                                // brewmaster_thunder_clap
                                case 'attack_speed_slow':
                                    if (ability.name() == 'brewmaster_thunder_clap') {
                                        totalAttribute -= self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                    }
                                break;
                                // medusa_stone_gaze
                                case 'slow':
                                    if (ability.name() == 'medusa_stone_gaze') {
                                        totalAttribute -= self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                    }
                                break;
                                // visage_grave_chill
                                case 'attackspeed_bonus':
                                    totalAttribute -= self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                break;
                                // abaddon_frostmourne
                                case 'attack_slow_tooltip':
                                    if (ability.name() == 'abaddon_frostmourne') {
                                        totalAttribute -= self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                    }
                                break;
                            }
                        }
                        if (ability.name() == 'enraged_wildkin_tornado') {
                            totalAttribute -= 15;
                        }
                    }
                }
                else if (ability.attackspeedreduction != undefined) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        // viper_viper_strike,viper_corrosive_skin,jakiro_liquid_fire,lich_chain_frost,sandking_epicenter,earth_spirit_rolling_boulder
                        totalAttribute+=ability.attackspeedreduction();
                    }
                }
            }
            return totalAttribute;
        });
        self.getBash = ko.computed(function () {
            var totalAttribute = 1;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // slardar_bash
                                case 'chance':
                                // sniper_headshot
                                case 'proc_chance':
                                    totalAttribute *= (1 - self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100);
                                break;
                            }
                        }
                    }
                }
                else if (ability.bash != undefined) {
                    // spirit_breaker_greater_bash,faceless_void_time_lock
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        totalAttribute *= (1 - ability.bash()/100);
                    }
                }
            }
            return totalAttribute;
        });    
        self.getBaseDamage = ko.computed(function () {
            var totalAttribute = 0;
            var totalMultiplier = 1;
            var sources = {};
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // tiny_grow,terrorblade_metamorphosis
                                case 'bonus_damage':
                                    if (ability.name() == 'tiny_grow' || ability.name() == 'terrorblade_metamorphosis') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                        sources[ability.name()] = {
                                            'damage': self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level()),
                                            'damageType': 'physical',
                                            'displayname': ability.displayname()
                                        }
                                    }
                                break;
                            }
                        }
                    }
                }
                else {
                    if (ability.baseDamageMultiplier != undefined) {
                        // earthshaker_enchant_totem
                        if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                            totalMultiplier += ability.baseDamageMultiplier()/100;
                            /*totalAttribute += ability.baseDamage();
                            sources[ability.name()] = {
                                'damage': ability.baseDamage(),
                                'damageType': 'physical',
                                'displayname': ability.displayname()
                            }*/
                        }
                    }
                    if (ability.baseDamage != undefined) {
                        // clinkz_death_pact
                        if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                            totalAttribute += ability.baseDamage();
                            sources[ability.name()] = {
                                'damage': ability.baseDamage(),
                                'damageType': 'physical',
                                'displayname': ability.displayname()
                            }
                        }
                    }
                }
            }
            return { sources: sources, total: totalAttribute, multiplier: totalMultiplier };
        });
        
        self.getSelfBaseDamageReductionPct = ko.computed(function () {
            var totalAttribute = 1;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // medusa_split_shot
                                case 'damage_modifier':
                                    totalAttribute *= (1 + self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100);
                                break;
                                // windrunner_focusfire
                                case 'focusfire_damage_reduction':
                                    if (!self.hasScepter()) {
                                        totalAttribute *= (1 + self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100);
                                    }
                                break;
                                case 'focusfire_damage_reduction_scepter':
                                    if (self.hasScepter()) {
                                        totalAttribute *= (1 + self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100);
                                    }
                                break;
                            }
                        }
                    }
                }
            }
            return totalAttribute;
        });
        
        self.getBaseDamageReductionPct = ko.computed(function () {
            var totalAttribute = 1;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // vengefulspirit_command_aura
                                case 'bonus_damage_pct':
                                    if (ability.name() == 'vengefulspirit_command_aura') {
                                        totalAttribute *= (1 - self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100);
                                    }
                                break;
                            }
                        }
                    }
                }
                else if (ability.baseDamageReductionPct != undefined) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        // nevermore_requiem
                        totalAttribute *= (1 + ability.baseDamageReductionPct()/100);
                    }
                }
            }
            return totalAttribute;
        });
        
        self.getBAT = ko.computed(function () {
            var totalAttribute = 0;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // troll_warlord_berserkers_rage,alchemist_chemical_rage,lone_druid_true_form,lycan_shapeshift
                                case 'base_attack_time':
                                    totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                break;
                            }
                        }
                    }
                }
            }
            return totalAttribute;
        });
        self.getBonusDamage = ko.computed(function () {
            var totalAttribute = 0;
            var sources = {};
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // broodmother_insatiable_hunger,luna_lunar_blessing,templar_assassin_refraction,templar_assassin_meld,troll_warlord_berserkers_rage,lone_druid_true_form_battle_cry
                                case 'bonus_damage':
                                    if (ability.name() == 'broodmother_insatiable_hunger' || ability.name() == 'luna_lunar_blessing'
                                     || ability.name() == 'templar_assassin_refraction' || ability.name() == 'templar_assassin_meld'
                                     || ability.name() == 'troll_warlord_berserkers_rage' || ability.name() == 'lone_druid_true_form_battle_cry') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                        sources[ability.name()] = {
                                            'damage': self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level()),
                                            'damageType': 'physical',
                                            'displayname': ability.displayname()
                                        }
                                    }
                                break;
                                // lycan_howl
                                case 'hero_bonus_damage':
                                    totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                    sources[ability.name()] = {
                                        'damage': self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level()),
                                        'damageType': 'physical',
                                        'displayname': ability.displayname()
                                    }
                                break;
                            }
                        }
                        if (ability.name() == 'storm_spirit_overload') {
                            totalAttribute += self.getAbilityPropertyValue(ability, 'damage');
                            sources[ability.name()] = {
                                'damage': self.getAbilityPropertyValue(ability, 'damage'),
                                'damageType': 'magic',
                                'displayname': ability.displayname()
                            }                        
                        }
                    }
                }
                else if (ability.bonusDamage != undefined && ability.bonusDamage() != 0) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        // nevermore_necromastery,ursa_fury_swipes,ursa_enrage,invoker_alacrity,invoker_exort,elder_titan_ancestral_spirit,spectre_desolate,razor_static_link
                        totalAttribute+=ability.bonusDamage();
                        sources[ability.name()] = {
                            'damage': ability.bonusDamage(),
                            'damageType': ability.name() == 'spectre_desolate' ? 'pure' : 'physical',
                            'displayname': ability.displayname()
                        }
                    }
                }
            }
            return { sources: sources, total: totalAttribute };
        });

        self.getBonusDamagePercent = ko.computed(function () {
            var totalAttribute = 0;
            var sources = {};
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // bloodseeker_bloodrage
                                case 'damage_increase_pct':
                                    if (ability.name() == 'bloodseeker_bloodrage') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                        sources[ability.name()] = {
                                            'damage': self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100,
                                            'damageType': 'physical',
                                            'displayname': ability.displayname()
                                        }
                                    }
                                break;
                                // magnataur_empower,vengefulspirit_command_aura,alpha_wolf_command_aura
                                case 'bonus_damage_pct':
                                    if (ability.name() == 'magnataur_empower' || ability.name() == 'vengefulspirit_command_aura' || ability.name() == 'alpha_wolf_command_aura') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                        sources[ability.name()] = {
                                            'damage': self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100,
                                            'damageType': 'physical',
                                            'displayname': ability.displayname()
                                        }
                                    }
                                break;
                                // sven_gods_strength
                                case 'gods_strength_damage':
                                    if (ability.name() == 'sven_gods_strength' && self.hero != undefined && self.hero.selectedHero().heroName == 'sven') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                        sources[ability.name()] = {
                                            'damage': self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100,
                                            'damageType': 'physical',
                                            'displayname': ability.displayname()
                                        }
                                    }
                                break;
                                case 'gods_strength_damage_scepter':
                                    if (ability.name() == 'sven_gods_strength' && self.hero == undefined) {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                        sources[ability.name()] = {
                                            'damage': self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100,
                                            'damageType': 'physical',
                                            'displayname': ability.displayname()
                                        }
                                    }
                                break;
                            }
                        }
                    }
                }
                else if (ability.bonusDamagePct != undefined && ability.bonusDamagePct() != 0) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        // bloodseeker_bloodrage
                        /*totalAttribute+=ability.bonusDamagePct()/100;
                        sources[ability.name()] = {
                            'damage': ability.bonusDamagePct()/100,
                            'damageType': 'physical',
                            'displayname': ability.displayname()
                        }*/
                    }
                }
            }
            return { sources: sources, total: totalAttribute };
        });

        self.getBonusDamageBackstab = ko.computed(function () {
            var totalAttribute1 = 0;
            var totalAttribute2 = 0;
            var sources = [];
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (ability.name() == 'riki_backstab') {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // riki_backstab
                                case 'damage_multiplier':
                                    totalAttribute1 += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                    sources.push({
                                        'damage': self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level()),
                                        'damageType': 'physical',
                                        'displayname': ability.displayname()
                                    });
                                break;
                            }
                        }/*
                        if (ability.bonusDamageBackstab != undefined) {
                            console.log('bonusDamageBackstab');
                            // damage_multiplier
                            totalAttribute2+=ability.bonusDamageBackstab();
                            sources.push({
                                'damage': ability.bonusDamageBackstab(),
                                'damageType': 'physical',
                                'displayname': ability.displayname()
                            });
                        }
                        */
                    }
                }
            }
            return { sources: sources, total: [totalAttribute1,totalAttribute2] };
        });
        
        self.getBonusDamagePrecisionAura = ko.computed(function () {
            var totalAttribute1 = 0;
            var totalAttribute2 = 0;
            var sources = [];
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (ability.name() == 'drow_ranger_trueshot') {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // drow_ranger_trueshot
                                case 'trueshot_ranged_damage':
                                    totalAttribute1 += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                    sources.push({
                                        'damage': self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100,
                                        'damageType': 'physical',
                                        'displayname': ability.displayname()
                                    });
                                break;
                            }
                        }
                        if (ability.bonusDamagePrecisionAura != undefined) {
                            // drow_ranger_trueshot
                            totalAttribute2+=ability.bonusDamagePrecisionAura();
                            sources.push({
                                'damage': ability.bonusDamagePrecisionAura(),
                                'damageType': 'physical',
                                'displayname': ability.displayname()
                            });
                        }
                    }
                }
            }
            return { sources: sources, total: [totalAttribute1,totalAttribute2] };
        });
        
        self.getBonusDamageReduction = ko.computed(function () {
            var totalAttribute = 0;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // bane_enfeeble
                                case 'enfeeble_attack_reduction':
                                    totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                break;
                            }
                        }
                    }
                }
                else if (ability.bonusDamageReduction != undefined) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        // rubick_fade_bolt,razor_static_link
                        totalAttribute+=ability.bonusDamageReduction();
                    }
                }
            }
            return totalAttribute;
        });
        
        self.getBonusDamageReductionPct = ko.computed(function () {
            var totalAttribute = 1;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // medusa_split_shot
                                case 'damage_modifier':
                                    totalAttribute *= (1 + self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100);
                                break;
                                // windrunner_focusfire
                                case 'focusfire_damage_reduction':
                                    if (!self.hasScepter()) {
                                        totalAttribute *= (1 + self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100);
                                    }
                                break;
                                case 'focusfire_damage_reduction_scepter':
                                    if (self.hasScepter()) {
                                        totalAttribute *= (1 + self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100);
                                    }
                                break;
                            }
                        }
                    }
                }
            }
            return totalAttribute;
        });

        self.getDamageAmplification = ko.computed(function () {
            var totalAttribute = 1;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    /*if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // bane_enfeeble
                                case 'enfeeble_attack_reduction':
                                    totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                break;
                            }
                        }
                    }*/
                }
                else if (ability.damageAmplification != undefined) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        // undying_flesh_golem
                        totalAttribute *= (1 + ability.damageAmplification()/100);
                    }
                }
            }
            return totalAttribute;
        });
        
        self.getDamageReduction = ko.computed(function () {
            var totalAttribute = 1;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // bloodseeker_bloodrage
                                case 'damage_increase_pct':
                                    if (ability.name() == 'bloodseeker_bloodrage') {
                                        totalAttribute *= (1 + self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100);
                                    }
                                break;
                            }
                        }
                        // kunkka_ghostship
                        if (ability.name() == 'kunkka_ghostship') {
                            totalAttribute *= (1 - 50/100);
                        }
                    }
                }
                else if (ability.damageReduction != undefined) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        // wisp_overcharge,bristleback_bristleback,spectre_dispersion,medusa_mana_shield,ursa_enrage
                        totalAttribute *= (1 + ability.damageReduction()/100);
                    }
                }
            }
            return totalAttribute;
        });

        self.getCritSource = ko.computed(function () {
            var sources = {};
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        switch(ability.name()) {
                            // phantom_assassin_coup_de_grace,brewmaster_drunken_brawler,chaos_knight_chaos_strike,lycan_shapeshift,skeleton_king_mortal_strike,juggernaut_blade_dance,alpha_wolf_critical_strike,giant_wolf_critical_strike
                            case 'phantom_assassin_coup_de_grace':
                                if (sources[ability.name()] == undefined) {
                                    sources[ability.name()] = {
                                        'chance': self.getAbilityAttributeValue(self.abilities()[i].attributes(), 'crit_chance', ability.level())/100,
                                        'multiplier': self.getAbilityAttributeValue(self.abilities()[i].attributes(), 'crit_bonus', ability.level())/100,
                                        'count': 1,
                                        'displayname': ability.displayname()
                                    }
                                }
                                else {
                                    sources[ability.name()].count += 1;
                                }
                            break;
                            case 'brewmaster_drunken_brawler':
                                if (sources[ability.name()] == undefined) {
                                    sources[ability.name()] = {
                                        'chance': self.getAbilityAttributeValue(self.abilities()[i].attributes(), 'crit_chance', ability.level())/100,
                                        'multiplier': self.getAbilityAttributeValue(self.abilities()[i].attributes(), 'crit_multiplier', ability.level())/100,
                                        'count': 1,
                                        'displayname': ability.displayname()
                                    }
                                }
                                else {
                                    sources[ability.name()].count += 1;
                                }
                            break;
                            case 'chaos_knight_chaos_strike':
                            case 'lycan_shapeshift':
                                if (sources[ability.name()] == undefined) {
                                    sources[ability.name()] = {
                                        'chance': self.getAbilityAttributeValue(self.abilities()[i].attributes(), 'crit_chance', ability.level())/100,
                                        'multiplier': self.getAbilityAttributeValue(self.abilities()[i].attributes(), 'crit_multiplier', ability.level())/100,
                                        'count': 1,
                                        'displayname': ability.displayname()
                                    }
                                }
                                else {
                                    sources[ability.name()].count += 1;
                                }
                            break;
                            case 'skeleton_king_mortal_strike':
                                if (sources[ability.name()] == undefined) {
                                    sources[ability.name()] = {
                                        'chance': self.getAbilityAttributeValue(self.abilities()[i].attributes(), 'crit_chance', ability.level())/100,
                                        'multiplier': self.getAbilityAttributeValue(self.abilities()[i].attributes(), 'crit_mult', ability.level())/100,
                                        'count': 1,
                                        'displayname': ability.displayname()
                                    }
                                }
                                else {
                                    sources[ability.name()].count += 1;
                                }
                            break;
                            case 'juggernaut_blade_dance':
                                if (sources[ability.name()] == undefined) {
                                    sources[ability.name()] = {
                                        'chance': self.getAbilityAttributeValue(self.abilities()[i].attributes(), 'blade_dance_crit_chance', ability.level())/100,
                                        'multiplier': self.getAbilityAttributeValue(self.abilities()[i].attributes(), 'blade_dance_crit_mult', ability.level())/100,
                                        'count': 1,
                                        'displayname': ability.displayname()
                                    }
                                }
                                else {
                                    sources[ability.name()].count += 1;
                                }
                            break;
                            case 'alpha_wolf_critical_strike':
                            case 'giant_wolf_critical_strike':
                                if (sources[ability.name()] == undefined) {
                                    sources[ability.name()] = {
                                        'chance': self.getAbilityAttributeValue(self.abilities()[i].attributes(), 'crit_chance', ability.level())/100,
                                        'multiplier': self.getAbilityAttributeValue(self.abilities()[i].attributes(), 'crit_mult', ability.level())/100,
                                        'count': 1,
                                        'displayname': ability.displayname()
                                    }
                                }
                                else {
                                    sources[ability.name()].count += 1;
                                }
                            break;
                        }
                    }
                }
            }
            return sources;
        });    

        self.getCleaveSource = ko.computed(function () {
            var sources = {};
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        switch(ability.name()) {
                            // magnataur_empower
                            case 'magnataur_empower':
                                if (sources[ability.name()] == undefined) {
                                    sources[ability.name()] = {
                                        'radius': self.getAbilityAttributeValue(self.abilities()[i].attributes(), 'cleave_radius', ability.level()),
                                        'magnitude': self.getAbilityAttributeValue(self.abilities()[i].attributes(), 'cleave_damage_pct', ability.level())/100,
                                        'count': 1,
                                        'displayname': ability.displayname()
                                    }
                                }
                                else {
                                    sources[ability.name()].count += 1;
                                }
                            break;
                            // sven_great_cleave
                            case 'sven_great_cleave':
                                if (sources[ability.name()] == undefined) {
                                    sources[ability.name()] = {
                                        'radius': self.getAbilityAttributeValue(self.abilities()[i].attributes(), 'great_cleave_radius', ability.level()),
                                        'magnitude': self.getAbilityAttributeValue(self.abilities()[i].attributes(), 'great_cleave_damage', ability.level())/100,
                                        'count': 1,
                                        'displayname': ability.displayname()
                                    }
                                }
                                else {
                                    sources[ability.name()].count += 1;
                                }
                            break;
                            // kunkka_tidebringer
                            case 'kunkka_tidebringer':
                                if (sources[ability.name()] == undefined) {
                                    sources[ability.name()] = {
                                        'radius': self.getAbilityAttributeValue(self.abilities()[i].attributes(), 'radius', ability.level()),
                                        'magnitude': 1,
                                        'count': 1,
                                        'displayname': ability.displayname()
                                    }
                                }
                                else {
                                    sources[ability.name()].count += 1;
                                }
                            break;
                            // tiny_grow
                            case 'tiny_grow':
                                if (self.hasScepter()) {
                                    if (sources[ability.name()] == undefined) {
                                        sources[ability.name()] = {
                                            'radius': self.getAbilityAttributeValue(self.abilities()[i].attributes(), 'bonus_cleave_radius_scepter', ability.level()),
                                            'magnitude': self.getAbilityAttributeValue(self.abilities()[i].attributes(), 'bonus_cleave_damage_scepter', ability.level())/100,
                                            'count': 1,
                                            'displayname': ability.displayname()
                                        }
                                    }
                                    else {
                                        sources[ability.name()].count += 1;
                                    }
                                }
                            break;
                        }
                    }
                }
            }
            return sources;
        });    
        
        self.getCritChance = ko.computed(function () {
            var totalAttribute = 1;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // phantom_assassin_coup_de_grace,brewmaster_drunken_brawler,chaos_knight_chaos_strike,lycan_shapeshift,skeleton_king_mortal_strike
                                case 'crit_chance':
                                    totalAttribute *= (1 - self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100);
                                break;
                            }
                        }
                    }
                }
            }
            return totalAttribute;
        });            
        
        self.getEvasion = ko.computed(function () {
            var totalAttribute = 1;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // phantom_assassin_blur
                                case 'bonus_evasion':
                                // brewmaster_drunken_brawler
                                case 'dodge_chance':
                                    totalAttribute *= (1 - self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100);
                                break;
                            }
                        }
                    }
                }
            }
            return totalAttribute;
        });
        
        self.getEvasionBacktrack = ko.computed(function () {
            var totalAttribute = 1;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // faceless_void_backtrack
                                case 'dodge_chance_pct':
                                    totalAttribute *= (1 - self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100);
                                break;
                            }
                        }
                    }
                }
            }
            return totalAttribute;
        });
        
        self.getMissChance = ko.computed(function () {
            var totalAttribute = 1;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // broodmother_incapacitating_bite,brewmaster_drunken_haze
                                case 'miss_chance':
                                // riki_smoke_screen,keeper_of_the_light_blinding_light,tinker_laser
                                case 'miss_rate':
                                    totalAttribute *= (1 - self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100);
                                break;
                            }
                        }
                    }
                }
                else if (ability.missChance != undefined) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        // night_stalker_crippling_fear
                        totalAttribute*=(1-ability.missChance()/100);
                    }
                }
            }
            return totalAttribute;
        });
        
        self.getLifesteal = ko.computed(function () {
            var totalAttribute = 0;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // skeleton_king_vampiric_aura
                                case 'vampiric_aura':
                                // broodmother_insatiable_hunger
                                case 'lifesteal_pct':
                                    totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                break;
                            }
                        }
                    }
                }
                else if (ability.lifesteal != undefined) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        // life_stealer_open_wounds
                        totalAttribute+=ability.lifesteal();
                    }
                }
            }
            return totalAttribute;
        });
        
        self.getMagicResist = ko.computed(function () {
            var totalAttribute = 1;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // antimage_spell_shield
                                case 'spell_shield_resistance':
                                    totalAttribute *= (1 - self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100);
                                break;
                                // phantom_lancer_phantom_edge
                                case 'magic_resistance_pct':
                                    if (ability.name() == 'phantom_lancer_phantom_edge') {
                                        totalAttribute *= (1 - self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100);
                                    }
                                break;
                                // rubick_null_field
                                case 'magic_damage_reduction_pct':
                                    if (ability.name() == 'rubick_null_field') {
                                        totalAttribute *= (1 - self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100);
                                    }
                                break;
                            }
                        }
                    }
                }
                else if (ability.magicResist != undefined) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        // huskar_berserkers_blood,viper_corrosive_skin,visage_gravekeepers_cloak
                        totalAttribute *= (1 - ability.magicResist()/100);
                    }
                }
            }
            return totalAttribute;
        });

        self.getMagicResistReduction = ko.computed(function () {
            var totalAttribute = 1;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // ancient_apparition_ice_vortex
                                case 'spell_resist_pct':
                                // pugna_decrepify
                                case 'bonus_spell_damage_pct':
                                // skywrath_mage_ancient_seal
                                case 'resist_debuff':
                                    totalAttribute *= (1 - self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100);
                                break;
                                // elder_titan_natural_order
                                case 'magic_resistance_pct':
                                    totalAttribute *= (1 - self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100);
                                break;
                            }
                        }
                    }
                }
            }
            return totalAttribute;
        });
        
        self.getMovementSpeedFlat = ko.computed(function () {
            var totalAttribute = 0;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // alchemist_chemical_rage
                                case 'bonus_movespeed':
                                    if (ability.name() == 'alchemist_chemical_rage') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                    }
                                break;
                                // tiny_grow
                                case 'bonus_movement_speed':
                                    if (ability.name() == 'tiny_grow') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                    }
                                break;
                                // troll_warlord_berserkers_rage
                                case 'bonus_move_speed':
                                    if (ability.name() == 'troll_warlord_berserkers_rage') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                    }                                
                                break;
                                // lone_druid_true_form
                                case 'speed_loss':
                                    totalAttribute -= self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                break;
                            }
                        }
                    }
                }
                else if (ability.movementSpeedFlat != undefined) {
                    // dragon_knight_elder_dragon_form
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        totalAttribute+=ability.movementSpeedFlat();
                    }
                }
            }
            return totalAttribute;
        });
        
        self.getMovementSpeedPercent = ko.computed(function () {
            var totalAttribute = 0;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // abaddon_frostmourne 
                                case 'move_speed_pct':
                                // bounty_hunter_track 
                                case 'bonus_move_speed_pct':
                                // mirana_leap 
                                case 'leap_speedbonus':
                                // sven_warcry 
                                case 'warcry_movespeed':
                                // clinkz_wind_walk
                                case 'move_speed_bonus_pct':
                                // windrunner_windrun
                                case 'movespeed_bonus_pct':
                                    totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                break;
                                // broodmother_spin_web,spectre_spectral_dagger
                                case 'bonus_movespeed':
                                    if (ability.name() == 'broodmother_spin_web' || ability.name() == 'spectre_spectral_dagger') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                    }
                                break;
                                // axe_culling_blade,necronomicon_archer_aoe
                                case 'speed_bonus':
                                    if (ability.name() == 'axe_culling_blade' || ability.name() == 'necronomicon_archer_aoe') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                    }
                                break;
                                // nyx_assassin_vendetta 
                                case 'movement_speed':
                                    if (ability.name() == 'nyx_assassin_vendetta') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                    }
                                break;
                                // spirit_breaker_empowering_haste
                                case 'bonus_movespeed_pct':
                                    if (ability.name() == 'spirit_breaker_empowering_haste') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                    }
                                break;
                                // ogre_magi_bloodlust,death_prophet_witchcraft,kobold_taskmaster_speed_aura
                                case 'bonus_movement_speed':
                                    if (ability.name() == 'ogre_magi_bloodlust' || ability.name() == 'death_prophet_witchcraft' || ability.name() == 'kobold_taskmaster_speed_aura') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                    }
                                break;
                                // razor_unstable_current,phantom_lancer_doppelwalk
                                case 'movement_speed_pct':
                                    if (ability.name() == 'razor_unstable_current' || ability.name() == 'phantom_lancer_doppelwalk') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                    }
                                break;
                                // treant_natures_guise,lone_druid_rabid
                                case 'bonus_move_speed':
                                    if (ability.name() == 'treant_natures_guise' || ability.name() == 'lone_druid_rabid') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                    }
                                break;
                                // wisp_tether
                                case 'movespeed':
                                    if (ability.name() == 'wisp_tether') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                    }
                                break;
                                // kunkka_ghostship,visage_grave_chill
                                case 'movespeed_bonus':
                                    if (ability.name() == 'kunkka_ghostship' || ability.name() == 'visage_grave_chill') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                    }                                
                                break;
                            }
                        }
                    }
                }
                else if (ability.movementSpeedPct != undefined) {
                    // axe_battle_hunger,bristleback_warpath,spirit_breaker_greater_bash,lina_fiery_soul,invoker_ghost_walk,invoker_wex,elder_titan_ancestral_spirit
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        totalAttribute+=ability.movementSpeedPct()/100;
                    }
                }
            }
            return totalAttribute;
        });

        self.getMovementSpeedPercentReduction = ko.computed(function () {
            var totalAttribute = 0;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // crystal_maiden_freezing_field
                                case 'movespeed_slow':
                                    if (ability.name() == 'crystal_maiden_freezing_field' && !self.hasScepter()) {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                    }
                                break;
                                case 'movespeed_slow_scepter':
                                    if (ability.name() == 'crystal_maiden_freezing_field' && self.hasScepter()) {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                    }
                                break;
                                // elder_titan_earth_splitter,magnataur_skewer,abaddon_frostmourne 
                                case 'slow_pct':
                                    totalAttribute -= self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                break;
                                // night_stalker_void,crystal_maiden_crystal_nova,ghost_frost_attack,ogre_magi_frost_armor,polar_furbolg_ursa_warrior_thunder_clap
                                case 'movespeed_slow':
                                    if (ability.name() != 'crystal_maiden_freezing_field') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                    }
                                break;
                                // lich_frost_armor,lich_frost_nova,enchantress_enchant
                                case 'slow_movement_speed':
                                // beastmaster_primal_roar
                                case 'slow_movement_speed_pct':
                                // drow_ranger_frost_arrows
                                case 'frost_arrows_movement_speed':
                                // skeleton_king_hellfire_blast
                                case 'blast_slow':
                                // slardar_slithereen_crush
                                case 'crush_extra_slow':
                                // storm_spirit_overload:
                                case 'overload_move_slow':
                                // windrunner_windrun
                                case 'enemy_movespeed_bonus_pct':
                                    totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                break;
                                // phantom_assassin_stifling_dagger,tusk_frozen_sigil
                                case 'move_slow':
                                    if (ability.name() == 'phantom_assassin_stifling_dagger') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                    }
                                    else if (ability.name() == 'tusk_frozen_sigil') {
                                        totalAttribute -= self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                    }
                                break;
                                // invoker_ice_wall,medusa_stone_gaze,wisp_tether
                                case 'slow':
                                    if (ability.name() == 'medusa_stone_gaze') {
                                        totalAttribute -= self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                    }
                                    else {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                    }
                                break;
                                // broodmother_incapacitating_bite,bounty_hunter_jinada,spectre_spectral_dagger,winter_wyvern_arctic_burn
                                case 'bonus_movespeed':
                                    if (ability.name() == 'broodmother_incapacitating_bite' || ability.name() == 'bounty_hunter_jinada' || ability.name() == 'winter_wyvern_arctic_burn' || ability.name() == 'winter_wyvern_splinter_blast') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                    }
                                    else if (ability.name() == 'spectre_spectral_dagger') {
                                        totalAttribute -= self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                    }
                                break;
                                // omniknight_degen_aura
                                case 'speed_bonus':
                                    if (ability.name() == 'omniknight_degen_aura') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                    }
                                break;
                                // tidehunter_gush
                                case 'movement_speed':
                                    if (ability.name() == 'tidehunter_gush') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                    }
                                break;
                                // pugna_decrepify,chen_penitence
                                case 'bonus_movement_speed':
                                    if (ability.name() == 'pugna_decrepify' || ability.name() == 'chen_penitence') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                    }
                                break;
                                // ancient_apparition_ice_vortex,phantom_lancer_spirit_lance,skywrath_mage_concussive_shot,faceless_void_time_walk
                                case 'movement_speed_pct':
                                    if (ability.name() == 'ancient_apparition_ice_vortex' || ability.name() == 'phantom_lancer_spirit_lance' || ability.name() == 'faceless_void_time_walk') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                    }
                                    else if (ability.name() == 'skywrath_mage_concussive_shot') {
                                        totalAttribute -= self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                    }
                                break;
                                // razor_unstable_current
                                case 'slow_amount':
                                    if (ability.name() == 'razor_unstable_current') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                    }
                                break;
                                // brewmaster_drunken_haze,brewmaster_thunder_clap,treant_leech_seed
                                case 'movement_slow':
                                    if (ability.name() == 'brewmaster_drunken_haze' || ability.name() == 'brewmaster_thunder_clap') {
                                        totalAttribute -= self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                    }
                                    else if (ability.name() == 'ursa_earthshock' || ability.name() == 'treant_leech_seed') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                    }
                                break;
                                // skeleton_king_reincarnation
                                case 'movespeed':
                                    if (ability.name() == 'skeleton_king_reincarnation') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                    }
                                break;
                                // kunkka_torrent,visage_grave_chill
                                case 'movespeed_bonus':
                                    if (ability.name() == 'kunkka_torrent') {
                                        totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                    }
                                    else if (ability.name() == 'visage_grave_chill') {
                                        totalAttribute -= self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                    }
                                break;
                            }
                        }
                        if (ability.name() == 'satyr_trickster_purge') {
                            totalAttribute -= 80/100;
                        }
                        else if (ability.name() == 'enraged_wildkin_tornado') {
                            totalAttribute -= 15/100;
                        }
                    }
                }
                else if (ability.movementSpeedPctReduction != undefined) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        // axe_battle_hunger,batrider_sticky_napalm,shredder_chakram,meepo_geostrike,life_stealer_open_wounds,
                        // venomancer_poison_sting,viper_viper_strike,viper_corrosive_skin,viper_poison_attack,venomancer_venomous_gale,treant_leech_seed
                        // lich_chain_frost,sniper_shrapnel,centaur_stampede,huskar_life_break,jakiro_dual_breath,meepo_geostrike,sandking_epicenter
                        // earth_spirit_rolling_boulder,invoker_ghost_walk,invoker_ice_wall,elder_titan_earth_splitter
                        // undying_flesh_golem,templar_assassin_psionic_trap,nevermore_requiem,queenofpain_shadow_strike
                        totalAttribute+=ability.movementSpeedPctReduction()/100;
                    }
                }
            }
            return totalAttribute;
        });

        self.getTurnRateReduction = ko.computed(function () {
            var totalAttribute = 0;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // medusa_stone_gaze
                                case 'slow':
                                    if (ability.name() == 'medusa_stone_gaze') {
                                        totalAttribute -= self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                    }
                                break;
                            }
                        }
                    }
                }
                else if (ability.turnRateReduction != undefined) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        // batrider_sticky_napalm
                        totalAttribute+=ability.turnRateReduction()/100;
                    }
                }
            }
            return totalAttribute;
        });
        
        self.getVisionRangeNight = ko.computed(function () {
            var totalAttribute = 0;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // winter_wyvern_arctic_burn
                                case 'night_vision_bonus':
                                // lycan_shapeshift,luna_lunar_blessing
                                case 'bonus_night_vision':
                                    totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level());
                                break;
                            }
                        }
                    }
                }
                else if (ability.visionnight != undefined) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        // 
                        totalAttribute+=ability.visionnight();
                    }
                }
            }
            return totalAttribute;
        });

        self.getVisionRangePctReduction = ko.computed(function () {
            var totalAttribute = 0;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // night_stalker_darkness
                                case 'blind_percentage':
                                    totalAttribute += self.getAbilityAttributeValue(self.abilities()[i].attributes(), attribute.name(), ability.level())/100;
                                break;
                            }
                        }
                    }
                }
            }
            return totalAttribute;
        });

        self.setEvasion = ko.computed(function () {
            var totalAttribute = 0;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                    if (ability.name() == 'windrunner_windrun') {
                        return 1;
                    }
                }
            }
            return totalAttribute;
        });
        
        self.setMovementSpeed = ko.computed(function () {
            var MAX_MOVESPEED = 522;
            var MIN_MOVESPEED = 100;
            var totalAttribute = 0;
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                    if (ability.name() == 'spirit_breaker_charge_of_darkness') {
                        return self.getAbilityAttributeValue(ability.attributes(), 'movement_speed', ability.level());
                    }
                    if (ability.name() == 'dark_seer_surge') {
                        return MAX_MOVESPEED;
                    }
                    if (ability.name() == 'centaur_stampede') {
                        return MAX_MOVESPEED;
                    }
                    if (ability.name() == 'lycan_shapeshift') {
                        return MAX_MOVESPEED;
                    }
                    if (ability.name() == 'lion_voodoo' || ability.name() == 'shadow_shaman_voodoo') {
                        return MIN_MOVESPEED;
                    }
                }
            }
            return totalAttribute;
        });

        self.getBashSource = function (attacktype) {
            var sources = {};
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // sniper_headshot
                                case 'proc_chance':
                                    if (sources[ability.name()] == undefined && ability.name() == 'sniper_headshot') {
                                        sources[ability.name()] = {
                                            'chance': self.getAbilityAttributeValue(ability.attributes(), attribute.name(), ability.level())/100,
                                            'damage': self.getAbilityPropertyValue(ability, 'damage'),
                                            'count': 1,
                                            'damageType': 'physical',
                                            'displayname': ability.displayname()
                                        }
                                    }
                                break;
                                // slardar_bash
                                case 'chance':
                                    if (sources[ability.name()] == undefined && ability.name() == 'slardar_bash') {
                                        sources[ability.name()] = {
                                            'chance': self.getAbilityAttributeValue(ability.attributes(), attribute.name(), ability.level())/100,
                                            'damage': self.getAbilityAttributeValue(ability.attributes(), 'bonus_damage', ability.level()),
                                            'count': 1,
                                            'damageType': 'physical',
                                            'displayname': ability.displayname()
                                        }
                                    }
                                break;
                            }
                        }
                    }
                }
                else if (ability.bashBonusDamage != undefined) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        // faceless_void_time_lock
                        if (sources[ability.name()] == undefined && ability.name() == 'faceless_void_time_lock') {
                            sources[ability.name()] = {
                                'chance': ability.bash()/100,
                                'damage': ability.bashBonusDamage(),
                                'count': 1,
                                'damageType': 'magic',
                                'displayname': ability.displayname()
                            }
                        }
                        // spirit_breaker_greater_bash
                        if (sources[ability.name()] == undefined && ability.name() == 'spirit_breaker_greater_bash') {
                            sources[ability.name()] = {
                                'chance': ability.bash()/100,
                                'damage': ability.bashBonusDamage()/100,
                                'count': 1,
                                'damageType': 'magic',
                                'displayname': ability.displayname()
                            }
                        }
                    }
                }
            }

            return sources;
        };
        
        self.getOrbSource = function () {
            var sources = {};
            for (var i = 0; i < self.abilities().length; i++) {
                var ability = self.abilities()[i];
                if (!(ability.name() in self.abilityData)) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        for (var j = 0; j < self.abilities()[i].attributes().length; j++) {
                            var attribute = self.abilities()[i].attributes()[j];
                            switch(attribute.name()) {
                                // antimage_mana_break
                                case 'mana_per_hit':
                                    if (sources[ability.name()] == undefined && ability.name() == 'antimage_mana_break') {
                                        sources[ability.name()] = {
                                            'damage': self.getAbilityAttributeValue(ability.attributes(), attribute.name(), ability.level()) 
                                                    * self.getAbilityAttributeValue(ability.attributes(), 'damage_per_burn', ability.level()),
                                            'damageType': 'physical',
                                            'displayname': ability.displayname()
                                        }
                                    }
                                break;
                                // clinkz_searing_arrows
                                case 'damage_bonus':
                                    if (sources[ability.name()] == undefined && ability.name() == 'clinkz_searing_arrows') {
                                        sources[ability.name()] = {
                                            'damage': self.getAbilityAttributeValue(ability.attributes(), attribute.name(), ability.level()),
                                            'damageType': 'physical',
                                            'displayname': ability.displayname()
                                        }
                                    }
                                // silencer_glaives_of_wisdom
                                case 'intellect_damage_pct':
                                    if (sources[ability.name()] == undefined && ability.name() == 'silencer_glaives_of_wisdom') {
                                        sources[ability.name()] = {
                                            'damage': self.getAbilityAttributeValue(ability.attributes(), attribute.name(), ability.level())/100 * self.hero.totalInt(),
                                            'damageType': 'pure',
                                            'displayname': ability.displayname()
                                        }
                                    }
                                break;
                            }
                        }
                    }
                }
                else if (ability.bonusDamageOrb != undefined) {
                    if (ability.level() > 0 && (ability.isActive() || (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') != -1))) {
                        // obsidian_destroyer_arcane_orb
                        if (sources[ability.name()] == undefined && ability.name() == 'obsidian_destroyer_arcane_orb') {
                            sources[ability.name()] = {
                                'damage': ability.bonusDamageOrb(),
                                'damageType': 'pure',
                                'displayname': ability.displayname()
                            }
                        }
                    }
                }
            }
            
            return sources;
        };
        
        self.toggleAbility = function (index, data, event) {
            if (self.abilities()[index()].behavior().indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') < 0) {
                if (self.abilities()[index()].isActive()) {
                    self.abilities()[index()].isActive(false);
                }
                else {
                    self.abilities()[index()].isActive(true);
                }
                
                if (self.abilities()[index()].name() == 'lycan_shapeshift') {
                    self.isShapeShiftActive(self.abilities()[index()].isActive());
                }
            }
        }.bind(this);

        self.toggleAbilityDetail = function (index, data, event) {
            if (self.abilities()[index()].isDetail()) {
                self.abilities()[index()].isDetail(false);
            }
            else {
                self.abilities()[index()].isDetail(true);
            }
        }.bind(this);
        
        self.getAbilityTooltipData = function (hero, el) {
            return my.prototype.getAbilityTooltipData(hero, el);
        }

        self.levelUpAbility = function (index, data, event, hero) {
            if (self.abilities()[index()].level() < hero.getAbilityLevelMax(data) && hero.availableSkillPoints() > 0 ) {
                switch(self.abilities()[index()].abilitytype()) {
                    case 'DOTA_ABILITY_TYPE_ULTIMATE':
                        if (hero.selectedHero().heroName == 'invoker') {
                            if (
                                (self.abilities()[index()].level() == 0) && (parseInt(hero.selectedHeroLevel()) >= 2) ||
                                (self.abilities()[index()].level() == 1) && (parseInt(hero.selectedHeroLevel()) >= 7) ||
                                (self.abilities()[index()].level() == 2) && (parseInt(hero.selectedHeroLevel()) >= 11) ||
                                (self.abilities()[index()].level() == 3) && (parseInt(hero.selectedHeroLevel()) >= 17)
                            ) {
                                self.abilities()[index()].level(self.abilities()[index()].level()+1);
                                hero.skillPointHistory.push(index());
                            }
                        }
                        else if (hero.selectedHero().heroName == 'meepo') {
                            if (self.abilities()[index()].level() * 7 + 3 <= parseInt(hero.selectedHeroLevel())) {
                                self.abilities()[index()].level(self.abilities()[index()].level()+1);
                                hero.skillPointHistory.push(index());
                            }
                        }
                        else {
                            if ((self.abilities()[index()].level()+1) * 5 + 1 <= parseInt(hero.selectedHeroLevel())) {
                                self.abilities()[index()].level(self.abilities()[index()].level()+1);
                                hero.skillPointHistory.push(index());
                            }
                        }
                    break;
                    default:
                        if (self.abilities()[index()].level() * 2 + 1 <= parseInt(hero.selectedHeroLevel())) {
                            self.abilities()[index()].level(self.abilities()[index()].level()+1);
                            hero.skillPointHistory.push(index());
                        }
                    break;
                }
                switch (self.abilities()[index()].name()) {
                    case 'beastmaster_call_of_the_wild':
                    case 'chen_test_of_faith':
                    case 'morphling_morph_agi':
                    case 'shadow_demon_shadow_poison':
                        self.abilities()[index() + 1].level(self.abilities()[index()].level());
                    break;
                    case 'morphling_morph_str':
                        self.abilities()[index() - 1].level(self.abilities()[index()].level());
                    break;
                    case 'keeper_of_the_light_spirit_form':
                        self.abilities()[index() - 1].level(self.abilities()[index()].level());
                        self.abilities()[index() - 2].level(self.abilities()[index()].level());
                    case 'nevermore_shadowraze1':
                        self.abilities()[index() + 1].level(self.abilities()[index()].level());
                        self.abilities()[index() + 2].level(self.abilities()[index()].level());
                    break;
                    case 'nevermore_shadowraze2':
                        self.abilities()[index() - 1].level(self.abilities()[index()].level());
                        self.abilities()[index() + 1].level(self.abilities()[index()].level());
                    break;
                    case 'nevermore_shadowraze3':
                        self.abilities()[index() - 1].level(self.abilities()[index()].level());
                        self.abilities()[index() - 2].level(self.abilities()[index()].level());
                    break;
                    case 'ember_spirit_fire_remnant':
                        self.abilities()[index() - 1].level(self.abilities()[index()].level());
                    break;
                    case 'lone_druid_true_form':
                        self.abilities()[index() - 1].level(self.abilities()[index()].level());
                    break;
                }
            }
        };
        self.levelDownAbility = function (index, data, event, hero) {
            if (self.abilities()[index()].level() > 0) {
                self.abilities()[index()].level(self.abilities()[index()].level() - 1);
                hero.skillPointHistory.splice(hero.skillPointHistory().lastIndexOf(index()), 1);
                switch (self.abilities()[index()].name()) {
                    case 'beastmaster_call_of_the_wild':
                    case 'chen_test_of_faith':
                    case 'morphling_morph_agi':
                    case 'shadow_demon_shadow_poison':
                        self.abilities()[index() + 1].level(self.abilities()[index()].level());
                    break;
                    case 'morphling_morph_str':
                        self.abilities()[index() - 1].level(self.abilities()[index()].level());
                    break;
                    case 'keeper_of_the_light_spirit_form':
                        self.abilities()[index() - 1].level(self.abilities()[index()].level());
                        self.abilities()[index() - 2].level(self.abilities()[index()].level());
                    case 'nevermore_shadowraze1':
                        self.abilities()[index() + 1].level(self.abilities()[index()].level());
                        self.abilities()[index() + 2].level(self.abilities()[index()].level());
                    break;
                    case 'nevermore_shadowraze2':
                        self.abilities()[index() - 1].level(self.abilities()[index()].level());
                        self.abilities()[index() + 1].level(self.abilities()[index()].level());
                    break;
                    case 'nevermore_shadowraze3':
                        self.abilities()[index() - 1].level(self.abilities()[index()].level());
                        self.abilities()[index() - 2].level(self.abilities()[index()].level());
                    break;
                    case 'ember_spirit_fire_remnant':
                        self.abilities()[index() - 1].level(self.abilities()[index()].level());
                    break;
                    case 'lone_druid_true_form':
                        self.abilities()[index() - 1].level(self.abilities()[index()].level());
                    break;
                }
            }
        };
        
        self.isQWER = function (ability) {
            return (ability.displayname() != 'Empty' &&  (ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_HIDDEN') == -1 || ability.name().indexOf('invoker_') != -1) && ability.behavior().indexOf('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE') == -1)
        }
    }
});