var pp = require('preprocess');
var config = require('../config');

config.NODE_ENV = process.env.NODE_ENV || 'dev';
console.log('NODE_ENV', config.NODE_ENV);
if (config.NODE_ENV === 'dev') {
    pp.preprocessFileSync('src/index.html', 'www/index.html', config);
}
else {
    pp.preprocessFileSync('src/index.html', 'build/index.html', config);
}