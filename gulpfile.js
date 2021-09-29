const gulp = require('gulp');

const pug = require('gulp-pug');
const postcss = require('gulp-postcss');
const postcssPlugins = [
  require('postcss-import'),
  require('postcss-csso'),
];

const rename = require('gulp-rename');

const del = require('del');
const server = require('browser-sync').create();
const webpack = require('webpack-stream');

const package = require('./package.json');

function useEnv(environment) {
  return (cb) => {
    process.env.NODE_ENV = environment;
    cb();
  };
}

function isEnv(environment) {
  return process.env.NODE_ENV === environment;
}

function taskClean() {
  return del(['dist']);
}

function taskStatic() {
  return gulp.src(['src/static/**/*.*']).pipe(gulp.dest('dist'));
}

function taskImages() {
  return gulp
    .src(['src/assets/images/*.{gif,png,jpg,svg}'])
    .pipe(gulp.dest('dist/assets/images'));
}

function taskTemplates() {
  return gulp
    .src(['src/index.pug', 'src/pages/*.pug'], { base: 'src' })
    .pipe(
      pug({
        locals: {
          version: package.version,
          license: package.license,
        },
        pretty: isEnv('development'),
      }),
    )
    .pipe(gulp.dest('dist'));
}

function taskScripts() {
  return gulp
    .src(['src/index.js', 'src/scripts/**/*.js'])
    .pipe(
      webpack({
        output: {
          filename: '[name].min.js',
        },
        mode: process.env.NODE_ENV,
      }),
    )
    .pipe(gulp.dest('dist'));
}

function taskStyles() {
  const opt = { sourcemaps: isEnv('development') };

  return gulp
    .src(['src/index.css'], opt)
    .pipe(postcss(postcssPlugins))
    .pipe(rename({ basename: 'style', suffix: '.min' }))
    .pipe(gulp.dest('dist', opt));
}

function reload(cb) {
  server.reload();
  cb();
}

function watch(cb) {
  server.init({
    server: 'dist',
    port: 1337,
    notify: false,
    open: false,
  });

  gulp.watch(['src/static/**/*.*'], gulp.series(taskStatic, reload));

  gulp.watch(
    ['src/assets/images/*.{gif,png,jpg,svg}'],
    gulp.series(taskImages, reload),
  );

  gulp.watch(
    ['src/index.css', 'src/styles/**/*.css'],
    gulp.series(taskStyles, (cb) =>
      gulp.src('dist').pipe(server.stream()).on('end', cb),
    ),
  );

  gulp.watch(
    ['src/index.js', 'src/scripts/**/*.js'],
    gulp.series(taskScripts, reload),
  );

  gulp.watch(
    ['src/index.pug', 'src/pages/**/*.pug'],
    gulp.series(taskTemplates, reload),
  );

  gulp.watch(
    ['package.json'],
    gulp.series(taskTemplates, (cb) =>
      gulp.src('dist').pipe(server.stream()).on('end', cb),
    ),
  );

  return cb();
}

const build = gulp.series(
  taskClean,
  gulp.parallel(
    taskTemplates,
    taskStyles,
    taskScripts,
    taskImages,
    taskStatic,
  ),
);

module.exports = {
  watch: gulp.series(useEnv('development'), build, watch),
  build: gulp.series(useEnv('production'), build),
};
