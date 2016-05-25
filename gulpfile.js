var gulp = require('gulp');
var concat = require('gulp-concat');
var jasmine = require('gulp-jasmine');

gulp.task('default', function () {
    return gulp.src(['./lib/quintus-all.js', './src/*.js'])
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./build/'));
});
