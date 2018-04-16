var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var runSequence = require('run-sequence');

gulp.task('sass', function() {
    return gulp.src('assets/scss/styles.scss')
        .pipe(sass()) // Converts Sass to css with gulp-sass
        .pipe(autoprefixer({ // generates css prefixes using CanIUse
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('assets/css'))
});

gulp.task('watch', ['sass'], function() {
    gulp.watch('assets/scss/**/*.scss', ['sass']);
});

gulp.task('default', ['sass']);