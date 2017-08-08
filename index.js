const Metalsmith    = require('metalsmith');
const markdown      = require('metalsmith-markdown');
const layouts       = require('metalsmith-layouts');
const collections   = require('metalsmith-collections');
const permalinks    = require('metalsmith-permalinks');
const headings      = require('metalsmith-headings');
const assets        = require('metalsmith-assets');
const browserSync   = require('metalsmith-browser-sync');
const webpack       = require('metalsmith-webpack2');

//
// Metalsmith
//

Metalsmith(__dirname)

  // Metadata
  .metadata({
    siteTitle: "Mesosphere DC/OS",
    title: "Mesosphere DC/OS",
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

  .use(plugin())

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
