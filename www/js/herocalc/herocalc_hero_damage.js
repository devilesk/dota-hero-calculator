'use strict';
var ko = require('./herocalc_knockout');
    
var my = require("./herocalc_core");

my.prototype.DamageTypeColor = {
    'physical': '#979aa2',
    'pure': 'goldenrod',
    'magic': '#428bca',
    'default': '#979aa2'
}

my.prototype.HeroDamageMixin = function (self) {
    self.critInfo = ko.pureComputed(function () {
        var critSources = self.inventory.getCritSource();
        my.prototype.extend(critSources, self.ability().getCritSource());
        my.prototype.extend(critSources, self.buffs.getCritSource());
        var critSourcesArray = [];
        for (var prop in critSources) {
            var el = critSources[prop];
            el.name = prop
            critSourcesArray.push(el);
        }
        function compareByMultiplier(a,b) {
            if (a.multiplier < b.multiplier)
                return 1;
            if (a.multiplier > b.multiplier)
                return -1;
            return 0;
        }

        critSourcesArray.sort(compareByMultiplier);
        
        var result = [];
        var critTotal = 0;
        for (var i = 0; i < critSourcesArray.length; i++) {
            var total = 1;
            for (var j = 0; j < i; j++) {
                for (var k = 0; k <critSourcesArray[j].count; k++) {
                    total *= (1 - critSourcesArray[j].chance);
                }
            }
            var total2 = 1;
            for (var k = 0; k < critSourcesArray[i].count; k++) {
                total2 *= (1 - critSourcesArray[i].chance);
            }
            total *= (1 - total2);
            critTotal += total;
            if (critSourcesArray[i].count > 1) {
                result.push({
                    'name':critSourcesArray[i].displayname + ' x' + critSourcesArray[i].count,
                    'chance':critSourcesArray[i].chance,
                    'multiplier':critSourcesArray[i].multiplier,
                    'count':critSourcesArray[i].count,
                    'totalChance':total
                });
            }
            else {
                result.push({
                    'name':critSourcesArray[i].displayname,
                    'chance':critSourcesArray[i].chance,
                    'multiplier':critSourcesArray[i].multiplier,
                    'count':critSourcesArray[i].count,
                    'totalChance':total
                });
            }
        }
        return { sources: result, total: critTotal };
    });

    self.cleaveInfo = ko.pureComputed(function () {
        var cleaveSources = self.inventory.getCleaveSource();
        my.prototype.extend(cleaveSources, self.ability().getCleaveSource());
        my.prototype.extend(cleaveSources, self.buffs.getCleaveSource());
        var cleaveSourcesArray = [];
        for (var prop in cleaveSources) {
            var el = cleaveSources[prop];
            el.name = prop
            cleaveSourcesArray.push(el);
        }
        function compareByRadius(a,b) {
            if (a.radius < b.radius)
                return 1;
            if (a.radius > b.radius)
                return -1;
            return 0;
        }

        cleaveSourcesArray.sort(compareByRadius);
        var cleaveSourcesByRadius = {};
        for (var i = 0; i < cleaveSourcesArray.length; i++) {
            var total = 0;
            for (var j = 0; j <cleaveSourcesArray.length; j++) {
                if (cleaveSourcesArray[j].radius >= cleaveSourcesArray[i].radius) {
                    total += cleaveSourcesArray[j].magnitude * cleaveSourcesArray[j].count;
                }
            }
            cleaveSourcesByRadius[cleaveSourcesArray[i].radius] = total;
        }
        var result = [];
        for (var prop in cleaveSourcesByRadius) {
            result.push({
                'radius':prop,
                'magnitude':cleaveSourcesByRadius[prop]
            });
        }
        return result;
    });
    
    self.bashInfo = ko.pureComputed(function () {
        var attacktype = self.heroData().attacktype;
        var bashSources = self.inventory.getBashSource(attacktype);
        my.prototype.extend(bashSources, self.ability().getBashSource());
        var bashSourcesArray = [];
        for (var prop in bashSources) {
            var el = bashSources[prop];
            el.name = prop
            bashSourcesArray.push(el);
        }
        function compareByDuration(a, b) {
            if (a.duration < b.duration)
                return 1;
            if (a.duration > b.duration)
                return -1;
            return 0;
        }

        //bashSourcesArray.sort(compareByDuration);
        
        var result = [];
        var bashTotal = 0;
        for (var i = 0;i < bashSourcesArray.length; i++) {
            var total = 1;
            for (var j = 0; j < i; j++) {
                for (var k = 0; k < bashSourcesArray[j].count; k++) {
                    total *= (1 - bashSourcesArray[j].chance);
                }
            }
            var total2 = 1;
            for (var k = 0; k < bashSourcesArray[i].count; k++) {
                total2 *= (1 - bashSourcesArray[i].chance);
            }
            total *= (1 - total2);
            bashTotal += total;
            if (bashSourcesArray[i].name === 'spirit_breaker_greater_bash') {
                var d = bashSourcesArray[i].damage * self.totalMovementSpeed();
            }
            else {
                var d = bashSourcesArray[i].damage;
            }
            if (bashSourcesArray[i].count > 1) {
                result.push({
                    'name':bashSourcesArray[i].displayname, // + ' x' + bashSourcesArray[i].count,
                    'chance':bashSourcesArray[i].chance,
                    'damage':d,
                    'count':bashSourcesArray[i].count,
                    'damageType':bashSourcesArray[i].damageType,
                    'totalChance':total
                });
            }
            else {
                result.push({
                    'name':bashSourcesArray[i].displayname,
                    'chance':bashSourcesArray[i].chance,
                    'damage':d,
                    'count':bashSourcesArray[i].count,
                    'damageType':bashSourcesArray[i].damageType,
                    'totalChance':total
                });
            }

        }
        return { sources: result, total: bashTotal };
    });
    
    self.orbProcInfo = ko.pureComputed(function () {
        var attacktype = self.heroData().attacktype;
        var damageSources = self.inventory.getOrbProcSource();
        var damageSourcesArray = [];
        for (var prop in damageSources) {
            var el = damageSources[prop];
            el.name = prop
            damageSourcesArray.push(el);
        }
        function compareByDamage(a, b) {
            if (a.priority > b.priority) {
                return 1;
            }
            if (a.priority < b.priority) {
                return -1;
            }
            if (a.damage < b.damage)
                return 1;
            if (a.damage > b.damage)
                return -1;
            return 0;
        }

        damageSourcesArray.sort(compareByDamage);
        
        var result = [];
        var damageTotal = 0;
        for (var i=0 ; i < damageSourcesArray.length; i++) {
            var total = 1;
            for (var j = 0; j < i; j++) {
                for (var k = 0; k < damageSourcesArray[j].count; k++) {
                    total *= (1 - damageSourcesArray[j].chance);
                }
            }
            var total2 = 1;
            for (var k = 0; k < damageSourcesArray[i].count; k++) {
                total2 *= (1 - damageSourcesArray[i].chance);
            }
            total *= (1 - total2);
            damageTotal += total;
            if (damageSourcesArray[i].count > 1) {
                result.push({
                    'name':damageSourcesArray[i].displayname + ' x' + damageSourcesArray[i].count,
                    'chance':damageSourcesArray[i].chance,
                    'damage':damageSourcesArray[i].damage,
                    'count':damageSourcesArray[i].count,
                    'damageType':damageSourcesArray[i].damageType,
                    'totalChance':total
                });
            }
            else {
                result.push({
                    'name':damageSourcesArray[i].displayname,
                    'chance':damageSourcesArray[i].chance,
                    'damage':damageSourcesArray[i].damage,
                    'count':damageSourcesArray[i].count,
                    'damageType':damageSourcesArray[i].damageType,
                    'totalChance':total
                });
            }
        }
        return { sources: result, total: damageTotal };
    });
    
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
        
        attackSources = [];
        
        attackSources.push({
            name: 'Base Attack',
            cooldown: 1
        });
        
        // weaver_geminate_attack
        if (self.selectedHero().heroName === 'weaver') {
            var a = self.ability().abilities().find(function (ability) {
                return ability.name() === 'weaver_geminate_attack';
            });
            if (a) {
                if (a.level() > 0) {
                    var cd = a.cooldown()[a.level() - 1];
                    attackSources.push({
                        name: a.displayname(),
                        cooldown: (1/cd)
                    });
                }
            }
        }
        
        // echo_sabre
        var item = self.inventory.items().find(function (o) { return o.item === "echo_sabre" && o.enabled(); });
        if (item && self.heroData().attacktype === 'DOTA_UNIT_CAP_MELEE_ATTACK') {
            var item_echo_sabre = my.prototype.itemData['item_echo_sabre'];
            attackSources.push({
                name: item_echo_sabre.displayname,
                cooldown: (1/item_echo_sabre.cooldown)
            });
        }

        var attacks = attackSources.map(function (a) {
            var baseDamage = (self.baseDamage()[0] + self.baseDamage()[1]) / 2,
            totalDamage = 0,
            totalCritableDamage = 0,
            totalCrit = 0,
            geminateAttack = { damage: 0, damageReduced: 0, cooldown: 6, active: false },
            echoSabreAttack = { damage: 0, damageReduced: 0, cooldown: my.prototype.itemData['item_echo_sabre'].cooldown[0], active: false },
            damage = {
                pure: 0,
                physical: 0,
                magic: 0
            },
            result = [],
            crits = [];
            
            // base damage
            result.push({
                name: 'Base Damage',
                damage: baseDamage,
                damageType: 'physical',
                damageReduced: self.getReducedDamage(baseDamage, 'physical'),
                enabled: ko.observable(true)
            });
            totalDamage += baseDamage;
            totalCritableDamage += baseDamage;
            damage.physical += baseDamage;
            
            // bonus damage from items
            for (i in itemBonusDamage) {
                var d = itemBonusDamage[i].damage*itemBonusDamage[i].count * self.ability().getSelfBaseDamageReductionPct() * self.enemy().ability().getBaseDamageReductionPct() * self.debuffs.itemBuffs.getBaseDamageReductionPct();
                result.push({
                    name: itemBonusDamage[i].displayname + (itemBonusDamage[i].count > 1 ? ' x' + itemBonusDamage[i].count : ''),
                    damage: d,
                    damageType: itemBonusDamage[i].damageType,
                    damageReduced: self.getReducedDamage(d, itemBonusDamage[i].damageType),
                    enabled: ko.observable(true)
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
                    damageReduced: self.getReducedDamage(d, itemBonusDamagePct[i].damageType),
                    enabled: ko.observable(true)
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
                        damageReduced: self.getReducedDamage(d, bonusDamageArray[i][j].damageType),
                        enabled: ko.observable(true)
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
                        damageReduced: self.getReducedDamage(d, bonusDamagePctArray[i][j].damageType),
                        enabled: ko.observable(true)
                    });
                    totalDamage += d;
                    totalCritableDamage += d;
                    damage[bonusDamagePctArray[i][j].damageType] += d;
                }
            }
            // drow_ranger_trueshot
            if (self.heroData().attacktype === 'DOTA_UNIT_CAP_RANGED_ATTACK') {
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
                        damageReduced: self.getReducedDamage(d, 'physical'),
                        enabled: ko.observable(true)
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
                    damageReduced: self.getReducedDamage(d, 'physical'),
                    enabled: ko.observable(true)
                });
                totalDamage += d;
                //totalCritableDamage += d;
                damage.physical += d;                    
            }

            // bash damage
            for (var i = 0; i < bashSources.sources.length; i++) {
                var o = bashSources.sources[i];
                var d = bashSources.sources[i].damage;
                var cd = self.attacksPerSecond();
                if (o.cooldown) {
                    cd = Math.max(1/o.cooldown, cd);
                }
                for (var j = 0; j < bashSources.sources[i].count; j++) {
                    result.push({
                        name: bashSources.sources[i].name,
                        damage: d,
                        damageType: bashSources.sources[i].damageType,
                        damageReduced: self.getReducedDamage(d, bashSources.sources[i].damageType),
                        dps: d * cd * bashSources.sources[i].chance,
                        dpsReduced: self.getReducedDamage(d, bashSources.sources[i].damageType) * cd * bashSources.sources[i].chance,
                        enabled: ko.observable(true)
                    });
                    totalDamage += d;
                    damage[bashSources.sources[i].damageType] += d;
                }

            }
            
            // %-based orbs
            for (var i = 0; i < itemProcOrbSources.sources.length; i++) {
                var d = itemProcOrbSources.sources[i].damage * (1 - Math.pow(1 - itemProcOrbSources.sources[i].chance, itemProcOrbSources.sources[i].count));
                result.push({
                    name: itemProcOrbSources.sources[i].name,
                    damage: d,
                    damageType: itemProcOrbSources.sources[i].damageType,
                    damageReduced: self.getReducedDamage(d, itemProcOrbSources.sources[i].damageType),
                    enabled: ko.observable(true)
                });
                totalDamage += d;
                damage[itemProcOrbSources.sources[i].damageType] += d;
            }
            
            // ability orbs
            for (var orb in abilityOrbSources) {
                var d = abilityOrbSources[orb].damage * (1 - itemProcOrbSources.total);
                result.push({
                    name: abilityOrbSources[orb].displayname,
                    damage: d,
                    damageType: abilityOrbSources[orb].damageType,
                    damageReduced: self.getReducedDamage(d, abilityOrbSources[orb].damageType),
                    enabled: ko.observable(true)
                });
                totalDamage += d;
                damage[abilityOrbSources[orb].damageType] += d;
            }
            
            // item orbs
            if (Object.keys(abilityOrbSources).length === 0) {
                for (var orb in itemOrbSources) {
                    var d = itemOrbSources[orb].damage * (1 - itemProcOrbSources.total);
                    result.push({
                        name: itemOrbSources[orb].displayname,
                        damage: d,
                        damageType: itemOrbSources[orb].damageType,
                        damageReduced: self.getReducedDamage(d, itemOrbSources[orb].damageType),
                        enabled: ko.observable(true)
                    });
                    totalDamage += d;
                    damage[itemOrbSources[orb].damageType] += d;
                }            
            }
            
            // crit damage
            for (var i = 0; i < critSources.sources.length; i++) {
                var d = totalCritableDamage * (critSources.sources[i].multiplier - 1);// * critSources.sources[i].totalChance;
                crits.push({
                    name: critSources.sources[i].name + ', ' + critSources.sources[i].multiplier + 'x, ' + (critSources.sources[i].totalChance * 100).toFixed(1) + '%',
                    damage: d,
                    damageType: 'physical',
                    damageReduced: self.getReducedDamage(d, 'physical'),
                    enabled: ko.observable(true),
                    chance: critSources.sources[i].totalChance
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
                
            crits.forEach(function (o) {
                if (!o.dps) {
                    o.dps = o.damage * (o.cooldown || self.attacksPerSecond()) * o.chance;
                }
                if (!o.dpsReduced) {
                    o.dpsReduced = o.damageReduced * (o.cooldown || self.attacksPerSecond()) * o.chance;
                }
            });
                
            result.forEach(function (o) {
                if (!o.dps) {
                    o.dps = o.damage * (o.cooldown || self.attacksPerSecond());
                }
                if (!o.dpsReduced) {
                    o.dpsReduced = o.damageReduced * (o.cooldown || self.attacksPerSecond());
                }
            });
            
            var totalCritChance = crits.reduce(function (memo, o) { return memo + o.chance }, 0);
                
            var t1Crit = ko.computed(function () {
                var c = crits.find(function (o) { return o.enabled(); });
                return c ? c.damage : 0;
            });
            var t2Crit = ko.computed(function () {
                var c = crits.find(function (o) { return o.enabled(); });
                return c ? c.damageReduced : 0;
            });
            var t3Crit = ko.computed(function () {
                return crits.filter(function (o) { return o.enabled(); }).reduce(function (memo, o) { return memo + o.dps }, 0);
            });
            var t4Crit = ko.computed(function () {
                return crits.filter(function (o) { return o.enabled(); }).reduce(function (memo, o) { return memo + o.dpsReduced }, 0);
            });
                
            var t1 = ko.computed(function () {
                return result.filter(function (o) { return o.enabled(); }).reduce(function (memo, o) { return memo + o.damage }, 0) + t1Crit();
            });
            var t2 = ko.computed(function () {
                return result.filter(function (o) { return o.enabled(); }).reduce(function (memo, o) { return memo + o.damageReduced }, 0) + t2Crit();
            });
            var t3 = ko.computed(function () {
                return (result.filter(function (o) { return o.enabled(); }).reduce(function (memo, o) { return memo + o.dps }, 0) + t3Crit()) * a.cooldown;
            });
            var t4 = ko.computed(function () {
                return (result.filter(function (o) { return o.enabled(); }).reduce(function (memo, o) { return memo + o.dpsReduced }, 0) + t4Crit()) * a.cooldown;
            });
            
            var totalCritRow = [t1Crit, t2Crit, t3Crit, t4Crit];
            
            var totalRow = [t1, t2, t3, t4];

            return {
                name: a.name + ' Subtotal',
                cooldown: a.cooldown,
                enabled: ko.observable(true),
                visible: ko.observable(true),
                totalCritChance: totalCritChance,
                totalCritRow: totalCritRow,
                totalRow: totalRow,
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
        
        var t1 = ko.computed(function () {
            return attacks.filter(function (o) { return o.enabled(); }).reduce(function (memo, o) { return memo + o.totalRow[0]() }, 0);
        });
        var t2 = ko.computed(function () {
            return attacks.filter(function (o) { return o.enabled(); }).reduce(function (memo, o) { return memo + o.totalRow[1]() }, 0);
        });
        var t3 = ko.computed(function () {
            return attacks.filter(function (o) { return o.enabled(); }).reduce(function (memo, o) { return memo + o.totalRow[2]() }, 0);
        });
        var t4 = ko.computed(function () {
            return attacks.filter(function (o) { return o.enabled(); }).reduce(function (memo, o) { return memo + o.totalRow[3]() }, 0);
        });
            
        return {
            attacks: attacks,
            totalRow: [t1, t2, t3, t4]
        }
    });
    
    self.getDamageTypeColor = function (damageType) {
        return my.prototype.DamageTypeColor[damageType] || my.prototype.DamageTypeColor['default'];
    }
    
}