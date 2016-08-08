define(['require','exports','module','polyfill'],function (require, exports, module) {
    'use strict';
    require('polyfill');
    
    function HEROCALCULATOR () {
       // ...
    }
    
    var my = HEROCALCULATOR;
    
    my.prototype.heroData = {};
    my.prototype.itemData = {};
    my.prototype.unitData = {};
    my.prototype.abilityData = {};
    
    my.prototype.idCounter = 0;
    my.prototype.uniqueId = function (prefix) {
        var id = ++my.prototype.idCounter + '';
        return prefix ? prefix + id : id;
    };
    my.prototype.findWhere = function (arr, obj) {
        arrLoop: for (var i = 0; i < arr.length; i++) {
            objLoop: for (var key in obj) {
                if (arr[i][key] != obj[key]) {
                    continue arrLoop;
                }
            }
            return arr[i];
        }
    }
    my.prototype.uniques = function (arr) {
        var a = [];
        for (var i=0, l=arr.length; i<l; i++)
            if (a.indexOf(arr[i]) === -1 && arr[i] !== '')
                a.push(arr[i]);
        return a;
    }
    my.prototype.union = function (a, b) {
        var arr = a.concat(b);
        return my.prototype.uniques(arr);
    }

    my.prototype.init = function (HERODATA_PATH,ITEMDATA_PATH,UNITDATA_PATH, callback) {
        $.when(
            $.getJSON(HERODATA_PATH, function (data) {
                my.prototype.heroData = data;
                my.prototype.heroData['npc_dota_hero_chen'].abilities[2].behavior.push('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE');
                my.prototype.heroData['npc_dota_hero_nevermore'].abilities[1].behavior.push('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE');
                my.prototype.heroData['npc_dota_hero_nevermore'].abilities[2].behavior.push('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE');
                my.prototype.heroData['npc_dota_hero_morphling'].abilities[3].behavior.push('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE');
                my.prototype.heroData['npc_dota_hero_ogre_magi'].abilities[3].behavior.push('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE');
                my.prototype.heroData['npc_dota_hero_techies'].abilities[4].behavior.push('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE');
                my.prototype.heroData['npc_dota_hero_beastmaster'].abilities[2].behavior.push('DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE');
                var index = my.prototype.heroData['npc_dota_hero_lone_druid'].abilities[3].behavior.indexOf('DOTA_ABILITY_BEHAVIOR_HIDDEN');
                my.prototype.heroData['npc_dota_hero_lone_druid'].abilities[3].behavior.splice(index, 1);
                
                index = my.prototype.heroData['npc_dota_hero_abaddon'].abilities[2].behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE');
                my.prototype.heroData['npc_dota_hero_abaddon'].abilities[2].behavior.splice(index, 1);
                
                index = my.prototype.heroData['npc_dota_hero_riki'].abilities[2].behavior.indexOf('DOTA_ABILITY_BEHAVIOR_PASSIVE');
                my.prototype.heroData['npc_dota_hero_riki'].abilities[2].behavior.splice(index, 1);
                
                for (var h in my.prototype.heroData) {
                    my.prototype.HeroOptions.push(new my.prototype.HeroOption(h.replace('npc_dota_hero_', ''), my.prototype.heroData[h].displayname));
                }
            }),
            $.getJSON(ITEMDATA_PATH, function (data) {
                my.prototype.itemData = data;
            }),
            $.getJSON(UNITDATA_PATH, function (data) {
                my.prototype.unitData = data;
            })
        ).done(function(a1, a2, a3, a4){
            if (callback) callback();
        });
    }

    exports.HEROCALCULATOR = HEROCALCULATOR
});