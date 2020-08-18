// Packages
const fs = require("fs");
const minimatch = require("minimatch");
const Metalsmith = require("metalsmith");
const markdown = require("metalsmith-markdownit");
const layouts = require("metalsmith-layouts");
const permalinks = require("metalsmith-permalinks");
const assets = require("metalsmith-assets");
const dataLoader = require("metalsmith-data-loader");
const watch = require("metalsmith-watch");
const serve = require("metalsmith-serve");
const redirect = require("metalsmith-redirect");
const webpack = require("metalsmith-webpack2");
const anchor = require("markdown-it-anchor");
const attrs = require("markdown-it-attrs");
const timer = require("metalsmith-timer");
const ignore = require("metalsmith-ignore");
const copy = require("metalsmith-copy");
const consolidate = require("consolidate");
const pug = require("pug");

// Local Plugins
const hierarchy = require("./plugins/metalsmith-hierarchy");
const hierarchyRss = require("./plugins/metalsmith-hierarchy-rss");
const headings = require("./plugins/metalsmith-headings");
const algolia = require("./plugins/metalsmith-algolia");
const inPlace = require("./plugins/metalsmith-in-place-dcos");
const includeContent = require("./plugins/metalsmith-include-content-dcos");
const revision = require("./plugins/metalsmith-revision");
const shortcodes = require("./plugins/metalsmith-shortcodes");
const Utils = require("./core/utils");

// Configs
const configData = fs.readFileSync("config.json");
const config = JSON.parse(configData);
const shortcodesConfig = require("./shortcodes");

// Environment Variables
const GIT_BRANCH = process.env.GIT_BRANCH || "master";
const RENDER_PATH_PATTERN = process.env.RENDER_PATH_PATTERN || process.env.RPP;
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
  conductorDocsLatest: "1.0",
  dcosCNDocsLatest: "2.0",
  dcosDocsLatest: "2.1",
  dispatchDocsLatest: "1.2",
  kommanderDocsLatest: "1.1",
  konvoyDocsLatest: "1.5",
  kubeflowDocsLatest: "1.0.1-0.4.0",
  Utils,
});

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

//
// Content Branch Pipeline
//

// Start timer
MS.use(timer("Init"));

const neededToBuildMainMenu = [
  "index.md",
  "mesosphere/index.md",
  "mesosphere/dcos/index.md",
  `mesosphere/dcos/${MS._metadata.dcosDocsLatest}/index.md`,
  "mesosphere/dcos/cn/index.md",
  `mesosphere/dcos/cn/${MS._metadata.dcosCNDocsLatest}/index.md`,
  "ksphere/index.md",
  "ksphere/dispatch/index.md",
  `ksphere/dispatch/${MS._metadata.dispatchDocsLatest}/index.md`,
  "ksphere/konvoy/index.md",
  `ksphere/konvoy/${MS._metadata.konvoyDocsLatest}/index.md`,
  "ksphere/kommander/index.md",
  `ksphere/kommander/${MS._metadata.kommanderDocsLatest}/index.md`,
  "ksphere/kubeflow/index.md",
  `ksphere/kubeflow/${MS._metadata.kubeflowDocsLatest}/index.md`,
  "ksphere/conductor/index.md",
  `ksphere/conductor/${MS._metadata.conductorDocsLatest}/index.md`,
];
if (process.env.NODE_ENV === "development" && RENDER_PATH_PATTERN) {
  MS.use((files, _, done) => {
    Object.keys(files)
      .filter(
        (file) =>
          file.match(/\.md$/) &&
          !neededToBuildMainMenu.includes(file) &&
          !minimatch(file, RENDER_PATH_PATTERN)
      )
      .forEach((file) => {
        // remove all md-files outside the rendering-path to save a lot of compilation later on
        delete files[file];
      });
    done();
  });
}

MS.use(ignore(METALSMITH_SKIP_SECTIONS));
MS.use(timer("Ignore"));

MS.use(
  assets({
    source: "assets",
    destination: "assets",
  })
);
MS.use(timer("Assets"));

MS.use(
  copy({
    pattern: "**/README.md",
    transform: (file) => file.replace(/README/, "index"),
    move: true,
  })
);
MS.use(timer("Copy"));

// Load model data from external .json/.yaml files
// For example (in your Front Matter):
//   model: path/to/my.yml (access content in my.yml as model.foo.bar)
// Can also specify multiple named models:
//   model:
//   data1: path/to/my.json (access content in my.json as model.data1.foo.bar)
//   data2: path/to/my.yml (access content in my.yml as model.data2.foo.bar)
MS.use(
  dataLoader({
    dataProperty: "model",
    match: "**/*.md",
  })
);
MS.use(timer("Dataloader"));

// Load raw content via '#include' directives before rendering any mustache or markdown.
// For example (in your content):
//   #include path/to/file.tmpl
MS.use(
  includeContent({
    // Style as a C-like include statement. Must be on its own line.
    pattern: "^#include ([^ \n]+)$",
    match: "**/*.md*",
  })
);
MS.use(timer("IncludeContent"));

// Process any mustache templating in files.
// For example (in your Front Matter):
//   render: mustache
MS.use(
  inPlace({
    renderProperty: "render",
    match: "**/*.md",
  })
);
MS.use(timer("Mustache"));

// Folder Hierarchy
MS.use(hierarchy);
MS.use(timer("Hierarchy"));

// RSS Feed
MS.use(
  hierarchyRss({
    itemOptionsMap: {
      title: "title",
      description: "excerpt",
    },
  })
);
MS.use(timer("Hierarchy RSS"));

//
// Slow Plugins
//

// Shortcodes
MS.use(
  shortcodes({
    files: [".md"],
    shortcodes: shortcodesConfig,
  })
);
MS.use(timer("Shortcodes"));

// Don't rebuild files that have not been touched
if (process.env.NODE_ENV === "development") {
  MS.use(revision);
  MS.use(timer("Revision"));
}

// Markdown
MS.use(
  markdown({
    smartList: false,
    typographer: true,
    html: true,
  })
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

MS.use(
  redirect({
    "/support": "https://support.d2iq.com",
  })
);
MS.use(timer("Redirects"));

// Permalinks
MS.use(permalinks());
MS.use(timer("Permalinks"));

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

//
// Slow Plugins End
//

// Search Indexing
if (process.env.ALGOLIA_UPDATE === "true") {
  MS.use(algolia());
  MS.use(timer("Algolia"));
}

// Enable watching
// The keys represent the files to watch, the values are the files that will
// be updated. ONLY the files that are being updated will be accessible to
// during the rebuild. We must include the layouts when rerendering a page thus.
// Can only watch with a RENDER_PATH_PATTERN because there are too many
// files without it.
if (process.env.NODE_ENV === "development" && RENDER_PATH_PATTERN) {
  MS.use(
    watch({
      paths: {
        [`pages/${RENDER_PATH_PATTERN}/*.md`]: "**/*.{md,tmpl}",
        "layouts/**/*": "**/*",
        "js/**/*": "**/*",
        "scss/**/*": "**/*",
      },
      livereload: true,
    })
  );
  MS.use(timer("Watch"));
}

// Serve
if (process.env.NODE_ENV === "development") {
  MS.use(
    serve({
      host: "0.0.0.0",
      port: 3000,
    })
  );
  MS.use(timer("Webserver"));
}

MS.use(webpack("./webpack.config.js"));
MS.use(timer("Webpack"));

// Build
MS.build((err, files) => {
  if (err) throw err;
});
