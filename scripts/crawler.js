/**
 * Usage:       node crawler.js
 *
 * Description: Scrapes all wordpress uploaded images from
 * https://docs.mesosphere.com and creates redirects based on image
 * location in project.
 *
 */

const fs = require('fs');
const path = require('path');
const url = require("url");
const Crawler = require("crawler");
const Finder = require('fs-finder');
const OUTPUT_DIR = './crawler';
const OUTPUT_REDIRECTS_FILE = './crawler/redirects';
const OUTPUT_BROKEN_FILE = './crawler/broken';

// Create folders & files
if (!fs.existsSync(OUTPUT_DIR)){
  fs.mkdirSync(OUTPUT_DIR);
}
fs.writeFileSync(OUTPUT_REDIRECTS_FILE, ``);
fs.writeFileSync(OUTPUT_BROKEN_FILE, ``);

// Do not crawl these urls
let urlsBlacklist = [
  'https://docs.mesosphere.com/service-docs/beta-dse/v1.1.8-5.1.2-beta/terms-of-use/',
  'https://docs.mesosphere.com/service-docs/beta-dse/v1.1.7-5.0.7-beta/terms-of-use/',
  'https://docs.mesosphere.com/service-docs/dse/v2.0.0-5.1.2/terms-of-use/',
];

// Keep track of urls crawled so we dont loop
let urlsCrawled = [];

// Image src already processed
let srcCrawled = [];

/**
 * Crawler
 *
 */
var c = new Crawler({
  maxConnections: 20,
  callback: callback
});

c.queue({
  uri: 'https://docs.mesosphere.com/service-docs',
  rootFolder: './pages/service-docs',
});

c.queue({
  uri: 'https://docs.mesosphere.com/1.10',
  rootFolder: './pages/1.10',
});

c.queue({
  uri: 'https://docs.mesosphere.com/1.9',
  rootFolder: './pages/1.9',
});

c.queue({
  uri: 'https://docs.mesosphere.com/1.8',
  rootFolder: './pages/1.8',
});

c.queue({
  uri: 'https://docs.mesosphere.com/1.7',
  rootFolder: './pages/1.7',
});

/**
 * Stores redirect in file
 *
 */
function storeRedirect(urlFrom, urlTo) {
  fs.appendFileSync(OUTPUT_REDIRECTS_FILE, `${urlFrom} ${urlTo};\r\n`);
}

/**
 * Stores image urls that are not found in project
 *
 */
function storeBroken(url, urlImage) {
  fs.appendFileSync(OUTPUT_BROKEN_FILE, `${url} ${urlImage}\r\n`);
}

/**
 * Callback for crawler
 *
 */
function callback(error, res, done) {

  //
  // Handle Error
  //

  if(error){
    console.log(error);
    done();
    return;
  }

  var $ = res.$;

  //
  // Get all image urls
  //

  let images = [];
  $('*').each((index, element) => {

    let src = $(element).attr('src') || $(element).css('background-image');

    if(!src) {
      return;
    }

    if(!src.match(/.(jpg|jpeg|png|gif)$/i)) {
      return;
    }

    if(src.indexOf('/wp-content/uploads') == -1) {
      return;
    }

    // Push in array
    images.push(src);

  });

  // Log
  console.log('URI: %s', res.options.uri);
  console.log('Images %s', images.length);
  console.log('Current Queue: %s', c.queueSize);
  console.log('Total Queue: %s', urlsCrawled.length);
  console.log('Images Handled: %s\n', srcCrawled.length);

  //
  // Create redirects
  //

  images.forEach((src) => {

    // Skip if already crawled
    if(srcCrawled.indexOf(src) != -1) {
      return;
    }

    // Push
    srcCrawled.push(src);

    let basename = path.basename(src);

    // Cleans pattern file-1-1280x800.gif
    basename = basename.replace(/-[0-9]+-(?=[^-]*$)(.*)x(.*)\.gif/g, '.png');

    // Cleans pattern file-1280x800.gif
    basename = basename.replace(/-(?=[^-]*$)(.*)x(.*)\.gif/g, '.png');

    // Cleans pattern file-1-1280x800.png
    basename = basename.replace(/-[0-9]+-(?=[^-]*$)(.*)x(.*)\./g, '.');

    // Cleans pattern file-1280x800.png
    basename = basename.replace(/-(?=[^-]*$)(.*)x(.*)\./g, '.');

    // Find file in local project
    let file = Finder.from(res.options.rootFolder).findFiles(basename)[0];

    // File found, store redirect
    if(file) {
      let urlFrom = url.parse(src).pathname;
      let urlTo = `/${file.split('/pages/')[1]}`;
      storeRedirect(urlFrom, urlTo);
    }

    // Cannot find, store broken
    else {
      storeBroken(res.options.uri, src);
    }

  });

  //
  // Crawl links on page
  //

  $('a').each((index, element) => {

    let href = $(element).attr('href');

    if(!href) {
      return;
    }

    if(href.indexOf(res.options.uri) != 0) {
      return;
    }

    if(urlsCrawled.indexOf(href) != -1) {
      return;
    }

    if(urlsBlacklist.indexOf(href) != -1) {
      return;
    }

    urlsCrawled.push(href);

    c.queue({
      uri: href,
      rootFolder: res.options.rootFolder,
    });

  });

  //
  // Finish
  //

  done();

}
