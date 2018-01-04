const algoliasearch = require('algoliasearch');
const semverRegex = require('semver-regex');
const semverSort = require('semver-sort');
const sanitizeHtml = require('sanitize-html');
const extname = require('path').extname;
const debug = require('debug')('metalsmith-algolia');

/**
 * Search indexing for algolia
 */

module.exports = function(options) {
  /**
   * Algolia Configuration
   * @param {Object} options
   * @param {string} options.projectIds
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
    distinct: true,
    attributeForDistinct: 'path',
    searchableAttributes: ['title', 'excerpt', 'content'],
    attributesToSnippet: [
      'excerpt:40',
      'content:40'
    ],
    attributesForFaceting: ['section', 'product', 'version', 'type'],
    customRanking: ['asc(section)', 'desc(product)', 'asc(versionWeight)'],
  });

  return function(files, metalsmith, done) {

    // Getr metadata
    let metadata = metalsmith.metadata();
    if (!metadata) {
      console.error('Metadata must be configured');
      return;
    }

    // Get hierarchy
    let hierarchy = metadata.hierarchy;
    if (!hierarchy) {
      console.error('Hierarchy must be configured');
      return;
    }

    // Build semver map
    let semverMap = buildSemverMap(files);

    // Start promise chain
    let start;

    // Clear index
    if (options.clearIndex === true) {
      start = new Promise((resolve, reject) => {
        index.clearIndex(err => {
          if (err) console.error('Algolia: Error while cleaning index:', err);
          console.log('Algolia: Cleared index');
          resolve();
        });
      });
    } else {
      start = Promise.resolve();
    }

    // Initialize indexing
    start.then(() => {
      let promises = [];
      let objects = [];
      let indexed = 0;

      // Loop through metalsmith object
      Object.keys(files).forEach(file => {
        if ('.html' != extname(file)) return;
        const fileData = files[file];
        const postContent = sanitize(fileData.contents);
        const postParts = convertStringToArray(postContent, 9000);
        postParts.forEach((value, index) => {
          let record = getSharedAttributes(fileData, hierarchy, semverMap);
          record.objectID = file + '-' + index;
          record.content = value;
          record.record_index = index;
          objects.push(record);
        });
      });

      for (let object of objects) {
        promises.push(
          new Promise((resolve, reject) => {
            index.addObject(object, (err, content) => {
              if (err) {
                debug(`Algolia: Skipped "${object.objectID}": ${err.message}`);
                reject(err);
              }
              else {
                debug(`Algolia: Updating "${object.objectID}"`);
                indexed++;
              }
              resolve();
            });
          }),
        );
      }

      promises.reduce((promise, item) => {
        return promise.then(() => {
          return item.then();
        });
      }, Promise.resolve())
      .then(() => {
        done();
      });

    });

  };
};

// Build a sorted map that ranks semver
const buildSemverMap = (files) => {

  let versions = [];
  let map = {};

  const cleanVersion = (version) => {
    if(semverRegex().test(version)) {
      return version;
    }
    let v = version.split('.');
    if(v.length < 3) {
      v.push('0');
    }
    return v.slice(0, 3).join('.');
  }

  // Filter
  for(let file in files) {
    const pathParts = file.split('/');
    if(pathParts[0] == 'services' && pathParts[2] && /^(v|)[0-9].[0-9](.*)/.test(pathParts[2]) && versions.indexOf(pathParts[2]) == -1) {
      versions.push(pathParts[2]);
    }
    else if (/^[0-9]\.[0-9](.*)/.test(pathParts[0]) && versions.indexOf(pathParts[0]) == -1) {
      versions.push(pathParts[0]);
    }
  }

  // Sort
  let versionsSorted = versions.map(cleanVersion);
  versionsSorted = semverSort.desc(versionsSorted);

  // Map
  versions.forEach((version) => {
    let cv = cleanVersion(version);
    let weight = versionsSorted.indexOf(cv);
    map[version] = {
      version: cv,
      weight: weight,
    };
  });

  return map;
}

// Get shared attributes for a record.
const getSharedAttributes = (fileData, hierarchy, semverMap) => {

  const pathParts = fileData.path.split('/')
  let record = {};

  if (pathParts[0] === 'test') {
    return record;
  }

  else if (pathParts[0] === '404') {
    return record;
  }

  // Services
  else if (pathParts[0] === 'services') {
    let product;
    record.section = 'Service Docs';
    // If in /services/product/**
    if (pathParts[1]) {
      let productPath = pathParts.slice(0, 2).join('/');
      product = hierarchy.findByPath(productPath).title || '';
      if (product) {
        record.product = product;
      }
    }
    // If in /services/product/version/**
    if (pathParts[2]) {
      let regex = /^(v|)[0-9].[0-9](.*)/g;
      let isVersion = regex.test(pathParts[2]);
      if (isVersion) {
        record.version = product + ' ' + pathParts[2].substr(1);
        record.versionNumber = pathParts[2].substr(1);
        record.versionWeight = semverMap[pathParts[2]].weight;
      }
    }
  }

  // Docs version
  else if (/^[0-9]\.[0-9](.*)/.test(pathParts[0])) {
    product = 'DC/OS';
    record.section = 'DC/OS Docs';
    record.product = product;
    // If in /1.*/*
    if (pathParts[0]) {
      record.version = product + ' ' + pathParts[0];
      record.versionNumber = pathParts[0];
      record.versionWeight = semverMap[pathParts[0]].weight;
    }
  }

  let type = '';
  if (fileData.enterprise) type = 'Enterprise';
  if (fileData.oss) type = 'Open Source';

  record.title = fileData.title;
  record.path = fileData.path;
  record.type = type;

  // Excerpt
  if (fileData.excerpt) {
    record.excerpt = fileData.excerpt;
  }
  else {
    let excerptPath = pathParts.join('/');
    let objectHierarchy = hierarchy.findByPath(excerptPath) || '';
    let excerpt = objectHierarchy.excerpt || '';
    if (objectHierarchy && excerpt) {
      record.excerpt = excerpt;
    }
  }

  return record;
};

// Trim whitespace from of string.
const trim = string => {
  return string.replace(/^\s+|\s+$/g, '');
};

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
    nonTextTags: ['style', 'script', 'textarea', 'noscript', 'pre'],
  });
  parsedString = trim(parsedString);
  return parsedString;
};

// Push content to array.
const convertStringToArray = (str, maxPartSize) => {
  const chunkArr = [];
  let leftStr = str;
  do {
    chunkArr.push(leftStr.substring(0, maxPartSize));
    leftStr = leftStr.substring(maxPartSize, leftStr.length);
  } while (leftStr.length > 0);
  return chunkArr;
};