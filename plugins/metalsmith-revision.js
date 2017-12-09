const resolve = require('path').resolve;
const relative = require('path').relative;
const fs = require('fs');
const crypto = require('crypto');
const debug = require('debug')('metalsmith-revision');

const defaultOptions = { layout: false, layoutDir: './layouts' };

let initialized = false;

function plugin(opts) {
  const options = Object.assign({}, defaultOptions, opts);
  return (files, metalsmith, done) => {

    const configPath = resolve(metalsmith._directory, '.revision');
    const hashTable = { layouts: {}, src: {}, frontmatter: {} };
    const layoutDirectory = resolve(metalsmith._directory, options.layoutDir);

    if(!initialized && fs.existsSync(configPath)) {
      initialized = true;
      fs.unlinkSync(configPath)
      debug('Refreshing revision file');
    }

    const revision = fs.existsSync(configPath)
      ? JSON.parse(fs.readFileSync(configPath, 'utf-8'))
      : { layouts: {}, src: {}, frontmatter: {} };

    if(!metalsmith.revision) {
      metalsmith.revision = {};
    }

    metalsmith.revision.cachedFiles = Object.assign({}, files);

    Object.keys(files).forEach(file => {

      // Src hash
      const hash = checksum(files[file].contents);
      hashTable.src[file] = hash;

      // Front-matter hash
      let frontmatter = Object.assign({}, files[file]);
      delete frontmatter.contents;
      delete frontmatter.stats;
      delete frontmatter.mode;
      const frontmatterString = JSON.stringify(frontmatter);
      const frontmatterHash = checksum(frontmatterString);
      hashTable.frontmatter[file] = frontmatterHash;

      // Do not process file if hash are the same
      if(revision.src[file] === hash && revision.frontmatter[file] == frontmatterHash) {
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