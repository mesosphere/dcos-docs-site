const Metalsmith    = require('metalsmith');
const markdown      = require('metalsmith-markdown');
const layouts       = require('metalsmith-layouts');
const permalinks    = require('metalsmith-permalinks');
const assets        = require('metalsmith-assets');
const browserSync   = require('metalsmith-browser-sync');
const webpack       = require('metalsmith-webpack2');

Metalsmith(__dirname)
  .metadata({
    title: "Mesosphere",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
    generator: "Metalsmith",
    url: "http://www.metalsmith.io/"
  })
  .source('./pages')
  .destination('./build')
  .clean(false)
  .use(markdown())
  .use(permalinks())
  .use(assets({
    source: 'assets',
    destination: 'assets',
  }))
  .use(layouts({
    engine: 'pug',
  }))
  .use(webpack('./webpack.config.js'))
  .use(browserSync({
    server : 'build',
    files  : [
      'pages/**/*.md',
      'layouts/**/*.pug',
      'scss/**/*.scss',
      'js/**/*.js',
    ]
  }))
  .build(function(err, files) {
    if (err) { throw err; }
  });