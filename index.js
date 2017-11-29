const Metalsmith       = require('metalsmith');
const markdown         = require('metalsmith-markdownit');
const layouts          = require('metalsmith-layouts');
const permalinks       = require('metalsmith-permalinks');
const assets           = require('metalsmith-assets');
const browserSync      = require('metalsmith-browser-sync');
const webpack          = require('metalsmith-webpack2');
const anchor           = require('markdown-it-anchor');
const attrs            = require('markdown-it-attrs');
const extname          = require('path').extname;
const shortcodesConfig = require('./shortcodes');
const timer            = require('metalsmith-timer');
const algolia          = require('./search');
const cheerio          = require('cheerio');

//
// Environment Variables
//

const ALGOLIA_PROJECT_ID = process.env.ALGOLIA_PROJECT_ID;
const ALGOLIA_PUBLIC_KEY = process.env.ALGOLIA_PUBLIC_KEY;
const ALGOLIA_PRIVATE_KEY = process.env.ALGOLIA_PRIVATE_KEY;
const ALGOLIA_INDEX = process.env.ALGOLIA_INDEX;
const ALGOLIA_CLEAR_INDEX = process.env.ALGOLIA_CLEAR_INDEX;
const ALGOLIA_UPDATE_INDEX = (
  ALGOLIA_PROJECT_ID != undefined ||
  ALGOLIA_PUBLIC_KEY != undefined ||
  ALGOLIA_PRIVATE_KEY != undefined ||
  ALGOLIA_INDEX != undefined
);

if(process.env.NODE_ENV == "production" || ALGOLIA_UPDATE_INDEX) {
  if(process.env.NODE_ENV == "pdf") {
    throw new Error('Algolia env vars set while build env is pdf');
  }
  if(!ALGOLIA_PROJECT_ID) {
    throw new Error('Env var ALGOLIA_PROJECT_ID has not been set.');
  }
  if(!ALGOLIA_PUBLIC_KEY) {
    throw new Error('Env var ALGOLIA_PUBLIC_KEY has not been set.');
  }
  if(!ALGOLIA_PRIVATE_KEY) {
    throw new Error('Env var ALGOLIA_PRIVATE_KEY has not been set.');
  }
  if(!ALGOLIA_INDEX) {
    throw new Error('Env var ALGOLIA_INDEX has not been set.');
  }
}

//
// Metalsmith
//

let MS = Metalsmith(__dirname);

// Metadata
MS.metadata({
  url: "https://docs.mesosphere.com",
  siteTitle: "Mesosphere DC/OS",
  title: "Mesosphere DC/OS",
  description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
  copyright: "@ 2017 Mesosphere, Inc. All rights reserved.",
  env: process.env.NODE_ENV,
})

// Source
MS.source('./pages')

// Destination
MS.destination('./build')

// Clean
if(process.env.NODE_ENV == "development") {
  MS.clean(false)
}
else if(
  process.env.NODE_ENV == "production" ||
  process.env.NODE_ENV == "pdf" ||
  process.env.NODE_ENV == "pdf-development"
) {
  MS.clean(true)
}

// Start timer
MS.use(timer('init'))

// Folder Hierarchy
MS.use(hierarchyPlugin({
  files: ['.md'],
  excerpt: true
}))
MS.use(timer('Hierarchy'))

// RSS Feed
MS.use(rss({
  itemOptionsMap: {
    'title': 'title',
    'description': 'excerpt'
  }
}))
MS.use(timer('RSS'))

// Shortcodes
MS.use(shortcodes({
  files: ['.md'],
  shortcodes: shortcodesConfig
}))
MS.use(timer('Shortcodes'))

// Markdown
MS.use(markdown(
  {
    smartList: false,
    typographer: true,
    html: true,
  })
  .use(anchor, {
    permalink: true,
    renderPermalink: (slug, opts, state, idx) => {
      const linkTokens = [
        Object.assign(new state.Token('link_open', 'a', 1), {
          attrs: [
            ['class', opts.permalinkClass],
            ['href', opts.permalinkHref(slug, state)],
            ['aria-hidden', 'true']
          ]
        }),
        Object.assign(new state.Token('html_block', '', 0), { content: opts.permalinkSymbol }),
        new state.Token('link_close', 'a', -1)
      ]
      state.tokens[idx + 1].children['unshift'](...linkTokens)
    },
    permalinkClass: 'content__anchor',
    permalinkSymbol: '<i data-feather="bookmark"></i>',
    permalinkBefore: true,
  })
  .use(attrs),
)
MS.use(timer('Markdown'))

// Headings
MS.use(headings())
MS.use(timer('Headings'))

// Permalinks
MS.use(permalinks())
MS.use(timer('Permalinks'))

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

// Search Indexing
if(ALGOLIA_UPDATE_INDEX) {
  MS.use(algolia({
    projectId: ALGOLIA_PROJECT_ID,
    privateKey: ALGOLIA_PRIVATE_KEY,
    index: ALGOLIA_INDEX,
    clearIndex: (ALGOLIA_CLEAR_INDEX != undefined) ? ALGOLIA_CLEAR_INDEX : true,
  }))
  MS.use(timer('Algolia'));
}

// WkhtmltopdfLinkResolver
if(process.env.NODE_ENV == "pdf") {
  MS.use(wkhtmltopdfLinkResolver({
    prefix: '/tmp/pdf/build'
  }))
  MS.use(timer('WkhtmltopdfLinkResolver'))
}

// Webpack
MS.use(webpack('./webpack.config.js'))
MS.use(timer('Webpack'))

if(
  process.env.NODE_ENV == "development" ||
  process.env.NODE_ENV == "development-docs"
) {
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
// Hierarchy
//
//const path = require('path');
//const cheerio = require('cheerio');
const md = require('markdown-it')({
  typographer: true,
  html: true,
});
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');

// TEMP: Moving to own npm package

function walk(opts, file, files, array, children, level) {
  // Get path
  let pathParts = file.split('/');
  pathParts.pop()
  let urlPath = '/' + pathParts.join('/');
  if(!level) {
    level = 0;
  }
  if(!children) {
    children = [];
  }
  let id = array[0];
  let child = children.find((c, i) => c.id === id);
  // Only parse specified file types
  let basename = path.basename(file);
  let ext = path.extname(basename);
  let shouldParse = true;
  if(opts.files) {
    shouldParse = (opts.files.indexOf(ext) == -1) ? false : shouldParse;
  }
  // Build object
  if(!child && shouldParse) {
    let child = {
      id: id,
      path: urlPath,
      children: [],
    };
    let blacklist = [
      'stats',
      'mode',
      'contents',
    ];
    let fileObj = files[file];
    // Add front-matter
    for(let key in fileObj) {
      if(blacklist.indexOf(key) === -1) {
        child[key] = fileObj[key]
      }
    }
    // Add excerpt
    if(opts.excerpt && !child.excerpt) {
      let contents = decoder.write(fileObj.contents);
      let html = (ext == '.md') ? md.render(contents) : contents;
      let $ = cheerio.load(html);
      let elem = $('p').first();
      child.excerpt = elem.text();
    }
    children.push(child);
  }
  // Walk children
  if(array.length > 1) {
    let childChildrenArray = array.slice(1, array.length);
    let childChildren = walk(opts, file, files, childChildrenArray, child.children, level + 1);
    child.children = childChildren;
  }
  // Sort
  children.sort((a, b) => {
    return (a.menuWeight > b.menuWeight) ? 1 : (a.menuWeight < b.menuWeight) ? -1 : 0;
  });
  return children;
}

function hierarchyPlugin(opts) {
  return function(files, metalsmith, done) {
    setImmediate(done);
    var findByPath = function(path) {
      if(path[0] !== '/') {
        path = '/' + path;
      }
      var f = function(array, key, value) {
        return array.find(function(item) {
          return item[key] == value;
        });
      }
      var pathSplit = path.split('/');
      pathSplit.splice(0, 1);
      var start = f(this.children, 'id', pathSplit[0]);
      pathSplit.splice(0, 1);
      var index = 0;
      var currentPage = pathSplit.reduce(function(value, next) {
        var found = f(value.children, 'id', pathSplit[index])
        index++;
        return found;
      }, start);
      return currentPage;
    }
    var find = function(key, value) {
      let found = [];
      let w = (node) => {
        let matches = node.children.filter(function(n) {
          if(!value) {
            return n[key] != undefined;
          }
          return n[key] == value;
        });
        found = found.concat(matches);
        node.children.forEach(function(n) {
          w(n);
        });
      };
      w(this);
      return found;
    }
    var findParent = function(path, key, value) {
      if(path[0] !== '/') {
        path = '/' + path;
      }
      let pathSplit = path.split('/');
      pathSplit.splice(0, 1);
      pathSplit.reverse();
      let self = this;
      let parent;
      pathSplit.forEach(function(id) {
        let i = path.split('/').indexOf(id);
        let s = path.split('/').slice(0, i + 1).join('/');
        let page = this.findByPath(s);
        if(page && page[key] && page[key] == value) {
          parent = page;
        }
      }, this);
      return parent;

    }
    let r = {
      id: '',
      title: '',
      path: '/',
      children: [],
      findByPath: findByPath,
      findParent: findParent,
      find: find,
    };
    Object.keys(files).forEach(function(file, index) {
      var pathParts = file.split('/');
      pathParts.pop();
      let children = walk(opts, file, files, pathParts, r.children, 0);
      r.children = children;
    });
    metalsmith.metadata()['hierarchy'] = r;
  };
};

//
// Hierarchy RSS
//

const fs = require('fs');
const mkdirp = require('mkdirp');
//const path = require('path');
const RSS = require('rss');

function createFeed(opts, metalsmith, page) {

  let metadata = metalsmith.metadata();

  //
  // Feed
  //

  let feedOptions = {};

  if(page.title) {
    feedOptions.title = page.title;
  }
  if(metadata.description) {
    feedOptions.description = metadata.description;
  }
  if(metadata.url && page.path) {
    feedOptions.feed_url = path.join(metadata.url, page.path, 'rss.xml');
    feedOptions.site_url = path.join(metadata.url, page.path);
  }
  if(metadata.copyright) {
    feedOptions.copyright = metadata.copyright;
  }
  if(metadata.language) {
    feedOptions.language = metadata.language;
  }

  let feed = new RSS(feedOptions);

  //
  // Pages
  //

  let walk = (p) => {
    p.children.forEach((c) => {
      let itemOptions = {};
      for(let key in opts.itemOptionsMap) {
        let value = c[opts.itemOptionsMap[key]];
        if(value) {
          itemOptions[key] = value;
        }
      }
      if(c.path) {
        itemOptions.url = path.join(metadata.url, c.path);
      }
      feed.item(itemOptions);
      walk(c);
    });
  };
  walk(page);

  //
  // Export
  //

  let destinationFolder = path.join(metalsmith.destination(), page.path);
  let destination = path.join(destinationFolder, '/rss.xml');
  if (!fs.existsSync(destinationFolder)){
    mkdirp.sync(destinationFolder);
  }
  fs.writeFileSync(destination, feed.xml());

}

function rss(opts) {
  return function(files, metalsmith, done) {
    setImmediate(done);

    let metadata = metalsmith.metadata();
    if(!metadata) {
      done(new Error('metadata must be configured'));
    }

    let hierarchy = metadata.hierarchy;
    if(!hierarchy) {
      done(new Error('hierarchy must be configured'));
    }

    let pages = hierarchy.find('rss', true);
    pages.forEach((page) => createFeed(opts, metalsmith, page));

  }
}

//
// Headings
//

//const cheerio = require('cheerio');

function headings() {
  const selectors = ['h1', 'h2'];
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
        try {
          const out = parser.parse(files[file].contents.toString('utf8'));
          files[file].contents = Buffer.from(out, 'utf8');
        }
        catch(err) {
          throw err + ` File: ${file}`;
        }
      }
    });
  };
  return wrapper(opts);
}

//
// Wkhtmltopdf Link Resolver
//

//const cheerio = require('cheerio');

function wkhtmltopdfLinkResolver(opts) {
  return function(files, metalsmith, done) {
    setImmediate(done);
    Object.keys(files).forEach(function(file) {
      if ('.html' != extname(file)) return;
      let data = files[file];
      let contents = data.contents.toString();
      let $ = cheerio.load(contents);
      let buildPath = opts.prefix;
      $('*').each(function(){
        let href = $(this).attr('href');
        let src = $(this).attr('src');
        // Remove links
        if($(this).is('a')) {
          $(this).removeAttr('href');
        }
        // Set system file links
        else if(href && href[0] === '/') {
          $(this).attr('href', buildPath + href)
        }
        // Set system file path
        else if(src && src[0] === '/') {
          $(this).attr('src', buildPath + src)
        }
      });
      files[file].contents = Buffer.from($.html(), 'utf8');
    });
    return files;
  };
}
