console.log('HeroCalc', HeroCalc);
var hc = new HeroCalc();
hc.init("/media/js/herodata.json","/media/js/itemdata.json","/media/js/unitdata.json", function () {
    console.log('HeroCalc', HeroCalc.prototype);
    
    var t0 = performance.now();
    for (var i = 0; i < 10; i++) {
        for (var h in HeroCalc.prototype.heroData) {
            var hero = new HeroCalc.prototype.HeroModel(h.replace('npc_dota_hero_', ''));
            //console.log(h, hero);
        }
    }
    var t1=performance.now();
    console.log('done', t1-t0);
});
