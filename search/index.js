const algoliasearch = require('algoliasearch')
const debug = require('debug')('metalsmith-algoliasearch')
const Bluebird = require('bluebird');
const sanitizeHtml = require('sanitize-html');
const extname = require('path').extname;

module.exports = function(options) {
  options = options || {}

  for (let parameter of ['projectId', 'privateKey', 'index']) {
    if (!options.hasOwnProperty(parameter)) {
      console.error(`Algolia: "${parameter}" option must be set, skipping indexation`)
      return
    }
  }

  const client = algoliasearch(options.projectId, options.privateKey)
  const index = client.initIndex(options.index)

  index.setSettings({
    'attributesToSnippet': [
      'contents:30'
    ],
    'searchableAttributes': [
      'title',
      'contents',
      'enterprise'
    ],
    'attributesForFaceting': [
      'section',
      'product',
      'version'
    ]
  });

  return function(files, metalsmith, done) {
    let clearIndex

    debug(`indexing ${files.lentgh} files`)

    if (options.clearIndex === true) {
      clearIndex = new Bluebird((resolve) => {

        debug(`clear index "${options.index}"`)
        index.clearIndex(function(err) {
          if (err) {
            console.error('Algolia: error while cleaning index:', err)
          }

          resolve()
        })
      })
    } else {
      clearIndex = Bluebird.resolve()
    }

    clearIndex
      .then(() => {
        let promises = []
        let objects = []
        let indexed = 0

        Object.keys(files).forEach(function(file) {
          if (files[file].algolia === false || '.html' != extname(file)) return;

          debug(`processing file "${file}"`)

          if (typeof options.fileParser === 'function') {
            objects = objects.concat(options.fileParser(file, files[file]))
          }
          else {
            let pathParts = file.split('/');
            let data = {}

            // TEMP: Need to fine tune indexing
            if (pathParts[0] === 'docs') {
              data.section = 'DC/OS Docs';
              data.product = 'DC/OS';
              data.version = 'DC/OS ' + pathParts[1];
            }

            if (pathParts[0] === 'service-docs') {
              data.section = 'Service Docs';
              const product = pathParts[1].charAt(0).toUpperCase() + pathParts[1].slice(1)
              data.product = product;
              data.version = `${product} ${pathParts[2]}`;
            }

            data.objectID = file;

            for (let key in files[file]) {
              if (key === 'title' || key === 'path') {
                data[key] = files[file][key]
              }
              if (key === 'contents') {
                const string = files[file][key].toString();
                const parsedString = sanitizeHtml(string, {
                  allowedTags: [],
                  allowedAttributes: [],
                  selfClosing: [],
                  nonTextTags: [ 'style', 'script', 'textarea', 'noscript', 'pre' ],
                });
                data[key] = parsedString.replace(/\s+/g, " ");
              }
            }

            objects.push(data)
          }
        })

        debug(`got ${objects.length} objects to index`)

        for (let object of objects) {
          promises.push(new Bluebird((resolve) => {
            index.addObject(object, function(err, content) {
              if (err) {
                console.error(`Algolia: skipped "${object.objectID}": ${err.message}`)
              }
              else {
                debug(`indexed "${object.objectID}"`)
                indexed++
              }

              resolve()
            });
          }));
        }

        Bluebird.all(promises).then(() => {
          debug(`indexed ${indexed}/${objects.length} objects in "${options.index}" index`)
          done()
        })
      })
  }
}