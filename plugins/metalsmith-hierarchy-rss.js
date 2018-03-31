const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
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
    feedOptions.feed_url = metadata.url.concat(page.path, '/rss.xml');
    feedOptions.site_url = metadata.url.concat(page.path);
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
        itemOptions.url = metadata.url.concat(c.path);
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

module.exports = rss;