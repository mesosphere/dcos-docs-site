const resolve = require('path').resolve;
const relative = require('path').relative;
const fs = require('fs');
const crypto = require('crypto');
//const recurse = require('recursive-readdir');

function checksum (str, algorithm, encoding) {
  return crypto
    .createHash(algorithm || 'md5')
    .update(str, 'utf8')
    .digest(encoding || 'hex')
}

const default_options = { layout: false, layoutDir: './layouts' }

function plugin(opts) {
  const options = Object.assign({}, default_options, opts)
  return (files, metalsmith, done) => {

    const configPath = resolve(metalsmith._directory, '.revision')
    const hash_table = { layouts: {}, src: {} }
    const layoutDirectory = resolve(metalsmith._directory, options.layoutDir)
    const revision = fs.existsSync(configPath)
      ? JSON.parse(fs.readFileSync(configPath, 'utf-8'))
      : null;

    if(revision == null) {
      fs.writeFileSync(configPath, JSON.stringify(hash_table), 'utf-8')
      done();
      return;
    }

    if(!metalsmith.revision) {
      metalsmith.revision = {};
    }

    metalsmith.revision.cachedFiles = Object.assign({}, files);

    Object.keys(files).forEach(file => {
      const hash = checksum(files[file].contents)
      hash_table.src[file] = hash
      if(revision.src[file] === hash) {
        delete files[file];
      }
    });

    console.log('Updating %s files', Object.keys(files).length);

    fs.writeFileSync(configPath, JSON.stringify(hash_table), 'utf-8')
    done()
  }
}

function restore(opts) {
  const options = Object.assign({}, default_options, opts)
  return (files, metalsmith, done) => {
    files = metalsmith.revision.cachedFiles;
    console.log('Restored %s files.', Object.keys(files).length);
    done();
  }
}

module.exports = {
  reduce: plugin,
  restore: restore
};