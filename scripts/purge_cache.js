var config = require('../config.json');
var request = require('request');

// purge cloudflare cache
config.cached_files.forEach(function (f) {
    request.post({
        url:'https://www.cloudflare.com/api_json.html',
        form: {
            a: 'zone_file_purge',
            tkn: config.cloudflare_token,
            email: config.cloudflare_email,
            z: config.cloudflare_z,
            url: f
        }
    },
    function (err, httpResponse, body) { console.log(body); });
});