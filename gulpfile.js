/**
 * Created by lenovo on 2017/5/18.
 */

var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var mincss = require('gulp-mini-css');


var src_css = './css',

    src_js = './js',
    dist_js = './dist/js',
    dist_css = './dist/css';

gulp.task('mincss', function () {
    gulp.src(src_css + '/**/*.css')
        .pipe(mincss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(dist_css));
});

gulp.task('minjs', function () {
    gulp.src(src_js + '/**/*.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(dist_js));
});

gulp.task('watch', function () {
    gulp.watch(src_css + '/**/*.css', ['mincss']);
    gulp.watch(src_js + '/**/*.js', ['minjs']);
});

//总体函数
gulp.task('default', function () {
    gulp.run('minjs', 'mincss');
    gulp.run('watch');
});