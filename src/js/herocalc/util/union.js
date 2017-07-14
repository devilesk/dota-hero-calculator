"use strict";
var uniques = require("./uniques");

var union = function (a, b) {
    var arr = a.concat(b);
    return uniques(arr);
}

module.exports = union;