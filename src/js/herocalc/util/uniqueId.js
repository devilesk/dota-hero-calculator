"use strict";

var idCounter = 0;
var uniqueId = function (prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
};

module.exports = uniqueId;