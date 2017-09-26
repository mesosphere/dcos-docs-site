const Metalsmith       = require('metalsmith');
const markdown         = require('metalsmith-markdownit');
const layouts          = require('metalsmith-layouts');
const collections      = require('metalsmith-collections');
const permalinks       = require('metalsmith-permalinks');
const assets           = require('metalsmith-assets');
const browserSync      = require('metalsmith-browser-sync');
const webpack          = require('metalsmith-webpack2');
// TEMP: See below
//const shortcodes       = require('metalsmith-shortcode-parser');
const anchor           = require('markdown-it-anchor');
const attrs            = require('markdown-it-attrs');
const cheerio          = require('cheerio');
const extname          = require('path').extname;
const shortcodesConfig = require('./shortcodes');
const timer            = require('metalsmith-timer');
const algolia          = require('./algolia');

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

// Start timer
MS.use(timer('init'))

// Folder Hierarchy
MS.use(hierarchyPlugin())
MS.use(timer('Hierarchy'))

// Shortcodes
MS.use(shortcodes({
  files: ['.md'],
  shortcodes: shortcodesConfig
}))
MS.use(timer('Shortcodes'))

// Markdown
MS.use(markdown(
  {
    typographer: true,
    html: true,
  })
  .use(anchor)
  .use(attrs),
)
MS.use(timer('Markdown'))

// Headings
MS.use(headings())
MS.use(timer('Headings'))

// Permalinks
MS.use(permalinks())
MS.use(timer('Permalinks'))

// Search Indexing
// MS.use(algolia({
//   projectId: 'O1RKPTZXK1',
//   privateKey: '00ad2d0be3e5a7155820357a73730e84',
//   index: 'dev_MESOSPHERE',
//   clearIndex: true
// }))
// MS.use(timer('Algolia'))

// Assets
MS.use(assets({
  source: 'assets',
  destination: 'assets',
}))
MS.use(timer('Assets'))

// Layouts
MS.use(layouts({
  engine: 'pug'
}))
MS.use(timer('Layouts'))

// WkhtmltopdfLinkResolver
if(process.env.NODE_ENV == "pdf") {
  MS.use(wkhtmltopdfLinkResolver())
  MS.use(timer('WkhtmltopdfLinkResolver'))
}

// Webpack
MS.use(webpack('./webpack.config.js'))
MS.use(timer('Webpack'))

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
    let child = {
      id: id,
      path: path,
      children: [],
    };
    let blacklist = [
      'layout',
      'stats',
      'mode',
      'contents',
    ];
    let fileObj = files[file];
    for(let key in fileObj) {
      if(blacklist.indexOf(key) === -1) {
        child[key] = fileObj[key]
      }
    }
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

function hierarchyPlugin() {
  return function(files, metalsmith, done){
    setImmediate(done);
    var find = function(hierarchy, path) {
      if(path[0] !== '/') {
        path = '/' + path;
      }
      var pathSplit = path.split('/');
      pathSplit.splice(0, 1);
      var findById = function(array, id) {
        return array.find(function(item) {
          return item.id === id;
        });
      }
      var start = findById(hierarchy.children, pathSplit[0]);
      pathSplit.splice(0, 1);
      var index = 0;
      var currentPage = pathSplit.reduce(function(value, next) {
        var found = findById(value.children, pathSplit[index])
        index++;
        return found;
      }, start);
      return currentPage;
    }
    let r = {
      id: '',
      title: '',
      path: '/',
      children: [],
      find: find,
    };
    Object.keys(files).forEach(function(file, index) {
      var pathParts = file.split('/');
      pathParts.pop();
      let children = walk(file, files, pathParts, r.children, 0);
      r.children = children;
    });
    metalsmith.metadata()['hierarchy'] = r;
  };
};

//
// Headings
//

function headings() {
  const selectors = ['h2', 'h3'];
  return function(files, metalsmith, done) {
    setImmediate(done);
    Object.keys(files).forEach(function(file) {
      if ('.html' != extname(file)) return;
      var data = files[file];
      var contents = data.contents.toString();
      var $ = cheerio.load(contents);
      data.headings = [];
      $(selectors.join(',')).each(function(){
        if ($(this).data('hide') != true) {
          data.headings.push({
            id: $(this).attr('id'),
            tag: $(this)[0].name,
            text: $(this).text()
          });
        }
      });
    });
  };
}

//
// Shortcode Parser
//
// TEMP: Awaiting pull request for bug fix Blake submitted. Original plugin was
// corrupting all images.
//
// Will be using npm package once PR is merged.
// https://github.com/csmets/metalsmith-shortcode-parser
//

const parser = require('shortcode-parser');
const path = require('path');
function shortcodes(opts) {
  const wrapper= opts => (files, metalsmith, done) => {
    setImmediate(done);
    const shortcodeOpts = opts || {};
    if (shortcodeOpts.shortcodes !== undefined) {
      Object.keys(shortcodeOpts.shortcodes).forEach((shortcode) => {
        parser.add(shortcode, shortcodeOpts.shortcodes[shortcode]);
      });
    } else {
      console.log('No Shortcodes given');
    }
    Object.keys(files).forEach((file) => {
      let ext = path.extname(file);
      if(!shortcodeOpts.files || (shortcodeOpts.files && shortcodeOpts.files.indexOf(ext) != -1)) {
        const out = parser.parse(files[file].contents.toString('utf8'));
        files[file].contents = Buffer.from(out, 'utf8');
      }
    });
  };
  return wrapper(opts);
}

//
// Wkhtmltopdf Link Resolver
//

function wkhtmltopdfLinkResolver() {
  return function(files, metalsmith, done) {
    setImmediate(done);
    Object.keys(files).forEach(function(file) {
      if ('.html' != extname(file)) return;
      let data = files[file];
      let contents = data.contents.toString();
      let $ = cheerio.load(contents);
      let buildPath = '/tmp/pdf/build';
      $('*').each(function(){
        let href = $(this).attr('href');
        if(href && href[0] === '/') {
          $(this).attr('href', buildPath + href)
        }
        let src = $(this).attr('src');
        if(src && src[0] === '/') {
          $(this).attr('src', buildPath + src)
        }
      });
      files[file].contents = $.html();
    });
    return files;
  };
}
