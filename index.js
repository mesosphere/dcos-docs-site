// Packages
const fs = require("fs");
const minimatch = require("minimatch");
const Metalsmith = require("metalsmith");
const markdown = require("metalsmith-markdownit");
const layouts = require("metalsmith-layouts");
const assets = require("metalsmith-assets");
const dataLoader = require("metalsmith-data-loader");
const watch = require("metalsmith-watch");
const serve = require("metalsmith-serve");
const anchor = require("markdown-it-anchor");
const attrs = require("markdown-it-attrs");
const timer = require("metalsmith-timer");
const ignore = require("metalsmith-ignore");
const consolidate = require("consolidate");
const pug = require("pug");

// Local Plugins
const hierarchy = require("./plugins/metalsmith-hierarchy");
const headings = require("./plugins/metalsmith-headings");
const algolia = require("./plugins/metalsmith-algolia");
const inPlace = require("./plugins/metalsmith-in-place-dcos");
const includeContent = require("./plugins/metalsmith-include-content-dcos");
const revision = require("./plugins/metalsmith-revision");
const shortcodes = require("./plugins/metalsmith-shortcodes");
const webpack = require("./plugins/metalsmith-webpack");
const Utils = require("./core/utils");

// Configs
const configData = fs.readFileSync("config.json");
const config = JSON.parse(configData);
const shortcodesConfig = require("./shortcodes");

// Environment Variables
const GIT_BRANCH = process.env.GIT_BRANCH;
const METALSMITH_SKIP_SECTIONS = (config[GIT_BRANCH] || {}).DO_NOT_BUILD || [];

//
// Metalsmith
//

const MS = Metalsmith(__dirname);

const currentYear = new Date().getFullYear();

// Metadata
// These are available in the layouts as js variables
MS.metadata({
  url: "https://docs.d2iq.com",
  siteTitle: "D2iQ Docs",
  siteDescription:
    "Welcome to the documentation pages for D2iQ. Visit one of the product " +
    "pages to get started.",
  copyright: `&copy; ${currentYear} D2iQ, Inc. All rights reserved.`,
  env: process.env.NODE_ENV,
  gitBranch: GIT_BRANCH,
  conductorDocsLatest: "1.1",
  dcosCNDocsLatest: "2.1",
  dcosDocsLatest: "2.2",
  dispatchDocsLatest: "1.4",
  kommanderDocsLatest: "1.3",
  konvoyDocsLatest: "1.7",
  kaptainDocsLatest: "1.2.0-1.0.0",
  Utils,
});
MS.use(timer("Init"));

// Source
// Where metalsmith looks for all files
MS.source("./pages");

// Destination
// Where metalsmith will put the output code
MS.destination("./build");

// Don't Clean
// Cleaning removes the destination directory before writing to it
// I imagine cleaning makes watching take a long time, but untested for now
MS.clean(false);

if (process.env.NODE_ENV === "development") {
  // remove all most mesosphere-files to speed up the dev end
  MS.use((files, _, done) => {
    Object.keys(files).forEach((file) => {
      if (
        minimatch(file, "mesosphere/dcos/**/*.md") &&
        // we need these to build the landingpage
        file != "mesosphere/dcos/index.md" &&
        file != `mesosphere/dcos/${MS._metadata.dcosDocsLatest}/index.md`
      ) {
        delete files[file];
      }
    });
    done();
  });
}

MS.use(ignore(METALSMITH_SKIP_SECTIONS));
MS.use(timer("Ignore"));

MS.use(assets({ source: "assets", destination: "assets" }));
MS.use(timer("Assets"));

// Load model data from external .json/.yaml files
// For example (in your Front Matter):
//   model: path/to/my.yml (access content in my.yml as model.foo.bar)
// Can also specify multiple named models:
//   model:
//   data1: path/to/my.json (access content in my.json as model.data1.foo.bar)
//   data2: path/to/my.yml (access content in my.yml as model.data2.foo.bar)
MS.use(dataLoader({ dataProperty: "model", match: "**/*.md" }));
MS.use(timer("Dataloader"));

// Load raw content via '#include' directives before rendering any mustache or markdown.
// For example (in your content):
//   #include path/to/file.tmpl
// Style as a C-like include statement. Must be on its own line.
MS.use(includeContent({ pattern: "^#include ([^ \n]+)$", match: "**/*.md*" }));
MS.use(timer("IncludeContent"));

// Process any mustache templating in files.
// For example (in your Front Matter):
//   render: mustache
MS.use(inPlace({ renderProperty: "render", match: "**/*.md" }));
MS.use(timer("Mustache"));

// Folder Hierarchy
MS.use(hierarchy);
MS.use(timer("Hierarchy"));

//
// Slow Plugins
//

// Shortcodes
MS.use(shortcodes({ files: [".md"], shortcodes: shortcodesConfig }));
MS.use(timer("Shortcodes"));

// Don't rebuild files that have not been touched
if (process.env.NODE_ENV === "development") {
  MS.use(revision);
  MS.use(timer("Revision"));
}

// Markdown
MS.use(
  markdown({ smartList: false, typographer: true, html: true })
    .use(anchor, {
      permalink: true,
      renderPermalink: (slug, opts, state, idx) => {
        const linkTokens = [
          Object.assign(new state.Token("link_open", "a", 1), {
            attrs: [
              ["class", opts.permalinkClass],
              ["href", opts.permalinkHref(slug, state)],
              ["aria-hidden", "true"],
            ],
          }),
          Object.assign(new state.Token("html_block", "", 0), {
            content: opts.permalinkSymbol,
          }),
          new state.Token("link_close", "a", -1),
        ];
        state.tokens[idx + 1].children.unshift(...linkTokens);
      },
      permalinkClass: "content__anchor",
      permalinkSymbol: '<i data-feather="bookmark"></i>',
      permalinkBefore: true,
    })
    .use(attrs)
);
MS.use(timer("Markdown"));

// Headings
MS.use(headings());
MS.use(timer("Headings"));

// Layouts
MS.use((files, ms, done) => {
  // we want to use pugs cache for the duration of one (re-)build. we need to clear it inbetween to
  // have changes to layouts propagate directly. unfortunately there's no convenience for that and we
  // have to reach into pug and consolidate directly for now.
  consolidate.clearCache();
  pug.cache = {};
  return layouts({ engine: "pug", cache: true })(files, ms, done);
});
MS.use(timer("Layouts"));

// Search Indexing
if (process.env.ALGOLIA_UPDATE === "true") {
  MS.use(algolia);
  MS.use(timer("Algolia"));
}

// Enable watching
// The keys represent the files to watch, the values are the files that will
// be updated. ONLY the files that are being updated will be accessible to
// during the rebuild. We must include the layouts when rerendering a page thus.
if (process.env.NODE_ENV === "development") {
  MS.use(
    watch({
      paths: {
        "layouts/**/*": "**/*",
        "pages/404/index.md": true,
        [`pages/dkp/**/*.md`]: true,
      },
      livereload: true,
    })
  );
  MS.use(timer("Watch"));
}

// Serve
if (process.env.NODE_ENV === "development") {
  MS.use(serve({ host: "0.0.0.0", port: 3000 }));
  MS.use(timer("Webserver"));
}

MS.use(webpack);
MS.use(timer("Webpack"));

// Build
MS.build((err, files) => {
  if (err) throw err;
});
