require('es6-promise').polyfill();

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    jade = require('gulp-jade'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    oldie = require('oldie'),
    imagemin = require('gulp-imagemin'),
    fileinclude = require('gulp-file-include'),
    clean = require('gulp-clean');


gulp.task('clean', function () {
    gulp.src('../public/html/*', {read: false})
        .pipe(clean({force: true}));
    gulp.src('../public/css/*', {read: false})
        .pipe(clean({force: true}));
    gulp.src('../public/js/*', {read: false})
        .pipe(clean({force: true}));
    gulp.src('../public/img/*', {read: false})
        .pipe(clean({force: true}));
});

gulp.task('buildClean', function () {
    gulp.src('../build/**', {read: false})
        .pipe(clean({force: true}));
});


gulp.task('server', ['publicStyles', 'templates'], function() {
    browserSync({
        server: {
            baseDir: '../public',
            directory: true,
            ghostMode: false
            // Append '.xip.io' to the hostname. (eg: http://192.168.1.164.xip.io:3002)
            // xip: true
        },
        ui: {
            port: 1001
        },
        port: 1000
    });
});


gulp.task('templates', function() {
    gulp.src('templates/*.html')
        .pipe(fileinclude({
          prefix: '@@',
          basepath: '@file'
        }))
        .pipe( gulp.dest('../public/') )
});

gulp.task('html', function() {
    gulp.src('../public/*.html')
        .pipe( gulp.dest('../build/') )
});


gulp.task('publicStyles', function() {
    var processors = [
        // autoprefixer({browsers: ['> 1%']}),
        cssnano()
    ];
    gulp.src('styles/inheritable-css/*.css')
        .pipe( gulp.dest('../public/css') );

    gulp.src('styles/*.scss')
        .pipe( sass().on('error', sass.logError) )
        .pipe( sourcemaps.init() )
        .pipe( sourcemaps.write() )
        .pipe( gulp.dest('../public/css') )
        .pipe( postcss(processors) )
        .pipe( gulp.dest('../public/css') );
});
gulp.task('buildStyles', function() {
    var processors = [
        // autoprefixer({browsers: ['>1%']}),
        cssnano()
    ];
    gulp.src('styles/inheritable-css/*.css')
        .pipe( gulp.dest('../build/css') );

    gulp.src('styles/*.scss')
        .pipe( sass().on('error', sass.logError) )
        .pipe( gulp.dest('../build/css') )
        .pipe( postcss(processors) )
        .pipe( gulp.dest('../build/css') );
});


gulp.task('publicScripts', function() {
    gulp.src('scripts/*')
        .pipe( gulp.dest('../public/js') );
});

gulp.task('buildScripts', function() {
    gulp.src('scripts/*')
        .pipe( concat('main.js') )
        .pipe( uglify() )
        .pipe( gulp.dest('../build/js') );
});


gulp.task('publicImages', function() {
    gulp.src('images/*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe ( gulp.dest('../public/img') );
});
gulp.task('buildImages', function() {
    gulp.src('../public/images/*')
        .pipe ( gulp.dest('../build/img') );
});


gulp.task('watch', function() {
    gulp.watch('scripts/**/*.js', ['publicScripts']);
    gulp.watch('styles/**/*.scss', ['publicStyles']);
    gulp.watch('templates/**/*.html', ['templates']);
    gulp.watch(['scripts/**/*.js', 'styles/**/*.scss', 'templates/**/*.html'], {cwd: ''}, reload);
});

//Dev > Public task
gulp.task('default', ['clean', 'publicImages', 'templates', 'publicStyles', 'publicScripts', 'server', 'watch']);

gulp.task('build', ['buildClean', 'buildImages', 'html', 'buildStyles', 'publicScripts']);

