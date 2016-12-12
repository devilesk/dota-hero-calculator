var fs = require('fs');
var git = require('git-rev-sync');
var browserify = require('browserify');
var opts = {
    debug:true,
    standalone: 'DotaHeroCalculator'
};

browserify(['./src/js/main.js'], opts)  // Pass browserify the entry point
        .exclude('knockout')
        .exclude('jquery')
        .transform('brfs')
        .transform('browserify-replace', {
            replace: [
                { from: /#DEV_BUILD/, to: new Date().toString() },
                { from: /#code_version/, to: git.long() },
                { from: /environment: 'development'/, to: "environment: 'production'" }
            ]
        })
        .plugin('minifyify', {
            map: 'bundle.min.js.map',
            output: 'build/bundle.min.js.map'
        })
        .bundle()
        .on('error', console.error)
        .pipe(fs.createWriteStream('./build/bundle.min.js'));