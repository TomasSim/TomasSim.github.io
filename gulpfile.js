var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'),
    connect = require('gulp-connect'),
    image = require('gulp-image'),
    sass = require('gulp-sass');
    spritesmith = require("gulp-spritesmith"),
    gulpif = require("gulp-if");

gulp.task('sprites', function () {
        gulp.src('./src/sprites/*.png')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            styleName: 'sprite.css',
            imgPath: '../img/sprite.png'
        }))
        .pipe(gulpif('*.png', gulp.dest('./build/images/')))
        .pipe(gulpif('*.css', gulp.dest('./src/style/sprite')));
});

gulp.task('connect', function () {
  connect.server({
        livereload: true,
        port: 8080
      });
});

gulp.task('image', function () {
    gulp.src('./build/images/portfolio/*')
        .pipe(image({
            pngquant: true,
            optipng: false,
            zopflipng: true,
            jpegRecompress: true,
            jpegoptim: true,
            mozjpeg: true,
            guetzli: false,
            gifsicle: true,
            svgo: true,
            concurrent: 10
        }))
        .pipe(gulp.dest('./build/images'));
});

gulp.task('scripts', function () {
  gulp.src('src/js/main.js')
  .pipe(concat('main.min.js'))
  .pipe(gulp.dest('build/js'))
  .pipe(connect.reload());
});

gulp.task('scripts-prod', function () {
    gulp.src(['build/js/main.min.js', 'build/js/build.js'])
        .pipe(uglify())
        .pipe(gulp.dest('build/js'))
        .pipe(connect.reload());
});

gulp.task('styles', function () {
  gulp.src('src/style/style.scss')
  .pipe(concat('style.min.scss'))
  .pipe(sass())
  .pipe(autoprefixer({
            browsers: ['last 4 versions']
          }))
  .pipe(gulp.dest('build/style'))
  .pipe(connect.reload());
});

gulp.task('styles-prod', function () {
    gulp.src('build/style/style.min.css')
        .pipe(clean())
        .pipe(gulp.dest('build/style'))
        .pipe(connect.reload());
});

gulp.task('html', function () {
  gulp.src('*.html')
  .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch('*.html', ['html']);
  gulp.watch('src/style/*.scss', ['styles']);
  gulp.watch('src/js/*.js', ['scripts']);
});

gulp.task('dev', ['scripts', 'styles', 'html', 'connect', 'watch']);
gulp.task('prod', ['scripts-prod', 'styles-prod', 'html', 'image']);