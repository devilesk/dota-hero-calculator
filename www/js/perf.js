var hc = new HeroCalc();
hc.init("/media/js/herodata.json","/media/js/itemdata.json","/media/js/unitdata.json", function () {
    
    var total = 0;
    var iter = 100;
    for (var i = 0; i < iter; i++) {
        var t0 = performance.now();
        for (var h in HeroCalc.prototype.heroData) {
            var hero = new HeroCalc.prototype.HeroModel(h.replace('npc_dota_hero_', ''));
            //console.log(h, hero);
        }
        var t1=performance.now();
        //console.log('done', t1-t0);
        total += t1 - t0;
    }
    console.log(total/iter);
    /*console.log('start');
    var t0 = performance.now();
    var hero = new HeroCalc.prototype.HeroModel('axe');
    var a = hero.ability();
    for (var j = 0; j < 100; j++) {
        for (var i = 0; i < a.abilities().length; i++) {
            var ability = a.abilities()[i];
        }
    }
    var t1=performance.now();
    console.log('done', t1-t0);
    
    var t0 = performance.now();
    var hero = new HeroCalc.prototype.HeroModel('axe');
    var a = hero.ability();
    for (var j = 0; j < 100; j++) {
        var abilities = a.abilities();
        for (var i = 0; i < a.abilities().length; i++) {
            var ability = abilities[i];
        }
    }
    var t1=performance.now();
    console.log('done', t1-t0);*/
});
