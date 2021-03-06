var gulp = require('gulp');
var concat = require('gulp-concat');
//var uglify = require('gulp-uglify');
//var streamify = require('gulp-streamify');

gulp.task('default', function () {
    return gulp.src(['./public/lib/quintus-all.js',
                     './public/src/game.js',
                     '!./public/src/test.js',
                     '!./public/src/lobby.js',
                     '!./public/src/room.js',
                     './public/src/*.js'])
        .pipe(concat('all.min.js'))
        //.pipe(streamify(uglify()))
        .pipe(gulp.dest('./public/build/'));
});

gulp.task('tests', function () {
    return gulp.src(['spec/tests/*.js'])
        .pipe(concat('tests.min.js'))
        //.pipe(streamify(uglify()))
        .pipe(gulp.dest('./public/build/'));
});

gulp.task('testing', function () {
    return gulp.src(['./public/lib/quintus-all.js',
                     './public/src/test.js',
                     './public/src/game.js',
                     '!./public/src/lobby.js',
                     '!./public/src/room.js',
                     './public/src/*.js'])
        .pipe(concat('alltest.min.js'))
        //.pipe(streamify(uglify()))
        .pipe(gulp.dest('./public/build/'));
});
