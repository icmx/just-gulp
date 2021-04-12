# Just Gulp

Bare minimum boilerplate featuring Gulp, multipage Pug templating and PostCSS styling, all live-reloadable.

## Features

  - gulp as a builder
  - Pug templates
  - PostCSS with cssnano minification and "include" import enabled
  - Browsersync live-reloading preview
  - Prettier project-specific editor settings

## Usage

```sh
# clone repository
git clone https://github.com/icmx/just-gulp

# go to local copy
cd just-gulp

# install dependencies
npm install

# launch it on localhost:1337 -- happy coding!
npm run serve

# build it
npm run build
```

## Structure

All sources are in `src` directory, but any path can be easily changed in [gulpfile.js](gulpfile.js).

  - `assets` — *almost-compiled* binary files like images, icon sets, fonts etc. By default it contains only `images` subdirectory which have its own gulp task. If you want to use other asssets, you have to create a new directory and write another task by yourself.
  - `static` — ready and compiled files, like favicons, robots.txt etc.
  - `pages` — additional pages, layouts and other Pug files
  - `scripts` — additional scripts and other JS files
  - `styles` — additional styles and other CSS files
  - `index.pug` — pages index file
  - `index.js` — scripts index file
  - `index.css` — styles index file

By default, gulp will watch for `index.*` files and its corresponding directories, e.g. for `index.js` and `scripts/**/*.js` files. All files will be bundled into single HTML, CSS and JS bundles, while assets and static files will be just copied:

| Sources (`src`)                  | Output (`dist`)  |
| -------------------------------- | ---------------- |
| `assets/*`                       | `/assets/*`      |
| `static/*`                       | `/*`             |
| `pages`, `index.pug`             | `/index.html`    |
| `scripts` (optional), `index.js` | `/main.min.js`   |
| `styles` (optional), `index.css` | `/style.min.css` |

## Motivation

There are lots of similar boilerplates already indeed. However, most of them are incredibly bloated by endless dependencies, which may be deprecated, outdated and even not used at all, thus I suppose there should be some really lightweight and easy to use alternative.

Please note that packages choice for Just Gulp not only *bare*, but also *sane*. Modern and feature-rich `browser-sync` instead of outdated `gulp-livereload` for instance, same for `webpack-stream` and so on.

## See also

  - [Just Webpack](https://github.com/icmx/just-webpack) — same project, but Webpack-based.
