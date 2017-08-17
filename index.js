const Metalsmith       = require('metalsmith');
const markdown         = require('metalsmith-markdownit');
const layouts          = require('metalsmith-layouts');
const collections      = require('metalsmith-collections');
const permalinks       = require('metalsmith-permalinks');
const headings         = require('metalsmith-headings');
const assets           = require('metalsmith-assets');
const browserSync      = require('metalsmith-browser-sync');
const webpack          = require('metalsmith-webpack2');
const shortcodes       = require('metalsmith-shortcode-parser');
const shortcodesConfig = require('./shortcodes');
const anchor           = require('markdown-it-anchor');
const attrs            = require('markdown-it-attrs');

//
// Metalsmith
//

let MS = Metalsmith(__dirname);

// Metadata
MS.metadata({
  siteTitle: "Mesosphere DC/OS",
  title: "Mesosphere DC/OS",
  description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
  copyright: "@ 2017 Mesosphere, Inc. All rights reserved.",
  env: process.env.NODE_ENV
})

// Source
MS.source('./pages')

// Destination
MS.destination('./build')

if(process.env.NODE_ENV == "development") {
  // Clean
  MS.clean(false)
}
else if(
  process.env.NODE_ENV == "production" ||
  process.env.NODE_ENV == "pdf"
) {
  // Clean
  MS.clean(true)
}

// Folder Hierarchy
MS.use(plugin())

// Shortcodes
MS.use(shortcodes({
  shortcodes: shortcodesConfig
}))

// Markdown
MS.use(markdown(
  {
    typographer: true,
    html: true,
  })
  .use(anchor)
  .use(attrs),
)

// Headings
MS.use(headings({
  selectors: ['h2', 'h3'],
}))

// Permalinks
MS.use(permalinks())

// Assets
MS.use(assets({
  source: 'assets',
  destination: 'assets',
}))

// Layouts
MS.use(layouts({
  engine: 'pug',
}))

// Webpack
MS.use(webpack('./webpack.config.js'))

if(process.env.NODE_ENV == "development") {
  // BrowserSync
  MS.use(browserSync({
    server : 'build',
    files  : [
      'pages/**/*.md',
      'layouts/**/*.pug',
      'scss/**/*.scss',
      'js/**/*.js',
    ]
  }))
}

// Build
MS.build(function(err, files) {
  if (err) { throw err; }
});

//
// Build Folder Hierarchy
//

// TEMP: Moving to own npm package

function walk(file, files, array, newObject, level) {
  let pathParts = file.split('/');
  pathParts.pop()
  let path = '/' + pathParts.join('/');
  if(!level) {
    level = 0;
  }
  if(!newObject) {
    newObject = {};
  }
  if(!newObject[array[0]]) {
    newObject[array[0]] = {
      title: files[file].navigationTitle,
      path: path,
      children: {}
    };
  }
  if(array.length > 1) {
    let childrenArray = array.slice(1, array.length);
    let children = walk(file, files, childrenArray, newObject[array[0]].children, level + 1);
    newObject[array[0]].children = Object.assign(newObject[array[0]].children, children);
  }
  return newObject;
}

function plugin() {
  return function(files, metalsmith, done){
    setImmediate(done);
    let r = {
      title: '',
      path: '/',
      children: {}
    };
    Object.keys(files).forEach(function(file, index) {
      var pathParts = file.split('/');
      pathParts.pop();
      let b = walk(file, files, pathParts, r.children, 0);
      r.children = Object.assign(r.children, b);
    });
    metalsmith.metadata()['hierarchy'] = r;
  };
}
