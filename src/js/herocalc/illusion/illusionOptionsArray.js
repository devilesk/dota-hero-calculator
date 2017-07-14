var IllusionOption = require("./IllusionOption");
var illusionData = require("./illusionData");

var illusionOptionsArray = [];
for (var h in illusionData) {
    illusionOptionsArray.push(new IllusionOption(h, illusionData[h].displayName, illusionData[h].hero));
}

module.exports = illusionOptionsArray;