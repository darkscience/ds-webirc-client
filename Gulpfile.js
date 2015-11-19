var gulp = require('gulp'),
    webpack = require('webpack-stream'),
    less = require('gulp-less'),
    sourcemaps = require('gulp-sourcemaps'),
    fse = require('fs-extra'),
    path = require('path'),
    os = require('os'),
    colors = require('colors'),
    _ = require('lodash');

var paths = {
  src: {
    js: './src/js/**/*',
    less: './src/less/index.less',
    html: './src/index.html'
  },

  dest: {
    js: './dist/js/',
    css: './dist/css/',
    html: './dist/'
  }
};

gulp.task('default', ['js', 'css', 'html'], _.noop);

gulp.task('html', function() {
  gulp.src(paths.src.html)
    .pipe(gulp.dest(paths.dest.html));
});

gulp.task('js', function() {
  gulp.src(paths.src.js)
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest(paths.dest.js));
});

gulp.task('css', function() {
  fse.mkdirs('./build/less');
  _.forOwn({
    'normalize.css/normalize.css': 'normalize.css',
    'normalize-opentype.css/normalize-opentype.css': 'normalize-opentype.css',
    'bootstrap/less': 'bootstrap'
  }, function(dest, src) {
    src = path.resolve(__dirname, 'node_modules', src);
    dest = path.resolve(__dirname, 'build/less', dest);
    if (!fse.existsSync(dest)) {
      if (os.platform() == 'win32')
        fse.copySync(src, dest);
      else
        fse.symlinkSync(src, dest);
    }
  });
  gulp.src(paths.src.less)
    .pipe(sourcemaps.init())
    .pipe(less({
      paths: [
        path.resolve(__dirname, 'src/less/include'),
        path.resolve(__dirname, 'build/less')
      ]
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dest.css));
});

gulp.task('clean', function() {
  fse.removeSync('./dist');
  fse.removeSync('./build');
})

gulp.task('watch', ['html', 'css'], function() {
  console.log("Watching HTML and LESS, use `webpack -w` to watch JS.".red);
  gulp.watch(paths.src.html, ['html']);
  gulp.watch('./src/less/**/*', ['css']);
});
