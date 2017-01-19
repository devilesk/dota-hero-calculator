var config = require('../config.json');
var glob = require("glob")
var chmod = require('chmod');
var path = require('path');

var env = process.argv.indexOf('production') !== -1 ? 'production': 'development';
console.log('env', env);

var deployPath = config.deployPath[env];
var normalizedPath = path.normalize(deployPath);

glob("{www,dist}/**/*.php", function (er, files) {
    console.log(files);

    files.forEach(function (filePath) {
        chmod(filePath, 755);
    });
});

glob(normalizedPath + '/**/*.php', function (er, files) {
    console.log(files);

    files.forEach(function (filePath) {
        chmod(filePath, 755);
    });
});