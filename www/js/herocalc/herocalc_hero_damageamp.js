define(function (require, exports, module) {
    'use strict';
    var ko = require('./herocalc_knockout');
        
    var my = require("./herocalc_core").HEROCALCULATOR;
    
    my.prototype.HeroDamageAmpMixin = function (self) {
        self.damageBrackets = [
            ['medusa_mana_shield', 'templar_assassin_refraction', 'faceless_void_backtrack', 'nyx_assassin_spiked_carapace'],
            ['spectre_dispersion', 'wisp_overcharge', 'slardar_sprint','bristleback_bristleback', 'undying_flesh_golem'],
            ['abaddon_borrowed_time', 'abaddon_aphotic_shield', 'kunkka_ghostship', 'treant_living_armor'],
            ['chen_penitence', 'medusa_stone_gaze', 'shadow_demon_soul_catcher'],
            ['dazzle_shallow_grave']
        ];
        
        self.getDamageAfterBracket = function (initialDamage,index) {
            var bracket = self.damageBrackets[index];
            var multiplier = 1;
            for (var i = 0; i < bracket.length; i++) {
                if (my.prototype.findWhere(self.damageAmplification.buffs, {name: bracket[i].name}) != undefined || my.prototype.findWhere(self.damageReduction.buffs, {name: bracket[i].name}) != undefined) {
                    multiplier += bracket[i].value;
                }
            };
            return initialDamage * multiplier;
        };
        
        self.processDamageAmpReducBracket = function (index, sources, damage) {
            var multiplier = 1,
                data = [],
                damage = parseFloat(damage),
                total = parseFloat(damage);
                
            for (var i = 0; i < self.damageBrackets[index].length; i++) {
                if (sources[self.damageBrackets[index][i]] != undefined) {
                    multiplier = 1 + parseFloat(sources[self.damageBrackets[index][i]].multiplier);
                    total += (damage * multiplier) - damage;
                    data.push(new my.prototype.DamageInstance(
                        sources[self.damageBrackets[index][i]].displayname,
                        sources[self.damageBrackets[index][i]].damageType,
                        (damage * multiplier) - damage,
                        [],
                        total
                    ));
                }
            }
            return data;
        }
        
        self.getDamageAmpReducInstance = function(sources, initialDamage, ability, damageType) {
            var data = [],
                damage = parseFloat(initialDamage),
                prevDamage = damage,
                label = ability == 'initial' ? 'Initial' : sources[ability].displayname;

            // Bracket 0
            data = data.concat(self.processDamageAmpReducBracket(0, sources, damage));
            damage = data[data.length - 1] ? data[data.length - 1].total : damage;

            // Bracket 1
            data = data.concat(self.processDamageAmpReducBracket(1, sources, damage));
            damage = data[data.length - 1] ? data[data.length - 1].total : damage;
            
            // Bracket 2
            data = data.concat(self.processDamageAmpReducBracket(2, sources, damage));
            damage = data[data.length - 1] ? data[data.length - 1].total : damage;

            return new my.prototype.DamageInstance(label, damageType, initialDamage, data, data[data.length - 1] ? data[data.length - 1].total : damage);
        }
        
        self.getDamageAmpReduc = function (initialDamage) {
            var instances = [],
                sources = {},
                sourcesAmp = self.damageReduction.getDamageMultiplierSources(),
                sourcesReduc = self.damageAmplification.getDamageMultiplierSources();
            $.extend(sources, sourcesAmp);
            $.extend(sources, sourcesReduc);
            // Initial damage instance
            instances.push(self.getDamageAmpReducInstance(sources, initialDamage, 'initial', 'physical'));
            
            // Bracket 4 damage instances
            var b4 = ['shadow_demon_soul_catcher', 'medusa_stone_gaze', 'chen_penitence'];
            for (var i = 0; i < b4.length; i++) {
                if (sources[b4[i]] != undefined) {
                    instances.push(self.getDamageAmpReducInstance(sources, initialDamage * sources[b4[i]].multiplier, b4[i], sources[b4[i]].damageType));
                }
            }
        
            return new my.prototype.DamageInstance('Total', 'physical', initialDamage, instances, instances.reduce(function(memo, i) {return parseFloat(memo) + parseFloat(i.total);}, 0));
        };
        
        self.damageInputModified = ko.computed(function () {
            return self.getDamageAmpReduc(self.damageInputValue());
        });
    }
});