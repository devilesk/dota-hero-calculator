'use strict';

var core = {};
core.InventoryViewModel = require("./inventory/InventoryViewModel");
core.AbilityModel = require("./AbilityModel");
core.BuffViewModel = require("./BuffViewModel");
core.HeroModel = require("./hero/HeroModel");
core.CloneModel = require("./hero/CloneModel");
core.UnitModel = require("./hero/UnitModel");
core.IllusionModel = require("./hero/IllusionModel");
core.Data = require("./data/main");
core.Util = require("./util/main");

core.init = function (HERODATA_PATH, ITEMDATA_PATH, UNITDATA_PATH, callback) {
    core.Data.init(HERODATA_PATH, ITEMDATA_PATH, UNITDATA_PATH, function () {
        core.HeroOptions = require("./hero/heroOptionsArray").init(core.Data.heroData);
        core.BuffOptions = require("./buffs/buffOptionsArray").init(core.Data.heroData, core.Data.unitData);
        core.DebuffOptions = require("./buffs/debuffOptionsArray").init(core.Data.heroData, core.Data.unitData);
        core.ItemOptions = require("./inventory/itemOptionsArray").init(core.Data.itemData);
        core.ItemBuffOptions = require("./inventory/itemBuffOptions").init(core.Data.itemData);
        core.ItemDebuffOptions = require("./inventory/itemDebuffOptions").init(core.Data.itemData);
        callback();
    });
}

module.exports = core;