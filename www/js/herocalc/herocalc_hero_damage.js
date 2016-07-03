define(function (require, exports, module) {
    'use strict';
    var ko = require('herocalc_knockout');
        
    var my = require("./herocalc_core").HEROCALCULATOR;
    
    my.prototype.DamageTypeColor = {
        'physical': '#979aa2',
        'pure': 'goldenrod',
        'magic': '#428bca',
        'default': '#979aa2'
    }
    
    my.prototype.HeroDamageMixin = function (self) {
        self.getReducedDamage = function (value, type) {
            var result = value;
            switch (type) {
                case 'physical':
                    result = value * (1 - (0.06 * self.enemy().totalArmorPhysical()) / (1 + 0.06 * Math.abs(self.enemy().totalArmorPhysical())));
                break;
                case 'magic':
                    result = value * (1 - self.enemy().totalMagicResistance() / 100);
                break;
                case 'pure':
                    result = value;
                break;
                case 'composite':
                    result = value * (1 - (0.06 * self.enemy().totalArmorPhysical()) / (1 + 0.06 * Math.abs(self.enemy().totalArmorPhysical())));
                    result *= (1 - self.enemy().totalMagicResistance() / 100);
                break;
            }
            result *= self.ability().getDamageAmplification() * self.debuffs.getDamageAmplification();
            result *= self.enemy().ability().getDamageReduction() * self.enemy().buffs.getDamageReduction();
            return result;
        }
        
        self.damageTotalInfo = ko.pureComputed(function () {
            var bonusDamageArray = [
                self.ability().getBonusDamage().sources,
                self.buffs.getBonusDamage().sources
            ],
            bonusDamagePctArray = [
                self.ability().getBonusDamagePercent().sources,
                self.buffs.getBonusDamagePercent().sources
            ],
            itemBonusDamage = self.inventory.getBonusDamage().sources,
            itemBonusDamagePct = self.buffs.itemBuffs.getBonusDamagePercent(self.inventory.getBonusDamagePercent()).sources,
            critSources = self.critInfo(),
            abilityOrbSources = self.ability().getOrbSource(),
            itemOrbSources = self.inventory.getOrbSource(),
            itemProcOrbSources = self.orbProcInfo(),
            bashSources = self.bashInfo(),
            
            baseDamage = (self.baseDamage()[0] + self.baseDamage()[1]) / 2,
            totalDamage = baseDamage,
            totalCritableDamage = baseDamage,
            totalCrit = 0,
            geminateAttack = { damage: 0, damageReduced: 0, cooldown: 6, active: false },
            echoSabreAttack = { damage: 0, damageReduced: 0, cooldown: my.prototype.itemData['item_echo_sabre'].cooldown[0], active: false },
            damage = {
                pure: 0,
                physical: baseDamage,
                magic: 0
            },
            result = [],
            crits = [];

            // bonus damage from items
            for (i in itemBonusDamage) {
                var d = itemBonusDamage[i].damage*itemBonusDamage[i].count * self.ability().getSelfBaseDamageReductionPct() * self.enemy().ability().getBaseDamageReductionPct() * self.debuffs.itemBuffs.getBaseDamageReductionPct();
                result.push({
                    name: itemBonusDamage[i].displayname + (itemBonusDamage[i].count > 1 ? ' x' + itemBonusDamage[i].count : ''),
                    damage: d,
                    damageType: itemBonusDamage[i].damageType,
                    damageReduced: self.getReducedDamage(d, itemBonusDamage[i].damageType)
                });
                totalDamage += d;
                totalCritableDamage += d;
                damage[itemBonusDamage[i].damageType] += d;
            }

            // bonus damage percent from items
            for (i in itemBonusDamagePct) {
                var d = baseDamage * itemBonusDamagePct[i].damage;
                result.push({
                    name: itemBonusDamagePct[i].displayname,
                    damage: d,
                    damageType: itemBonusDamagePct[i].damageType,
                    damageReduced: self.getReducedDamage(d, itemBonusDamagePct[i].damageType)
                });
                totalDamage += d;
                totalCritableDamage += d;
                damage[itemBonusDamagePct[i].damageType] += d;
            }
            
            // bonus damage from abilities and buffs
            for (var i = 0; i < bonusDamageArray.length; i++) {
                for (j in bonusDamageArray[i]) {
                    var d = bonusDamageArray[i][j].damage;
                    result.push({
                        name: bonusDamageArray[i][j].displayname,
                        damage: d,
                        damageType: bonusDamageArray[i][j].damageType,
                        damageReduced: self.getReducedDamage(d, bonusDamageArray[i][j].damageType)
                    });
                    totalDamage += d;
                    totalCritableDamage += d;
                    damage[bonusDamageArray[i][j].damageType] += d;
                }
            }
            
            // bonus damage percent from abilities and buffs
            for (var i = 0; i < bonusDamagePctArray.length; i++) {
                for (j in bonusDamagePctArray[i]) {
                    var d = baseDamage * bonusDamagePctArray[i][j].damage;
                    result.push({
                        name: bonusDamagePctArray[i][j].displayname,
                        damage: d,
                        damageType: bonusDamagePctArray[i][j].damageType,
                        damageReduced: self.getReducedDamage(d, bonusDamagePctArray[i][j].damageType)
                    });
                    totalDamage += d;
                    totalCritableDamage += d;
                    damage[bonusDamagePctArray[i][j].damageType] += d;
                }
            }
            // drow_ranger_trueshot
            if (self.hero().attacktype() === 'DOTA_UNIT_CAP_RANGED_ATTACK') {
                if (self.selectedHero().heroName === 'drow_ranger') {
                    var s = self.ability().getBonusDamagePrecisionAura().sources;
                    var index = 0;
                }
                else {
                    var s = self.buffs.getBonusDamagePrecisionAura().sources;
                    var index = 1;
                }
                if (s[index] != undefined) {
                    if (self.selectedHero().heroName === 'drow_ranger') {
                        var d = s[index].damage * self.totalAgi();
                    }
                    else {
                        var d = s[index].damage;
                    }
                    result.push({
                        name: s[index].displayname,
                        damage: d,
                        damageType: 'physical',
                        damageReduced: self.getReducedDamage(d, 'physical')
                    });
                    totalDamage += d;
                    totalCritableDamage += d;
                    damage.physical += d;                    
                }
            }
            
            // riki_backstab
            if (self.selectedHero().heroName === 'riki') {
                var s = self.ability().getBonusDamageBackstab().sources;
                var index = 0;
            }
            else {
                var s = self.buffs.getBonusDamageBackstab().sources;
                var index = 1;
            }
            if (s[index] != undefined) {
                if (self.selectedHero().heroName === 'riki') {
                    var d = s[index].damage * self.totalAgi();
                }
                else {
                    var d = s[index].damage;
                }
                result.push({
                    name: s[index].displayname,
                    damage: d,
                    damageType: 'physical',
                    damageReduced: self.getReducedDamage(d, 'physical')
                });
                totalDamage += d;
                //totalCritableDamage += d;
                damage.physical += d;                    
            }
            
            // weaver_geminate_attack
            if (self.selectedHero().heroName === 'weaver') {
                var a = self.ability().abilities().find(function (ability) {
                    return ability.name() === 'weaver_geminate_attack';
                });
                if (a) {
                    if (a.level() > 0) {
                        var cd = a.cooldown()[a.level() - 1],
                            d = damage.physical;
                        result.push({
                            name: a.displayname() + ' every ' + cd + ' seconds',
                            damage: d,
                            damageType: 'physical',
                            damageReduced: self.getReducedDamage(d, 'physical')
                        });
                        geminateAttack.damage += d;
                        geminateAttack.damageReduced += self.getReducedDamage(d, 'physical');
                        geminateAttack.cooldown = cd;
                        geminateAttack.active = true;
                    }
                }
            }
            
            // echo_sabre
            var item = self.inventory.items().find(function (o) { return o.item === "echo_sabre" && o.enabled(); });
            if (item && self.hero().attacktype() === 'DOTA_UNIT_CAP_MELEE_ATTACK') {
                var item_echo_sabre = my.prototype.itemData['item_echo_sabre'],
                    d = damage.physical;
                result.push({
                    name: item_echo_sabre.displayname + ' every ' + item_echo_sabre.cooldown + ' seconds',
                    damage: damage.physical,
                    damageType: 'physical',
                    damageReduced: self.getReducedDamage(d, 'physical')
                });
                echoSabreAttack.damage += d;
                echoSabreAttack.damageReduced += self.getReducedDamage(d, 'physical');
                echoSabreAttack.active = true;
            }
            
            // bash damage
            for (var i = 0; i < bashSources.sources.length; i++) {
                var d = bashSources.sources[i].damage * bashSources.sources[i].chance * bashSources.sources[i].count;
                result.push({
                    name: bashSources.sources[i].name,
                    damage: d,
                    damageType: bashSources.sources[i].damageType,
                    damageReduced: self.getReducedDamage(d, bashSources.sources[i].damageType)
                });
                totalDamage += d;
                damage[bashSources.sources[i].damageType] += d;
            }
            
            // %-based orbs
            for (var i = 0; i < itemProcOrbSources.sources.length; i++) {
                var d = itemProcOrbSources.sources[i].damage * (1 - Math.pow(1 - itemProcOrbSources.sources[i].chance, itemProcOrbSources.sources[i].count));
                result.push({
                    name: itemProcOrbSources.sources[i].name,
                    damage: d,
                    damageType: itemProcOrbSources.sources[i].damageType,
                    damageReduced: self.getReducedDamage(d, itemProcOrbSources.sources[i].damageType)
                });
                totalDamage += d;
                damage[itemProcOrbSources.sources[i].damageType] += d;
            }
            
            // ability orbs
            for (orb in abilityOrbSources) {
                var d = abilityOrbSources[orb].damage * (1 - itemProcOrbSources.total);
                result.push({
                    name: abilityOrbSources[orb].displayname,
                    damage: d,
                    damageType: abilityOrbSources[orb].damageType,
                    damageReduced: self.getReducedDamage(d, abilityOrbSources[orb].damageType)
                });
                totalDamage += d;
                damage[abilityOrbSources[orb].damageType] += d;
            }
            
            // item orbs
            if (Object.keys(abilityOrbSources).length === 0) {
                for (orb in itemOrbSources) {
                    var d = itemOrbSources[orb].damage * (1 - itemProcOrbSources.total);
                    result.push({
                        name: itemOrbSources[orb].displayname,
                        damage: d,
                        damageType: itemOrbSources[orb].damageType,
                        damageReduced: self.getReducedDamage(d, itemOrbSources[orb].damageType)
                    });
                    totalDamage += d;
                    damage[itemOrbSources[orb].damageType] += d;
                }            
            }
            
            // crit damage
            for (var i = 0; i < critSources.sources.length; i++) {
                var d = totalCritableDamage * (critSources.sources[i].multiplier - 1) * critSources.sources[i].totalchance;
                crits.push({
                    name: critSources.sources[i].name,
                    damage: d,
                    damageType: 'physical',
                    damageReduced: self.getReducedDamage(d, 'physical')
                });
                totalCrit += d;
            }

            var totalReduced = self.getReducedDamage(damage.pure, 'pure') 
                    + self.getReducedDamage(damage.physical, 'physical')
                    + self.getReducedDamage(damage.magic, 'magic'),
                totalCritReduced = self.getReducedDamage(totalCrit, 'physical'),
                dps = {
                    base: totalDamage * self.attacksPerSecond(),
                    crit: totalCrit * self.attacksPerSecond(),
                    geminateAttack: geminateAttack.active ? geminateAttack.damage / geminateAttack.cooldown : 0,
                    reduced: {
                        base: totalReduced * self.attacksPerSecond(),
                        crit: totalCritReduced * self.attacksPerSecond(),
                        geminateAttack: geminateAttack.active ? self.getReducedDamage(geminateAttack.damage, 'physical') / geminateAttack.cooldown : 0,
                    }
                }
            
            return {
                sources: result,
                sourcesCrit: crits,
                total: totalDamage,
                totalCrit: totalCrit,
                totalGeminateAttack: totalDamage + geminateAttack.damage,
                totalGeminateAttackReduced: totalReduced + geminateAttack.damageReduced,
                geminateAttack: geminateAttack,
                totalCritReduced: totalCritReduced,
                totalReduced: totalReduced,
                sumTotal: totalDamage + totalCrit,
                sumTotalReduced: totalReduced + totalCritReduced,
                dps: {
                    base: dps.base,
                    crit: dps.base + dps.crit,
                    geminateAttack: dps.base + dps.geminateAttack,
                    total: dps.base + dps.crit + dps.geminateAttack,
                    reduced: {
                        base: dps.reduced.base,
                        crit: dps.reduced.base + dps.reduced.crit,
                        geminateAttack: dps.reduced.base + dps.reduced.geminateAttack,
                        total: dps.reduced.base + dps.reduced.crit + dps.reduced.geminateAttack
                    }
                }
            };
        });
        
        self.getDamageTypeColor = function (damageType) {
            return my.prototype.DamageTypeColor[damageType] || my.prototype.DamageTypeColor['default'];
        }
        
    }
});