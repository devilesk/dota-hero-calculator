var gulp = require('gulp');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var preprocess = require('gulp-preprocess');
var imagemin = require('gulp-imagemin');
var rjs = require('requirejs');
var fs = require('fs');
var rollbar = require('gulp-rollbar');
var git = require('git-rev-sync');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var gulpSequence = require('gulp-sequence');
var request = require('request');
var config = require('./config.json');

gulp.task('default', ['full-build']);

gulp.task('css', ['build'], function (){
    return gulp.src([
          '!www/css/hero-calculator.theme.light.css',
          '!www/css/hero-calculator.theme.dark.css',
          'www/css/*.css'
        ])
        .pipe(concat('hero-calculator.css'))
        .pipe(minifyCSS())
        .pipe(rename('hero-calculator.min.css'))
        .pipe(gulp.dest('dist/css'))
});

gulp.task('html', ['build'], function () {
    return gulp.src('www/index.html')
        .pipe(preprocess({context: { NODE_ENV: 'production'}})) //To set environment variables in-line 
        .pipe(gulp.dest('dist/'))
});

gulp.task('image', ['build'], function () {
    return gulp.src('www/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'))
});

gulp.task('build', function (cb) {
    rjs.optimize({
        appDir: "www",
        baseUrl: "js",
        dir: "dist",
        packages: ["herocalc", "components"],
        mainConfigFile: "www/js/main.js",
        optimize: "uglify2",
        findNestedDependencies: true,
        generateSourceMaps: true,
        preserveLicenseComments: false,
        useSourceUrl: false,
        onBuildWrite   : function(name, path, contents) {
            console.log('Writing: ' + name);
            if (name === 'main') {
                // output the original source contents
                console.log(contents);
                // perform transformations on the original source
                contents = contents.replace(/#DEV_BUILD/, new Date().toString());
                contents = contents.replace(/development/, 'production');
                contents = contents.replace(/#code_version/, git.long());
                // output the processed contents
                console.log(contents);
            }
            // return contents
            return contents;
        },
        modules: [
            {
                name: "main"
            }
        ]
    }, function (buildResponse){
        // console.log('build response', buildResponse);
        cb();
    }, cb);
});

gulp.task('rollbar', ['build'], function () {
    return gulp.src('dist/**/*.js')
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(rollbar({
          accessToken: config.access_token,
          version: git.long(),
          sourceMappingURLPrefix: 'http://devilesk.com/dota2/apps/hero-calculator/js'
        }))
});

gulp.task('rollbar-deploy-tracking', function (cb) {
    request.post({
        url:'https://api.rollbar.com/api/1/deploy/',
        form: {
            access_token:config.access_token,
            environment: 'production',
            revision: git.long(),
            local_username: 'devilesk',
            rollbar_username: 'devilesk'
        }
    },
    function (err, httpResponse, body){
        cb();
    })
});

gulp.task('clean', function () {
    return del([
        '/srv/www/devilesk.com/dota2/apps/hero-calculator/**/*',
        '!/srv/www/devilesk.com/dota2/apps/hero-calculator/save',
        '!/srv/www/devilesk.com/dota2/apps/hero-calculator/save/*'
    ], {force: true});
});

gulp.task('deploy', ['clean'], function () {
    return gulp.src('dist/**/*')
        .pipe(gulp.dest('/srv/www/devilesk.com/dota2/apps/hero-calculator'));
});

gulp.task('full-build', ['build', 'css', 'html', 'image']);

gulp.task('full-deploy', gulpSequence('build', 'css', 'html', 'image', 'rollbar', 'deploy', 'rollbar-deploy-tracking'));