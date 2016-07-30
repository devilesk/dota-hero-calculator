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

    exports.HEROCALCULATOR = HEROCALCULATOR
});