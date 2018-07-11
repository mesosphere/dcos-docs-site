const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const RSS = require('rss');

function createFeed(opts, metalsmith, page) {
  const metadata = metalsmith.metadata();

  //
  // Feed
  //

  const feedOptions = {};

  if (page.title) {
    feedOptions.title = page.title;
  }
  if (metadata.description) {
    feedOptions.description = metadata.description;
  }
  if (metadata.url && page.path) {
    feedOptions.feed_url = path.join(metadata.url, page.path, 'rss.xml');
    feedOptions.site_url = path.join(metadata.url, page.path);
  }
  if (metadata.copyright) {
    feedOptions.copyright = metadata.copyright;
  }
  if (metadata.language) {
    feedOptions.language = metadata.language;
  }

  const feed = new RSS(feedOptions);

  //
  // Pages
  //

  const walk = (p) => {
    p.children.forEach((c) => {
      const itemOptions = {};
      Object.keys(opts.itemOptionsMap).forEach((key) => {
        const value = c[opts.itemOptionsMap[key]];
        if (value) {
          itemOptions[key] = value;
        }
      });

      if (c.path) {
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

  const destinationFolder = path.join(metalsmith.destination(), page.path);
  const destination = path.join(destinationFolder, '/rss.xml');
  if (!fs.existsSync(destinationFolder)) {
    mkdirp.sync(destinationFolder);
  }
  fs.writeFileSync(destination, feed.xml());
}

function rss(opts) {
  return function rssMiddleware(files, metalsmith, done) {
    setImmediate(done);

    const metadata = metalsmith.metadata();
    if (!metadata) {
      done(new Error('metadata must be configured'));
    }

    const hierarchy = metadata.hierarchy;
    if (!hierarchy) {
      done(new Error('hierarchy must be configured'));
    }

    const pages = hierarchy.find('rss', true);
    pages.forEach(page => createFeed(opts, metalsmith, page));
  };
}

module.exports = rss;
