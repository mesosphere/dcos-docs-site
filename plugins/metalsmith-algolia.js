const algoliasearch = require('algoliasearch');
const semverRegex = require('semver-regex');
const semverSort = require('semver-sort');
const sanitizeHtml = require('sanitize-html');
const extname = require('path').extname;
const debug = require('debug')('metalsmith-algolia');

/**
 * Search indexing for algolia
 */

module.exports = function algoliaMiddlewareCreator(options = {}) {
  /**
   * Algolia Configuration
   * @param {Object} options
   * @param {string} options.projectIds
   * @param {string} options.privateKey
   * @param {string} options.index
   * @param {array} options.skipSections
   * @param {string} options.renderPathPattern
   */

  const parameters = ['projectId', 'privateKey', 'index'];

  for (let i = 0; i < parameters.length; i += 1) {
    const parameter = parameters[i];
    if (!options[parameter]) {
      console.error(`Algolia: "${parameter}" option must be set, skipping indexation`);
      return null;
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
      'content:40',
    ],
    attributesForFaceting: ['section', 'product', 'version', 'type'],
    customRanking: ['asc(section)', 'desc(product)', 'asc(versionWeight)'],
  });

  return function metalsmithAlgoliaMiddleware(files, metalsmith, done) {
    // Get metadata
    const metadata = metalsmith.metadata();
    if (!metadata) {
      console.error('Metadata must be configured');
      return;
    }

    // Get hierarchy
    const hierarchy = metadata.hierarchy;
    if (!hierarchy) {
      console.error('Hierarchy must be configured');
      return;
    }

    // Build semver map
    const semverMap = buildSemverMap(files, options.skipSections, options.renderPathPattern);

    // Remove objects that no longer exist
    const start = new Promise((resolve, reject) => {
      const browser = index.browseAll();
      let hits = [];

      browser.on('result', function onResult(content) {
        hits = hits.concat(content.hits);
      });

      browser.on('error', function onError(err) {
        throw err;
      });

      browser.on('end', function onEnd() {
        const existingFiles = Object.keys(files).filter(file => extname(file) === '.html');
        debug('%d local files', existingFiles.length);
        const indexObjectIDs = hits.map(hit => hit.objectID);
        debug('%d existing objectIDs in index', indexObjectIDs.length);

        const objectIDsToDelete = indexObjectIDs.filter(id => !files[id])
        debug('Deleting %d old objectIDs from index...', objectIDsToDelete.length);

        index.deleteObjects(objectIDsToDelete, () => {
          resolve();
        });
      });
    });

    // Initialize indexing
    start.then(() => {
      const promises = [];
      const objects = [];

      // Loop through metalsmith object
      Object.keys(files).forEach((file) => {
        if (inExcludedSection(file, options.skipSections, options.renderPathPattern)) {
          return;
        }
        if (extname(file) !== '.html') return;
        const fileData = files[file];
        const postContent = sanitize(fileData.contents, file);
        const postParts = convertStringToArray(postContent, 9000);
        postParts.forEach((value, _index) => {
          const record = getSharedAttributes(fileData, hierarchy, semverMap);
          if (!record) return;
          record.objectID = file;
          record.content = transform(value);
          record.createIfNotExists = true;
          objects.push(record);
        });
      });

      for (let i = 0; i < objects.length; i += 1) {
        const object = objects[i];
        promises.push(
          new Promise((resolve, reject) => {
            index.partialUpdateObject(object, (err, _content) => {
              if (err) {
                console.error(`Algolia: Skipped "${object.objectID}": ${err.message}`);
                reject(err);
              } else {
                // debug(`Algolia: Updating "${object.objectID}"`);
              }
              resolve();
            });
          }),
        );
      }

      promises.reduce((promise, item) => {
        return promise.then(() => item.then());
      }, Promise.resolve()).then(() => {
        done();
      });
    });
  };
};

const transformations = {
  '&nbsp;': ' ',
  '&lt;': '<',
  '&gt;': '>',
  '&amp;': '&',
  '&quot;': '"',
  '&apos;': '\'',
  '&cent;': '¢',
  '&pound;': '£',
  '&yen;': '¥',
  '&euro;': '€',
  '&copy;': '©',
  '&reg;': '®',
  '\\n': ' ',
};

const transform = (content) => {
  let replacedContent = content;
  Object.keys(transformations).forEach((htmlEntity) => {
    const replacement = transformations[htmlEntity];
    const htmlEntRegex = new RegExp(htmlEntity, 'g');
    replacedContent = replacedContent.replace(htmlEntRegex, replacement);
  });

  return replacedContent;
};

// File paths caught here will not be indexed for search.
// This is determined by the ALGOLIA_SKIP_SECTIONS environment variable.
const inExcludedSection = (filePath, skipSections, renderPathPattern) => {
  if (renderPathPattern) {
    const pathPatternRegex = RegExp(renderPathPattern);
    if (!pathPatternRegex.test(filePath)) {
      return true;
    }
  }

  for (let i = 0; i < skipSections.length; i += 1) {
    const skipSection = skipSections[i];
    const regex = RegExp(skipSection);

    if (regex.test(filePath)) {
      return true;
    }
  }

  return false;
};

// Build a sorted map that ranks semver
const buildSemverMap = (files, skipSections, renderPathPattern) => {

  const services = {
    dcos: [],
  };

  const cleanVersion = (version) => {
    if (semverRegex().test(version)) {
      return version;
    }
    const v = version.split('.');
    if (v.length < 3) {
      v.push('0');
    }
    return v.slice(0, 3).join('.');
  };

  // Filter
  const filePaths = Object.keys(files);
  for (let i = 0; i < filePaths.length; i += 1) {
    const file = filePaths[i];
    const pathParts = file.split('/');
    if (inExcludedSection(file, skipSections, renderPathPattern)) {
      continue;
    } else if (pathParts[0] === 'services' && pathParts[2] && /^(v|)[0-9].[0-9](.*)/.test(pathParts[2])) {
      if (!services[pathParts[1]]) {
        services[pathParts[1]] = [];
      }
      const serviceVersions = services[pathParts[1]];
      if (serviceVersions.indexOf(pathParts[2]) === -1) {
        serviceVersions.push(pathParts[2]);
      }
    } else if (/^[0-9]\.[0-9](.*)/.test(pathParts[0]) && services.dcos.indexOf(pathParts[0]) === -1) {
      services.dcos.push(pathParts[0]);
    }
  }

  const map = {};
  Object.keys(services).forEach((service) => {
    const serviceVersions = services[service];
    const versionsCleaned = serviceVersions.map(cleanVersion);
    const versionsSorted = semverSort.desc(versionsCleaned);

    serviceVersions.forEach((version) => {
      const cv = cleanVersion(version);
      const weight = versionsSorted.indexOf(cv);

      map[version] = {
        version: cv,
        weight,
      };
    });
  });

  return map;
};

// Get shared attributes for a record.
const getSharedAttributes = (fileData, hierarchy, semverMap) => {
  const pathParts = fileData.path.split('/');
  const record = {};

  if (pathParts[0] === 'test') {
    return null;
  } else if (pathParts[0] === '404') {
    return null;
  } else if (pathParts[0] === 'services') {
    let product;
    record.section = 'Service Docs';
    // If in /services/product/**
    if (pathParts[1]) {
      const productPath = pathParts.slice(0, 2).join('/');
      product = hierarchy.findByPath(productPath).title || '';
      if (product) {
        record.product = product;
      }
    }
    // If in /services/product/version/**
    if (pathParts[2]) {
      const regex = /^(v|)[0-9].[0-9](.*)/g;
      const isVersion = regex.test(pathParts[2]);
      if (isVersion) {
        record.version = `${product} ${pathParts[2].substr(1)}`;
        record.versionNumber = pathParts[2].substr(1);
        record.versionWeight = semverMap[pathParts[2]].weight;
      }
    }
  } else if (/^[0-9]\.[0-9](.*)/.test(pathParts[0])) {
    // Docs version
    const product = 'DC/OS';
    record.section = 'DC/OS Docs';
    record.product = product;
    // If in /1.*/*
    if (pathParts[0]) {
      record.version = `${product} ${pathParts[0]}`;
      record.versionNumber = pathParts[0];
      record.versionWeight = semverMap[pathParts[0]].weight;
    }
  } else {
    return null;
  }

  let type = '';
  if (fileData.enterprise) type = 'Enterprise';
  if (fileData.oss) type = 'Open Source';

  record.title = fileData.title;
  record.path = fileData.path;
  record.type = type;

  if (!record.title) {
    console.error(`Warning: ${record.path} has no title and will not be indexed.`);
    return null;
  }
  if (!record.product) {
    console.error(`Warning: ${record.path} has no product and will not be indexed.`);
    return null;
  }

  // Excerpt
  if (fileData.excerpt) {
    record.excerpt = fileData.excerpt;
  } else {
    const content = sanitize(fileData.contents, fileData.path);
    const contentWords = content.split(' ');
    const excerpt = contentWords.slice(0,40).join(' ');
    record.excerpt = excerpt;
  }

  return record;
};

// Trim whitespace from of string.
const trim = string => string.replace(/^\s+|\s+$/g, '');

/**
 * Parses buffer to string and sanitizes html.
 * Removes all tags and replaces with whitespace.
 * @param {Buffer} buffer
 * @param {String} file
 */
const sanitize = (buffer, file) => {
  const string = buffer.toString();
  let parsedString = sanitizeHtml(string, {
    allowedTags: [],
    allowedAttributes: [],
    selfClosing: [],
    nonTextTags: [
      'head',
      'style',
      'script',
      'textarea',
      'noscript',
      'header',
      'footer',
      'nav',
      'aside',
      'section',
    ],
  });
  parsedString = trim(parsedString);
  // Remove extraneous information from content
  // Because this library doesn't have the tools necessary to do it nicely

  // Remove all content up to and including the action buttons
  // Some pages don't have action buttons.
  // For those pages, have the first capture group take nothing
  const headerRegex = /^(.*SharePrintContributeDiscussFeedback|)((\n|.)*)?/;
  const capturedContent = headerRegex.exec(parsedString);
  // Only take the second capture group
  const filteredContent = capturedContent[2];

  if (filteredContent) return filteredContent;

  // There should be no blank pages
  console.error(`Warning: file ${file} has no content.`);
  return '';
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
