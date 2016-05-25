var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');

gulp.task('default', function () {
    return gulp.src(['./lib/quintus-all.js', './src/game.js', './src/*.js'])
        .pipe(concat('all.min.js'))
        .pipe(streamify(uglify()))
        .pipe(gulp.dest('./build/'));
});

gulp.task('tests', function () {
    return gulp.src(['spec/tests/*.js'])
        .pipe(concat('tests.min.js'))
        .pipe(streamify(uglify()))
        .pipe(gulp.dest('./build/'));
});
