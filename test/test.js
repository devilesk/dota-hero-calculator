var assert = require('assert');
var ko = require('knockout');
var HeroCalc = require("../src/js/herocalc/main");
var HeroCalcData = require("dota-datafiles");
var heroData = HeroCalcData.heroData;
var itemData = HeroCalcData.itemData;

describe('HeroCalc', function() {
    describe('#init()', function () {
        it('should init without error', function (done) {
            HeroCalc.init(HeroCalcData.heroData, HeroCalcData.itemData, HeroCalcData.unitData, function () {
                done();
            });
        });
        
        var heroes = Object.keys(HeroCalcData.heroData).map(function (hero) { return hero.replace('npc_dota_hero_', ''); });
        var heroModel;
        
        heroes.forEach(function (hero) {
            describe(hero, function() {

                it('should init', function() {
                    heroModel = new HeroCalc.HeroModel(heroData, itemData, hero);
                });
                
                it('should level to 25', function() {
                    for (var i = 1; i <= 25; i++) {
                        heroModel.selectedHeroLevel(i);
                    }
                });
                
                describe('abilities', function() {
                    it('should have display names or not be learnable', function() {
                        heroModel.ability().abilities().forEach(function (ability) {
                            assert.ok(ability.displayname || ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE') !== -1);
                        });
                    });
                    it('should toggle on', function() {
                        heroModel.ability().abilities().forEach(function (ability, index) {
                            if (!ability.isActive()) {
                                heroModel.ability().toggleAbility(function () { return index; }, null, null);
                                assert.ok(ability.isActive() || ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE') !== -1, ability.name + " not active");
                            }
                        });
                    });
                    it('should level up', function() {
                        heroModel.ability().abilities().forEach(function (ability, index) {
                            if (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE') === -1 && ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_HIDDEN') === -1) {
                                var maxLevel = heroModel.getAbilityLevelMax(ability);
                                for (var i = 0 ; i < maxLevel; i++) {
                                    heroModel.ability().levelUpAbility(function () { return index; }, ability, null, heroModel);
                                    var abilityLevel = heroModel.ability().getAbilityLevelByAbilityName(ability.name);
                                    assert.equal(abilityLevel, i + 1, ability.name);
                                }
                                assert.ok(ability.level() <= maxLevel, ability.name + " " + ability.level() + " " + maxLevel)
                            }
                        });
                    });
                    it('should have properties', function() {
                        for (a in heroModel.ability()) {
                            if (ko.isComputed(heroModel.ability()[a])) {
                                heroModel.ability()[a]();
                            }
                        }
                    });
                    it('should level down', function() {
                        heroModel.ability().abilities().forEach(function (ability, index) {
                            if (ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE') === -1 && ability.behavior.indexOf('DOTA_ABILITY_BEHAVIOR_HIDDEN') === -1) {
                                var maxLevel = heroModel.getAbilityLevelMax(ability);
                                for (var i = maxLevel; i > 0; i--) {
                                    heroModel.ability().levelDownAbility(index, ability, null, heroModel);
                                    var abilityLevel = heroModel.ability().getAbilityLevelByAbilityName(ability.name);
                                    assert.equal(abilityLevel, i - 1, ability.name);
                                }
                            }
                        });
                    });
                }); 
            });
        });

        it('should have properties', function() {
            for (a in heroModel) {
                if (ko.isComputed(heroModel[a])) {
                    heroModel[a]();
                }
            }
        });
        
    });
        

});

