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
    src_image = './img',
    dist_js = './dist/js',
    dist_css = './dist/css',
    dist_image = './dist/img';

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

gulp.task('image', function () {
    gulp.src(src_image + '/*.png')
        .pipe(gulp.dest(dist_image));
});

gulp.task('watch', function () {
    gulp.watch(src_css + '/**/*.css', ['mincss']);
    gulp.watch(src_js + '/**/*.js', ['minjs']);
});

//总体函数
gulp.task('default', function () {
    gulp.run('minjs', 'mincss');
    //gulp.run('watch');
});