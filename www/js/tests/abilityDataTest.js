define(['QUnit', 'herocalc'], function(QUnit, HEROCALCULATOR) {
    var run = function() {
        QUnit.test('Test should go through all heroes and abilityData.', function(assert) {
            var hero = new HEROCALCULATOR.HEROCALCULATOR.prototype.HeroCalculatorModel(0);

            HEROCALCULATOR.HEROCALCULATOR.prototype.HeroOptions.forEach(function (heroOption) {
                hero.selectedHero(heroOption);
                assert.equal(hero.selectedHero().heroName, heroOption.heroName, 'The return should be ' + heroOption.heroName + '.');

                var abilityModel = hero.ability();
                abilityModel.abilities().forEach(function (ability, index) {
                    var data = ability.name();
                    if (abilityModel.abilityData[data]) {
                        abilityModel.abilityData[data].forEach(function (arg) {
                            if (arg.attributeName) {
                                if (arg.noLevel) { 
                                    assert.notEqual(abilityModel.getAbilityAttributeValue(ability.attributes(), arg.attributeName, 0), undefined, 'Attribute name ' + arg.attributeName + ' for ability ' + ability.name() + ' at level 0 should not be undefined')
                                }
                                else {
                                    assert.notEqual(abilityModel.getAbilityAttributeValue(ability.attributes(), arg.attributeName, ability.level()), undefined, 'Attribute name ' + arg.attributeName + ' for ability ' + ability.name() + ' at level ' + ability.level() + ' should not be undefined')
                                }
                            }
                        });
                        
                    }
                });
            });
        });
    };
    return {run: run}
});
