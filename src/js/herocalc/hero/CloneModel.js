'use strict';
var HeroModel = require("./HeroModel");

var CloneModel = function (heroData, itemData, h,p) {
    var self = this;
    HeroModel.call(this, heroData, itemData, h);
    self.parent = p;
    return self;
}
CloneModel.prototype = Object.create(HeroModel.prototype);
CloneModel.prototype.constructor = CloneModel;

module.exports = CloneModel;