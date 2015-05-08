// Load plugins
  var gulp = require('gulp'),
      replace = require('gulp-replace'),
      htmlmin = require('gulp-htmlmin'),
      sass = require('gulp-ruby-sass'),
      minifycss = require('gulp-minify-css'),
      jshint = require('gulp-jshint'),
      uglify = require('gulp-uglify'),
      imagemin = require('gulp-imagemin'),
      rename = require('gulp-rename'),
      concat = require('gulp-concat'),
      notify = require('gulp-notify'),
      cache = require('gulp-cache'),
      livereload = require('gulp-livereload'),
      del = require('del'),
      postcss = require('gulp-postcss'),
      autoprefixer = require('autoprefixer-core'),
      mqpacker = require('css-mqpacker'),
      csswring = require('csswring');

// PostCSS
  gulp.task('css', function () {
      var processors = [
          autoprefixer({browsers: ['last 1 version']}),
          mqpacker,
          csswring
      ];
      return gulp.src('./src/*.css')
          .pipe(postcss(processors))
          .pipe(gulp.dest('./dest'));
  });

// Minify HTML
  gulp.task('minify', function() {
    return gulp.src('src/*.php')
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest('build'))
  });

// Clear cache
  gulp.task('clear', function (done) {
    return cache.clearAll(done);
  });

// Replace
  gulp.task('replace', ['minify'], function(){
    gulp.src(['*.php'])
      .pipe(replace('data-bodyclass', '<?php body_class(); ?>'))
      .pipe(gulp.dest('build'));
  });

// Styles
  gulp.task('sass', function() {
    return sass('src/scss/style.scss', {style: 'expanded'})
      .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
      .pipe(gulp.dest('build/css'))
      .pipe(rename({ suffix: '.min' }))
      .pipe(minifycss())
      .pipe(gulp.dest('build/css'))
      .pipe(notify({ message: 'Styles task complete' }));
  });
// Scripts
  gulp.task('scripts', function() {
    return gulp.src('src/js/*.js')
      .pipe(jshint('.jshintrc'))
      .pipe(jshint.reporter('default'))
      // .pipe(concat('scripts.js'))
      .pipe(gulp.dest('build/js'))
      .pipe(rename({ suffix: '.min' }))
      .pipe(uglify())
      .pipe(gulp.dest('build/js'))
      .pipe(notify({ message: 'Scripts task complete' }));
  });
 
// Images
  gulp.task('images', ['clear'], function() {
    return gulp.src('src/img/**/*')
      .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
      .pipe(gulp.dest('build/img'))
      .pipe(notify({ message: 'Images task complete' }));
  });
 
// Clean
  gulp.task('clean', function(cb) {
      del(['css', 'js', 'img'], cb)
  });
 
// Default task
  gulp.task('build', ['clean'], function() {
      gulp.start('replace','sass', 'scripts', 'images');
  });
 
// Watch
  gulp.task('watch', function() {
   
    // Watch .scss files
    gulp.watch('src/scss/**/*.scss', ['sass']);
   
    // Watch .js files
    gulp.watch('src/js/**/*.js', ['scripts']);
   
    // Watch image files
    gulp.watch('src/img/**/*', ['images']);

    // Watch php files
    gulp.watch('src/*.php', ['replace']);
   
    // Create LiveReload server
    // livereload.listen();
   
    // Watch any files in build/, reload on change
    // gulp.watch(['/']).on('change', livereload.changed);
   
  });