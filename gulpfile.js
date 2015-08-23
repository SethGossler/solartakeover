'use strict';

//# Declarations
// Include Libs
var gulp = require('gulp'); 
var express = require('express');
var app = express();
var fs = require('fs');
// Include Our Gulp Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var inject = require("gulp-inject");
var flatten = require("gulp-flatten");
var liveReload = require("gulp-livereload");
var del = require("del");
var plumber = require("gulp-plumber");
var ifElse = require("gulp-if-else");
var gutil = require('gulp-util');
var notify = require('gulp-notify');

// base dirs
var statesDir = 'src/states/';
var viewsDir = 'src/views/';
var coreDir = 'src/core/';
var coreCSSDir = coreDir+"assets/css/";
// gulp srcs
var states = statesDir+"*";
var views = viewsDir+"*";
var statesJS = states+"/*.js";
var statesPartials = states+"/*.html";
var statesSCSS = states+"/*.scss";
var viewsJS = views+"/*.js";
var viewsPartials = views+"/*.html";
var viewsSCSS = views+"/*.scss";
// global vars
var that = this;
var _building = true;

//# Functions for common functions between tasks
function plumberErrorHandler(err) {
    notifyMessage(err);
    this.emit('end');
}

function notifyMessage(message, opts) {
    gutil.log(message);
    notify(message);
}

//# Gulp Tasks
// Lint Task
gulp.task('lint', function() {
    return gulp.src( [statesJS, viewsJS] )
        .pipe(plumber({errorHandler: plumberErrorHandler}))
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});
// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src( [statesSCSS, viewsSCSS] )
        .pipe(plumber({errorHandler: plumberErrorHandler}))
        .pipe(sass({
            includePaths: [ coreCSSDir ],
            onError: function(err){
               notifyMessage(err)
            }
        }))
        .pipe(concat('styles.css'))
        .pipe(gulp.dest( 'build/assets/css/' ))
        .pipe(ifElse( !_building, liveReload ));
});
// Concat States and Views files
gulp.task('scripts', function() {
    return gulp.src( [statesJS, viewsJS] )
        .pipe(plumber({errorHandler: plumberErrorHandler}))
        .pipe(concat('modules.js'))
        .pipe(gulp.dest( 'build/assets/js/' ))
        .pipe(ifElse( !_building, liveReload ));
});
// Inject States and Views html partials
gulp.task('partials', function() {
    return gulp.src( 'src/core/index.html' )
        .pipe(plumber({errorHandler: plumberErrorHandler}))
        .pipe( inject(gulp.src( [statesPartials, viewsPartials] ), {
            starttag: '<!-- inject:partials:html -->',
            transform: function (filePath, file) {
                return file.contents.toString('utf8');
            }
        }))
        .pipe(gulp.dest( 'build/' ))
        .pipe(ifElse( !_building, liveReload ));
});
// Copy asset files
gulp.task('assets', function() {
    return gulp.src( states+"/assets/*.*" )
        .pipe(plumber({errorHandler: plumberErrorHandler}))
        .pipe( flatten() )
        .pipe(gulp.dest('build/assets/img/'))
        .pipe(ifElse( !_building, liveReload ));
});
// move core files
gulp.task('core', function() {
    console.log(" ProMoba Team Manager ");
    return gulp.src( ['src/core/**', "!src/core/assets/css/**"], {base:'./src/core/'} )
        .pipe(plumber({errorHandler: plumberErrorHandler}))
        .pipe(gulp.dest('build'))
        .pipe(ifElse( !_building, liveReload ));
});
// Compile Our Core Sass Sass
gulp.task('core-sass', function() {
    return gulp.src( 'src/core/assets/css/*.scss', {base:'./src/core/'} )
        .pipe(plumber({errorHandler: plumberErrorHandler}))
        .pipe(sass())
        .pipe(concat('core.css'))
        .pipe(gulp.dest( 'build/assets/css/' ))
        .pipe(ifElse( !_building, liveReload ));
});
// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch( [statesJS, viewsJS], ['lint', 'scripts']);
    gulp.watch( [statesSCSS, viewsSCSS], ['sass']);
    gulp.watch( [statesPartials, viewsPartials], ['partials']);
    gulp.watch( states+"/assets/*.*", ['assets']);
    gulp.watch( 'src/core/assets/css/*.scss', ['core-sass']); 
});
// Remove all files from build dir
gulp.task('remove-it-all', function(){
    return del(['build']);
});
// Run our server
gulp.task('server', function() {
    console.log(" Server On Port 3000 ");
    app.use(require('connect-livereload')());
    app.use(express.static(__dirname + '/build'));
    app.listen(3000);
    liveReload.listen({quiet:true});
});

//# Default Task
// Default watch task
gulp.task('default', ['core', 'core-sass', 'partials', 'sass', 'scripts', 'assets', 'watch', 'server'], function(){
    //# dependency tasks are done
    // ..so we're not building anymore
    _building = false;
});
// Build out files without watch
gulp.task('build', ['core', 'core-sass', 'partials', 'sass', 'scripts', 'assets']);
// Clean out the build dir
gulp.task('clean', ['remove-it-all']);