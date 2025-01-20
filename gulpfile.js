import gulp from 'gulp';
import pug from 'gulp-pug';
import postcss from 'gulp-postcss';
import postcssPluginImport from 'postcss-import';
import postcssPlginCsso from 'postcss-csso';
import rename from 'gulp-rename';
import { deleteAsync } from 'del';
import browsersync from 'browser-sync';
import webpack from 'webpack-stream';

const server = browsersync.create();

function useEnv(environment) {
  return (cb) => {
    process.env.NODE_ENV = environment;
    cb();
  };
}

function isEnv(environment) {
  return process.env.NODE_ENV === environment;
}

async function taskClean() {
  return deleteAsync(['dist']);
}

async function taskStatic() {
  return gulp
    .src(['src/static/**/*.*'], { encoding: false })
    .pipe(gulp.dest('dist'));
}

async function taskImages() {
  return gulp
    .src(['src/assets/images/*.{gif,png,jpg,svg}'], { encoding: false })
    .pipe(gulp.dest('dist/assets/images'));
}

async function taskTemplates() {
  return gulp
    .src(['src/index.pug', 'src/pages/*.pug'], { base: 'src' })
    .pipe(
      pug({
        pretty: isEnv('development'),
      })
    )
    .pipe(gulp.dest('dist'));
}

async function taskScripts() {
  return gulp
    .src(['src/index.js', 'src/scripts/**/*.js'])
    .pipe(
      webpack({
        output: {
          filename: '[name].min.js',
        },
        mode: process.env.NODE_ENV,
      })
    )
    .pipe(gulp.dest('dist'));
}

async function taskStyles() {
  const opt = { sourcemaps: isEnv('development') };

  return gulp
    .src(['src/index.css'], opt)
    .pipe(postcss([postcssPluginImport, postcssPlginCsso]))
    .pipe(rename({ basename: 'style', suffix: '.min' }))
    .pipe(gulp.dest('dist', opt));
}

function reload(cb) {
  server.reload();
  cb();
}

function taskWatch(cb) {
  server.init({
    server: 'dist',
    port: 1337,
    notify: false,
    open: false,
  });

  gulp.watch(['src/static/**/*.*'], gulp.series(taskStatic, reload));

  gulp.watch(
    ['src/assets/images/*.{gif,png,jpg,svg}'],
    gulp.series(taskImages, reload)
  );

  gulp.watch(
    ['src/index.css', 'src/styles/**/*.css'],
    gulp.series(taskStyles, (cb) =>
      gulp.src('dist').pipe(server.stream()).on('end', cb)
    )
  );

  gulp.watch(
    ['src/index.js', 'src/scripts/**/*.js'],
    gulp.series(taskScripts, reload)
  );

  gulp.watch(
    ['src/index.pug', 'src/pages/**/*.pug'],
    gulp.series(taskTemplates, reload)
  );

  gulp.watch(
    ['package.json'],
    gulp.series(taskTemplates, (cb) =>
      gulp.src('dist').pipe(server.stream()).on('end', cb)
    )
  );

  return cb();
}

const taskBuild = gulp.series(
  taskClean,
  gulp.parallel(
    taskTemplates,
    taskStyles,
    taskScripts,
    taskImages,
    taskStatic
  )
);

export const watch = gulp.series(
  useEnv('development'),
  taskBuild,
  taskWatch
);
export const build = gulp.series(useEnv('production'), taskBuild);
