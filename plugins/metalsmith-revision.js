const resolve = require('path').resolve;
const relative = require('path').relative;
const fs = require('fs');
const crypto = require('crypto');

var debug = require('debug')('metalsmith-revision');

const defaultOptions = { layout: false, layoutDir: './layouts' };

function plugin(opts) {
  const options = Object.assign({}, defaultOptions, opts);
  return (files, metalsmith, done) => {

    const configPath = resolve(metalsmith._directory, '.revision');
    const hashTable = { layouts: {}, src: {} };
    const layoutDirectory = resolve(metalsmith._directory, options.layoutDir);
    const revision = fs.existsSync(configPath)
      ? JSON.parse(fs.readFileSync(configPath, 'utf-8'))
      : null;

    if(revision == null) {
      fs.writeFileSync(configPath, JSON.stringify(hashTable), 'utf-8');
      done();
      return;
    }

    if(!metalsmith.revision) {
      metalsmith.revision = {};
    }

    metalsmith.revision.cachedFiles = Object.assign({}, files);

    Object.keys(files).forEach(file => {
      const hash = checksum(files[file].contents);
      hashTable.src[file] = hash;
      if(revision.src[file] === hash) {
        delete files[file];
      }
    });

    debug('%s files updated', Object.keys(files).length);

    fs.writeFileSync(configPath, JSON.stringify(hashTable), 'utf-8');
    done();
  }
}

function restore(opts) {
  const options = Object.assign({}, defaultOptions, opts);
  return (files, metalsmith, done) => {
    files = metalsmith.revision.cachedFiles;

    debug('%s files restored', Object.keys(files).length);

    done();
  }
}

function checksum (str, algorithm, encoding) {
  return crypto
    .createHash(algorithm || 'md5')
    .update(str, 'utf8')
    .digest(encoding || 'hex');
}

module.exports = {
  reduce: plugin,
  restore: restore
};