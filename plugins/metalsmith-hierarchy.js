/* eslint no-param-reassign: 0 */
const fs = require('fs');
const { sortPages } = require('../core/utils');

const withMenus = [];
const paths = {};

const stripLast = (file) => file.replace(/\/[^/]+\/?$/, '');
const findLongestExisting = (path, fallback) => {
  if (fallback && path.length < fallback.length) return fallback;
  return paths[path] ? path : findLongestExisting(stripLast(path));
};

const firstParagraph = (file) => {
  const contents = file.contents
    .toString('utf-8')
    .split(/\r?\n/g)
    .filter((n) => n);

  return contents[0] || '';
};

/**
 * This plugin puts all files into a tree structure and adds some other variables:
 * * children
 * * id - used for sorting
 * * shortDesc - if no excerpt is set in the frontmatter, we'll add the first paragraph
 * * subtree - this propagates variables down to all ancestors
 * * parent
 */
module.exports = (files, metalsmith, done) => {
  setImmediate(done);

  Object.entries(files).forEach(([filePath, file]) => {
    if (!filePath.endsWith('.md')) return;

    Object.assign(file, {
      children: [],
      id: filePath.split('/').slice(-2)[0],
      path: `/${filePath.replace(/index.md$/, '').replace(/\/$/, '')}`,
      shortDesc: file.excerpt || firstParagraph(file),
    });

    file.parent = files[filePath.replace(/[^/]+\/index.md$/, 'index.md')];
    if (!file.parent) return;

    // subtree-prop inheritance
    file.subtree = { ...file.parent.subtree, ...file.subtree };
    Object.assign(file, file.subtree);

    if (file.draft && process.env.NODE_ENV === 'production') {
      delete files[filePath];
      return;
    }

    paths[file.path] = file;
    if (file.menus) withMenus.push(file);
    file.parent.children.push(file);
    file.parent.children.sort(sortPages);
  });

  // create redirects file for confluence
  const file = fs.createWriteStream('redirects.txt');
  file.on('error', (err) => {
    /* error handling */
    throw err;
  });
  Object.keys(paths).forEach((path) => {
    const excludes = ['/', '/404', '/search'];

    if (excludes.includes(path)) return;

    if (path.includes('konvoy/2.3') || path.includes('kommander/2.3')) return;

    const redirect = `literal ${path} https://archive-docs.d2iq.com${path} permanent`;
    file.write(`${redirect}\n`);
  });
  file.end();

  metalsmith.metadata().hierarchy = {
    findByPath(pathToFind) {
      if (!paths[pathToFind]) throw new Error(`Missing file: ${pathToFind}`);
      return paths[pathToFind];
    },
    findLongestExisting,
    findMenus: (v) => withMenus.filter((c) => v(c.menus)).sort(sortPages),
  };
};
