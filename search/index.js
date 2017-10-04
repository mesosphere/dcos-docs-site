const algoliasearch = require('algoliasearch');
const Bluebird = require('bluebird');
const sanitizeHtml = require('sanitize-html');
const extname = require('path').extname;

/**
 * Search indexing for algolia
 */

/**
 * Parses buffer to string and sanitizes html.
 * Removes all contained <pre></pre> tags.
 * Removes all tags and replaces with whitespace.
 * @param {Buffer} buffer
 */
const sanitize = buffer => {
  let string = buffer.toString();
  let parsedString = sanitizeHtml(string, {
    allowedTags: [],
    allowedAttributes: [],
    selfClosing: [],
    nonTextTags: ['style', 'script', 'textarea', 'noscript', 'pre']
  });
  return parsedString.replace(/\s+/g, ' ');
};

module.exports = function(options) {
  /**
   * Algolia Configuration
   * @param {Object} options
   * @param {string} options.projectId
   * @param {string} options.privateKey
   * @param {string} options.index
   * @param {boolean} options.clearIndex
   */
  options = options || {};

  for (let parameter of ['projectId', 'privateKey', 'index']) {
    if (!options.hasOwnProperty(parameter)) {
      console.error(`Algolia: "${parameter}" option must be set, skipping indexation`);
      return;
    }
  }

  const client = algoliasearch(options.projectId, options.privateKey);
  const index = client.initIndex(options.index);

  /**
   * Algolia Indexing Settings
   */
  index.setSettings({
    attributesToSnippet: ['contents:30'],
    searchableAttributes: ['title', 'contents', 'enterprise'],
    attributesForFaceting: ['section', 'product', 'version']
  });

  return function(files, metalsmith, done) {
    let clearIndex;
    let metadata = metalsmith.metadata();
    if (!metadata) {
      console.error('Metadata must be configured');
      return;
    }
    let hierarchy = metadata.hierarchy;
    if (!hierarchy) {
      console.error('Hierarchy must be configured');
      return;
    }

    if (options.clearIndex === true) {
      clearIndex = new Bluebird(resolve => {
        index.clearIndex(err => {
          if (err) console.error('Algolia: Error while cleaning index:', err);
        });
        resolve();
      });
    } else {
      clearIndex = Bluebird.resolve();
    }

    // Initialize indexing
    clearIndex.then(() => {
      let promises = [];
      let objects = [];
      let indexed = 0;

      // Loop through metalsmith object
      Object.keys(files).forEach(file => {
        if ('.html' != extname(file)) return;

        let pathParts = file.split('/');
        pathParts.pop();

        let data = {};

        if (pathParts[0] === 'service-docs') {
          data[section] = 'Service Docs';
          // If in /service-docs/product/**
          if (pathParts[1]) {
            let productPath = pathParts.slice(0, 2).join('/');
            let product = hierarchy.findByPath(productPath).title || '';
            if (product) {
              data[product] = product;
            }
          }
          // If in /service-docs/product/version/**
          if (pathParts[2]) {
            let regex = /v[0-9].[0-9](.*)/g;
            let isVersion = regex.test(pathParts[2]);
            if (isVersion) {
              data[version] = pathParts[2];
            }
          }
        }

        if (pathParts[0] === 'docs') {
          data[section] = 'DC/OS Docs';
          data[product] = 'DC/OS';
          // If in /docs/*
          if (pathParts[1]) {
            data[version] = pathParts[1];
          }
        }

        data.objectID = file;

        // Loop through front-matter
        for (let key in files[file]) {
          // Retain title, path, enterprise, content
          if (key === 'title' || key === 'path' || key === 'enterprise') {
            data[key] = files[file][key];
          }
          if (key === 'contents') {
            data[key] = sanitize(files[file][key]);
          }
        }

        objects.push(data);
      });

      for (let object of objects) {
        promises.push(
          new Bluebird(resolve => {
            index.addObject(object, (err, content) => {
              if (err) {
                console.error(`Algolia: Skipped "${object.objectID}": ${err.message}`);
              } else {
                indexed++;
              }

              resolve();
            });
          })
        );
      }

      Bluebird.all(promises.then(() => {
        done();
      }))
    });
  };
};
