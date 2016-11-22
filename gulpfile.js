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

gulp.task('css', function () {
    return gulp.src([
          '!www/css/hero-calculator.theme.light.css',
          '!www/css/hero-calculator.theme.dark.css',
          '!www/css/qunit-2.0.1.css',
          'www/css/*.css'
        ])
        .pipe(concat('hero-calculator.css'))
        .pipe(minifyCSS())
        .pipe(rename('hero-calculator.min.css'))
        .pipe(gulp.dest('dist/css'))
});

gulp.task('css-themes', function () {
    return gulp.src([
          'www/css/hero-calculator.theme.light.css',
          'www/css/hero-calculator.theme.dark.css'
        ])
        .pipe(minifyCSS())
        .pipe(gulp.dest('dist/css'))
});

gulp.task('copy-navbar', function () {
    return gulp.src('/srv/www/dev.devilesk.com/dota2/.navbar.html')
        .pipe(replace('<div class="navbar navbar-default main_nav">', '<div class="navbar navbar-default main_nav" data-bind="visible: !sideView()">'))
        .pipe(gulp.dest('www/'))
});

gulp.task('html', ['copy-navbar'], function () {
    return gulp.src('www/index.html')
        .pipe(preprocess({
            context: {
                NODE_ENV: 'production',
                COMMIT_HASH: git.short()
            }
        })) //To set environment variables in-line 
        .pipe(replace('bootstrap.css', 'bootstrap.min.css'))
        .pipe(gulp.dest('dist/'))
});

gulp.task('stage-files', function () {
    return gulp.src(['www/save.php', 'www/report.php', 'www/changelog.txt'])
        .pipe(gulp.dest('dist/'))
});

gulp.task('image', function () {
    return gulp.src('www/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'))
});

/*gulp.task('build', function (cb) {
    var flags = ['run-script', 'build-prod'];
    var cmd = spawn('npm', flags, {stdio: 'inherit'});
    return cmd.on('close', cb);
});*/

gulp.task('bundle-prod', function () {
    return browserify(['./www/js/main.js'], {debug:true})  // Pass browserify the entry point
        .external('knockout')
        .external('jquery')
        .transform('brfs')
        .transform('browserify-replace', {
            replace: [
                { from: /#DEV_BUILD/, to: new Date().toString() }
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

gulp.task('bundle', function () {
    return browserify('./www/js/main.js', {debug:true})  // Pass browserify the entry point
        .external('knockout')
        .external('jquery')
        .transform('brfs')
        .bundle()
        .pipe(source('./www/js/main.js'))
        .pipe(buffer())
        .pipe(rename('bundle.js'))
        .pipe(gulp.dest('./www/js/'))
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

gulp.task('purge-cache', function (cb) {
    var files = [
            'http://devilesk.com/dota2/apps/hero-calculator/js/main.js',
            'http://devilesk.com/dota2/apps/hero-calculator/css/hero-calculator.min.css',
            'http://devilesk.com/dota2/apps/hero-calculator/css/hero-calculator.theme.dark.css',
            'http://devilesk.com/dota2/apps/hero-calculator/css/hero-calculator.theme.light.css',
            'http://devilesk.com/dota2/apps/hero-calculator/img/hero-calculator.items.png'
        ],
        counter = 0;
    files.forEach(function (f) {
        request.post({
            url:'https://www.cloudflare.com/api_json.html',
            form: {
                a: 'zone_file_purge',
                tkn: config.cloudflare_token,
                email: 'devilesk@gmail.com',
                z: 'devilesk.com',
                url: f
            }
        },
        function (err, httpResponse, body){
            counter++;
            console.log(body);
            if (counter >= files.length) cb();
        });
    });
});

gulp.task('clean', function () {
    return del([
        './dist/**/*'
    ], {force: true});
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

gulp.task('staging', gulpSequence('bundle-prod', ['css', 'css-themes', 'html', 'image', 'stage-files']));

gulp.task('full-deploy', gulpSequence('staging', 'rollbar', 'clean-deploy', 'deploy', 'rollbar-deploy-tracking', 'purge-cache'));