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

function walk(file, files, array, children, level) {
  let pathParts = file.split('/');
  pathParts.pop()
  let path = '/' + pathParts.join('/');
  if(!level) {
    level = 0;
  }
  if(!children) {
    children = [];
  }
  let id = array[0];
  let child = children.find((c, i) => c.id === id);
  if(!child) {
    let child = Object.assign({
      id: id,
      menuWeight: 0,
      path: path,
      children: [],
    }, files[file]);
    // Remove large data
    delete child.layout;
    delete child.stats;
    delete child.mode;
    delete child.contents;
    children.push(child);
  }
  if(array.length > 1) {
    let childChildrenArray = array.slice(1, array.length);
    let childChildren = walk(file, files, childChildrenArray, child.children, level + 1);
    child.children = childChildren;
  }
  children.sort((a, b) => a.menuWeight - b.menuWeight);
  return children;
}

function plugin() {
  return function(files, metalsmith, done){
    setImmediate(done);
    let r = {
      id: '',
      title: '',
      path: '/',
      children: []
    };
    Object.keys(files).forEach(function(file, index) {
      var pathParts = file.split('/');
      pathParts.pop();
      let children = walk(file, files, pathParts, r.children, 0);
      r.children = children;
    });
    metalsmith.metadata()['hierarchy'] = r;
  };
}