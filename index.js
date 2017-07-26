const Metalsmith    = require('metalsmith');
const markdown      = require('metalsmith-markdown');
const layouts       = require('metalsmith-layouts');
const collections   = require('metalsmith-collections');
const permalinks    = require('metalsmith-permalinks');
const headings      = require('metalsmith-headings');
const assets        = require('metalsmith-assets');
const browserSync   = require('metalsmith-browser-sync');
const webpack       = require('metalsmith-webpack2');

Metalsmith(__dirname)

  // Metadata
  .metadata({
    title: "Mesosphere",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
    generator: "Metalsmith",
    url: "http://www.metalsmith.io/"
  })

  // Source
  .source('./pages')

  // Destination
  .destination('./build')

  // Clean
  .clean(false)

  // Collections
  .use(collections({
    Versions: {
      pattern: 'docs/1.8/**/*.md'
    }
  }))

  // Markdown
  .use(markdown({
    smartypants: true,
    smartLists: true,
    gfm: true,
    tables: true,
  }))

  // Headings
  .use(headings('h2'))

  // Permalinks
  .use(permalinks())

  // Assets
  .use(assets({
    source: 'assets',
    destination: 'assets',
  }))

  // Layouts
  .use(layouts({
    engine: 'pug',
  }))

  // Webpack
  .use(webpack('./webpack.config.js'))

  // BrowserSync
  .use(browserSync({
    server : 'build',
    files  : [
      'pages/**/*.md',
      'layouts/**/*.pug',
      'scss/**/*.scss',
      'js/**/*.js',
    ]
  }))

  // Build
  .build(function(err, files) {
    if (err) { throw err; }
  });