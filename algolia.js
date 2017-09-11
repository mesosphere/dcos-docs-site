const algoliasearch = require('algoliasearch')
const debug = require('debug')('metalsmith-algoliasearch')
const Bluebird = require('bluebird')

module.exports = function(options) {
  options = options || {}

  for (let parameter of ['projectId', 'privateKey', 'index']) {
    if (!options.hasOwnProperty(parameter)) {
      console.error(`Algolia: "${parameter}" option must be set, skipping indexation`)
      return
    }
  }

  let client = algoliasearch(options.projectId, options.privateKey)
  let index = client.initIndex(options.index)

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

        for (let file in files) {
          // if (files[file].algolia !== true) {
          //   continue
          // }

          debug(`processing file "${file}"`)

          if (typeof options.fileParser === 'function') {
            objects = objects.concat(options.fileParser(file, files[file]))
          }
          else {
            let data = {}

            data.objectID = file

            for (let key in files[file]) {
              switch (typeof files[file][key]) {
                case 'string':
                case 'boolean':
                case 'number':
                  data[key] = files[file][key]
                  break
                case 'object':
                  if (files[file][key] instanceof Buffer) {
                    data[key] = files[file][key].toString()
                  }
                  else {
                    // we have to detect circular refs before indexing objects
                  }
                  break
                case 'function':
                case 'symbol':
                default:
                  // don't care
                  console.log(`discarding key ${key}:`, typeof files[file][key])
                  break;
              }
            }

            objects.push(data)
          }
        }

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