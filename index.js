// Packages
const Metalsmith       = require('metalsmith');
const markdown         = require('metalsmith-markdownit');
const layouts          = require('metalsmith-layouts');
const permalinks       = require('metalsmith-permalinks');
const assets           = require('metalsmith-assets');
const dataLoader       = require('metalsmith-data-loader');
const watch            = require('metalsmith-watch');
const branch           = require('metalsmith-branch')
const serve            = require('metalsmith-serve');
const redirect         = require('metalsmith-redirect');
const webpack          = require('metalsmith-webpack2');
const anchor           = require('markdown-it-anchor');
const attrs            = require('markdown-it-attrs');
const timer            = require('metalsmith-timer');
const copy             = require('metalsmith-copy');

// Local Plugins
const reduce                  = require('./plugins/metalsmith-revision').reduce;
const restore                 = require('./plugins/metalsmith-revision').restore;
const hierarchy               = require('./plugins/metalsmith-hierarchy');
const hierarchyRss            = require('./plugins/metalsmith-hierarchy-rss');
const headings                = require('./plugins/metalsmith-headings');
const algolia                 = require('./plugins/metalsmith-algolia');
const inPlace                 = require('./plugins/metalsmith-in-place-dcos');
const includeContent          = require('./plugins/metalsmith-include-content-dcos');
const shortcodes              = require('./plugins/metalsmith-shortcodes');
const wkhtmltopdfLinkResolver = require('./plugins/metalsmith-wkhtmltopdf-link-resolver');

// Configs
const shortcodesConfig = require('./shortcodes');

// Environment Variables
const GIT_BRANCH = process.env.GIT_BRANCH;
const ALGOLIA_UPDATE = process.env.ALGOLIA_UPDATE;
const ALGOLIA_PROJECT_ID = process.env.ALGOLIA_PROJECT_ID;
const ALGOLIA_PUBLIC_KEY = process.env.ALGOLIA_PUBLIC_KEY;
const ALGOLIA_PRIVATE_KEY = process.env.ALGOLIA_PRIVATE_KEY;
const ALGOLIA_INDEX = process.env.ALGOLIA_INDEX;
const ALGOLIA_CLEAR_INDEX = process.env.ALGOLIA_CLEAR_INDEX;

//
// Errors
//

if(!process.env.GIT_BRANCH && process.env.NODE_ENV != "development") {
  throw new Error('Env var GIT_BRANCH has not been set.');
}

if(ALGOLIA_UPDATE == "true") {
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

let currentYear = (new Date()).getFullYear();

// Metadata
MS.metadata({
  url: "https://docs.mesosphere.com",
  siteTitle: "Mesosphere DC/OS Documentation",
  siteDescription: "Welcome to the DC/OS documentation. The DC/OS documentation " +
  "can help you set up, learn about the system, and get your applications and" +
  " workloads running on DC/OS.",
  copyright: `&copy; ${currentYear} Mesosphere, Inc. All rights reserved.`,
  env: process.env.NODE_ENV,
  gitBranch: process.env.GIT_BRANCH,
  dcosDocsLatest: '1.11'
})

// Source
MS.source('./pages')

// Destination
MS.destination('./build')

// Clean
MS.clean(false)

//
// Content Branch
//

let CB = branch()

// Start timer
CB.use(timer('CB: Init'))

// Remove the ordr prefix from structured files. Constrained to the services directory
// @bwood is responsible for this abomination.
CB.use(copy({
  pattern: 'services/**',
  transform: function(file) {
    return file.replace(/ordr_[0-9]+-/, "")
  },
  move: true
}))
CB.use(timer('CB: Copy'))

// Load model data from external .json/.yaml files
// For example (in your Front Matter):
//   model: path/to/my.yml (access content in my.yml as model.foo.bar)
// Can also specify multiple named models:
//   model:
//     data1: path/to/my.json (access content in my.json as model.data1.foo.bar)
//     data2: path/to/my.yml (access content in my.yml as model.data2.foo.bar)
CB.use(dataLoader({
  dataProperty: 'model',
  // Only enable in service pages for now.
  match: 'services/**/*.md',
}))
CB.use(timer('CB: Dataloader'))

// Load raw content via '#include' directives before rendering any mustache or markdown.
// For example (in your content):
//   #include path/to/file.tmpl
CB.use(includeContent({
  // Style as a C-like include statement. Must be on its own line.
  pattern: '^#include ([^ \n]+)$',
  // Only enable in service pages for now.
  match: 'services/**/*.md*',
}))
CB.use(timer('CB: IncludeContent'))

// Process any mustache templating in files.
// For example (in your Front Matter):
//   render: mustache
CB.use(inPlace({
  renderProperty: 'render',
  // Only enable in service pages for now.
  match: 'services/**/*.md',
}))
CB.use(timer('CB: Mustache'))

// Folder Hierarchy
CB.use(hierarchy({
  files: ['.md'],
  excerpt: true
}))
CB.use(timer('CB: Hierarchy'))

// RSS Feed
CB.use(hierarchyRss({
  itemOptionsMap: {
    'title': 'title',
    'description': 'excerpt'
  }
}))
CB.use(timer('CB: Hierarchy RSS'))

// Filter unmodified files
if(process.env.NODE_ENV === 'development') {
  CB.use(reduce())
  CB.use(timer('CB: Reduce'))
}

//
// Slow Plugins
//

// Shortcodes
CB.use(shortcodes({
  files: ['.md'],
  shortcodes: shortcodesConfig
}))
CB.use(timer('CB: Shortcodes'))

// Markdown
CB.use(markdown(
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
CB.use(timer('CB: Markdown'))

// Headings
CB.use(headings())
CB.use(timer('CB: Headings'))

CB.use(redirect({
  '/support': 'https://support.mesosphere.com'
}))
CB.use(timer('CB: Redirects'))

// Permalinks
CB.use(permalinks())
CB.use(timer('CB: Permalinks'))

// Layouts
if(!process.env.RENDER_PATH_PATTERN) {
  // Default: Render all pages.
  CB.use(layouts({
    engine: 'pug',
    cache: true,
  }))
} else {
  // Dev optimization: Only render within a specific path (much faster turnaround)
  // For example, "services/beta-cassandra/latest/**"
  CB.use(layouts({
    engine: 'pug',
    pattern: process.env.RENDER_PATH_PATTERN,
    cache: true,
  }))
}
CB.use(timer('CB: Layouts'))

//
// Slow Plugins End
//

// Restore unmodified files
if(process.env.NODE_ENV === 'development') {
  CB.use(restore())
  CB.use(timer('CB: Reduce'))
}

// Search Indexing
if(ALGOLIA_UPDATE == "true") {
  CB.use(algolia({
    projectId: ALGOLIA_PROJECT_ID,
    privateKey: ALGOLIA_PRIVATE_KEY,
    index: ALGOLIA_INDEX,
    clearIndex: (ALGOLIA_CLEAR_INDEX != undefined) ? (ALGOLIA_CLEAR_INDEX == "true") : true,
  }))
  CB.use(timer('CB: Algolia'));
}

// Enable watching
if(process.env.NODE_ENV === 'development') {
  CB.use(
    watch({
      paths: {
        'pages/**/*': '**/*.md',
        'layouts/**/*': '**/*.pug',
      },
    })
  )
  CB.use(timer('CB: Watch'));
}

// WkhtmltopdfLinkResolver
if(process.env.NODE_ENV == "pdf") {
  CB.use(wkhtmltopdfLinkResolver({
    prefix: '/tmp/pdf/build'
  }))
  CB.use(timer('CB: WkhtmltopdfLinkResolver'))
}

// Serve
if(process.env.NODE_ENV == "development") {
  CB.use(serve({
    port: 3000
  }))
  CB.use(timer('CB: Webserver'))
}

//
// Assets Branch
//

let AB = branch()

// Start timer
AB.use(timer('AB: Init'))

// Watch
if(process.env.NODE_ENV === 'development') {
  AB.use(
    watch({
      paths: {
        'js/**/*': '**/*.js',
        'scss/**/*': '**/*.scss',
      },
    })
  )
  AB.use(timer('AB: Watch'))
}

// Assets
AB.use(assets({
  source: 'assets',
  destination: 'assets',
}))
AB.use(timer('AB: Assets'))

// Webpack
AB.use(webpack('./webpack.config.js'))
AB.use(timer('AB: Webpack'))

//
// Metalsmith
//

MS.use(CB)
MS.use(AB)

// Build
MS.build(function(err, files) {
  if (err) { throw err; }
});
