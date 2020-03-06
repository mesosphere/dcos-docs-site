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
   * @param {string} options.projectId
   * @param {string} options.privateKey
   * @param {array} options.skipSections
   * @param {string} options.renderPathPattern
   */

  const parameters = ['projectId', 'privateKey'];

  for (let i = 0; i < parameters.length; i += 1) {
    const parameter = parameters[i];
    if (!options[parameter]) {
      console.error(`Algolia: "${parameter}" option must be set, skipping indexation`);
      return null;
    }
  }

  const client = algoliasearch(options.projectId, options.privateKey);
  const indices = {
    'mesosphere-dcos': client.initIndex('mesosphere-dcos'),
    'ksphere-konvoy': client.initIndex('ksphere-konvoy'),
    'ksphere-kommander': client.initIndex('ksphere-kommander'),
    'ksphere-dispatch': client.initIndex('ksphere-dispatch')
  }

  // /**
  //  * Algolia Indexing Settings
  //  */
  // index.setSettings({
  //   distinct: true,
  //   attributeForDistinct: 'path',
  //   searchableAttributes: ['title', 'excerpt', 'content'],
  //   attributesToSnippet: [
  //     'excerpt:40',
  //     'content:40',
  //   ],
  //   attributesForFaceting: ['section', 'product', 'version', 'type'],
  //   customRanking: ['asc(section)', 'desc(product)', 'asc(versionWeight)'],
  // });

  return function metalsmithAlgoliaMiddleware(files, metalsmith, done) {
    const metadata = metalsmith.metadata();
    if (!metadata) {
      console.error('Metadata must be configured');
      return;
    }

    const hierarchy = metadata.hierarchy;
    if (!hierarchy) {
      console.error('Hierarchy must be configured');
      return;
    }

    const filenames = Object.keys(files);

    const filesToIndex = {};

    filenames.forEach(filename => {
      if(htmlFile(filename) && !inExcludedSection(filename, options.skipSections, options.renderPathPattern)) {
        // Only index files that are two directories deep, aka mesosphere/dcos/...
        const indexName = filename.split('/').slice(0, 2).join('-');
        if (!indexName.includes('index.html')) {
          filesToIndex[indexName] = filesToIndex[indexName]  || [];
          filesToIndex[indexName].push(files[filename]);
        }
      }
    });

    // index the objects
    const products = {
      dcos: 'DC/OS',
      konvoy: 'Konvoy',
      kommander: 'Kommander',
      dispatch: 'Dispatch'
    };

    const semverMap = buildSemverMap(files, options.skipSections, options.renderPathPattern);

    const productize = (file, indexFile) => {
      const paths = file.path.split('/');
      indexFile.product = products[paths[1]];

      indexFile.versionNumber = '';

      // DC/OS
      if (paths[1] === 'dcos') {
        if (paths[2] === 'services') {
          indexFile.section = 'Service Docs';
          if (paths[3]) {
            indexFile.product = paths[3]
              .split('-')
              .map(word => {
                word[0] = word[0].toUpperCase();
                return word;
              })
            .join(' ');
          }
          if (paths[4]) {
            indexFile.versionNumber = paths[4];
            indexFile.versionWeight = semverMap[paths[3]][paths[4]];
          }
        } else {
          indexFile.section = 'DC/OS Docs';
          if (isVersion(paths[2])) {
            indexFile.versionNumber = paths[2];
            indexFile.versionWeight = semverMap.dcos[paths[2]];
          }
        }
      } else if (paths[1] === 'konvoy') {
        if (paths[2] === 'partner-solutions') {
          indexFile.section = 'Partner Solutions Docs';
        } else if (paths[2] === 'latest') {
          indexFile.section = 'Konvoy Docs';
        }
      } else if (paths[1] === 'kommander') {
        indexFile.section = 'Kommander Docs';
      } else if (paths[1] === 'dispatch') {
        indexFile.section = 'Dispatch Docs';
      }
      indexFile.version = indexFile.product;

      if (indexFile.versionNumber !== '') {
        indexFile.version += ' ' + indexFile.versionNumber;
      }
    };

    Object.keys(filesToIndex).forEach(indexName => {
      const index = indices[indexName];

      // Remove index objects that no longer exist
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
          const existingFiles = {};
          Object.keys(files)
            .filter(file => extname(file) === '.html')
            .forEach(filename => existingFiles[files[filename].path] = true);

          debug('%d local files', Object.keys(existingFiles).length);
          const indexObjectIDs = hits.map(hit => hit.objectID);
          debug('%d existing objectIDs in index', indexObjectIDs.length);

          const objectIDsToDelete = indexObjectIDs.filter(id => !existingFiles[id])
          debug('Deleting %d old objectIDs from index...', objectIDsToDelete.length);

          index.deleteObjects(objectIDsToDelete, () => {
            resolve();
          });
        });
      });

      const files = filesToIndex[indexName];

      const toAlgolia = (file) => {
        const indexFile = {};
        indexFile['objectID'] = file['path'];
        indexFile['title'] = file['title'];
        indexFile['path'] = file['path'];
        indexFile.createIfNotExists = true;

        if (file.enterprise) indexFile.type = 'Enterprise';
        if (file.oss) indexFile.type = 'Open Source';
        if (file.community) indexFile.type = 'Community';

        indexFile['content'] = transform(sanitize(file.contents, file.path));
        indexFile['excerpt'] = indexFile['content'].slice(0, 200);

        productize(file, indexFile);

        return indexFile;
      };

      const algoliaObjects = files.map(file => toAlgolia(file));

      start.then(() => {
        const promises = [];

        for (let i = 0; i < algoliaObjects.length; i += 1) {
          const object = algoliaObjects[i];
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
    });
  };
};

//
// Used methods
//

const htmlFile = (filename) => extname(filename) === '.html';

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

  return replacedContent.slice(0, 500);
};

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

// Trim whitespace from of string.
const trim = string => string.replace(/^\s+|\s+$/g, '');

const isVersion = (version) => /^[0-9]\.[0-9](.*)/.test(version);

const buildSemverMap = (files, skipSections, renderPathPattern) => {
  const services = {
    dcos: [],
  };

  // Filter
  const filePaths = Object.keys(files);
  for (let i = 0; i < filePaths.length; i += 1) {
    const file = filePaths[i];
    const pathParts = file.split('/');
    if (inExcludedSection(file, skipSections, renderPathPattern)) {
      continue;
    } else if (pathParts[2] === 'services' && pathParts[4] && /^(v|)[0-9].[0-9](.*)/.test(pathParts[4])) {
      services[pathParts[3]] = services[pathParts[3]] || [];
      const serviceVersions = services[pathParts[3]];
      if (serviceVersions.indexOf(pathParts[4]) === -1) {
        serviceVersions.push(pathParts[4]);
      }
    } else if (isVersion(pathParts[2]) && services.dcos.indexOf(pathParts[2]) === -1) {
      services.dcos.push(pathParts[2]);
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

      map[service] = map[service] || {};
      map[service][version] = weight;
    });
  });

  return map;
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
