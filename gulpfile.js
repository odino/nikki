'use strict';
var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    runSequence = require('run-sequence'),
    browserify = require('gulp-browserify');

gulp.task('browserify', function() {
    gulp.src('client/scripts/index.js')
        .pipe(browserify({
            insertGlobals : true
        }))
        .pipe(gulp.dest('./client'));
});

gulp.task('server', function(cb) {
    plugins.nodemon({
        script: 'server/index.js',
        ext: 'js',
        env: {'NODE_ENV': 'development', 'DEBUG': 'nikki:*'},
        args: ['--port=9000', '--no-open', '--daemon', '--dport=9001']
    });
    cb();
});

gulp.task('watch', function () {
    gulp.watch('client/scripts/**/*.js', ['browserify']);
});

/**
 * Start the fun
 */
gulp.task('develop', function(cb) {
    runSequence(
        'browserify',
        'server',
        'watch',
        cb
    );
});

/**
 * Default task to run nikki in dev
 */
gulp.task('default', function(cb) {
    gulp.start('develop');
});