var gulp = require('gulp');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var preprocess = require('gulp-preprocess');
var replace = require('gulp-replace');
var imagemin = require('gulp-imagemin');
var fs = require('fs');
var rollbar = require('gulp-rollbar');
var git = require('git-rev-sync');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var gulpSequence = require('gulp-sequence');
var chmod = require('gulp-chmod');
var request = require('request');
var spawn = require('child_process').spawn;
var config = require('./config.json');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');

gulp.task('bundle-prod', function () {
    return browserify(['./www/js/main.js'], {debug:true})  // Pass browserify the entry point
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
        .bundle()
        .pipe(source('./www/js/main.js'))
        .pipe(buffer())
        .pipe(rename('bundle.' + git.short() + '.js'))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/js/'))
        
})

gulp.task('rollbar', function () {
    return gulp.src('dist/**/*.js')
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(rollbar({
          accessToken: config.rollbar_token,
          version: git.long(),
          sourceMappingURLPrefix: 'http://devilesk.com/dota2/apps/hero-calculator/js'
        }))
});

gulp.task('rollbar-deploy-tracking', function (cb) {
    request.post({
        url:'https://api.rollbar.com/api/1/deploy/',
        form: {
            access_token: config.rollbar_token,
            environment: 'production',
            revision: git.long(),
            local_username: 'devilesk',
            rollbar_username: 'devilesk'
        }
    },
    function (err, httpResponse, body){
        cb();
    });
});


gulp.task('clean-deploy', function () {
    return del([
        '/srv/www/devilesk.com/dota2/apps/hero-calculator/**/*',
        '!/srv/www/devilesk.com/dota2/apps/hero-calculator/save',
        '!/srv/www/devilesk.com/dota2/apps/hero-calculator/save/*'
    ], {force: true});
});

gulp.task('deploy', function () {
    return gulp.src([
            'dist/**/*',
            '!dist/save',
            '!dist/save/*'
        ])
        .pipe(chmod(755))
        .pipe(gulp.dest('/srv/www/devilesk.com/dota2/apps/hero-calculator'));
});

gulp.task('staging', gulpSequence('clean', 'bundle-prod', ['css', 'html', 'image', 'stage-files']));

gulp.task('full-deploy', gulpSequence('staging', 'rollbar', 'clean-deploy', 'deploy', 'rollbar-deploy-tracking', 'purge-cache'));