var gulp = require('gulp');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var preprocess = require('gulp-preprocess');
var imagemin = require('gulp-imagemin');
var rjs = require('requirejs');
var fs = require('fs');

gulp.task('default', ['build', 'css', 'html', 'image']);

gulp.task('css', ['build'], function (){
    gulp.src([
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
    gulp.src('www/index.html')
        .pipe(preprocess({context: { NODE_ENV: 'production'}})) //To set environment variables in-line 
        .pipe(gulp.dest('dist/'))
});

gulp.task('image', ['build'], function () {
    gulp.src('www/img/*')
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