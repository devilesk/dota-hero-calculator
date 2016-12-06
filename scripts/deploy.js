var config = require('../config.json');
var path = require('path');
var execSync = require('child_process').execSync;
var del = require('del');

// clean and move to deploy directory
del([
    path.normalize(config.path, '/**/*'),
    '!' + path.normalize(config.path, '/save'),
    '!' + path.normalize(config.path, '/save/*')
], {force: true});
execSync('cp dist/* ' + path.normalize(config.path));