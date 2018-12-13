const path = require('path');
const cheerio = require('cheerio');
const md = require('markdown-it')({
  typographer: true,
  html: true,
});
const { StringDecoder } = require('string_decoder');
const semver = require('semver');
const semverRegex = require('semver-regex');

const decoder = new StringDecoder('utf8');

function spaceship(val1, val2) {
  if ((val1 === null || val2 === null) || (typeof val1 !== typeof val2)) {
    return null;
  }
  if (typeof val1 === 'string') {
    return (val1).localeCompare(val2);
  }
  if (val1 > val2) {
    return 1;
  } else if (val1 < val2) {
    return -1;
  }
  return 0;
}


function walk(opts, file, files, array, possiblePaths, children = [], level = 0) {
  // Get path
  const pathParts = file.split('/');
  pathParts.pop();
  const urlPath = `/${pathParts.join('/')}`;
  const id = array[0];
  const child = children.find((c, _i) => c.id === id);
  // Only parse specified file types
  const basename = path.basename(file);
  const ext = path.extname(basename);
  let shouldParse = true;
  if (opts.files) {
    shouldParse = (opts.files.indexOf(ext) === -1) ? false : shouldParse;
  }
  // Build object
  if (!child && shouldParse) {
    const newChild = {
      id,
      path: urlPath,
      children: [],
    };
    const blacklist = [
      'stats',
      'mode',
      'contents',
    ];
    const fileObj = files[file];
    // Add front-matter
    Object.keys(fileObj).forEach((key) => {
      if (blacklist.indexOf(key) === -1) {
        newChild[key] = fileObj[key];
      }
    });
    // Add excerpt
    if (opts.excerpt && !newChild.excerpt) {
      const contents = decoder.write(fileObj.contents);
      const html = (ext === '.md') ? md.render(contents) : contents;
      const $ = cheerio.load(html);
      const elem = $('p').first();
      newChild.excerpt = elem.text();
    }
    possiblePaths[newChild.path] = newChild;
    children.push(newChild);
  }
  // Walk children
  if (child && array.length > 1) {
    const childChildrenArray = array.slice(1, array.length);
    const childChildren = walk(opts, file, files, childChildrenArray, possiblePaths, child.children, level + 1);
    child.children = childChildren;
  }
  // Sort
  children.sort((a, b) => {
    let x = spaceship(a.menuWeight, b.menuWeight);
    if (x === 0 && a.id && b.id && semverRegex().test(a.id) && semverRegex().test(b.id)) {
      const x1 = semverRegex().exec(a.id)[0] || a.id;
      const x2 = semverRegex().exec(b.id)[0] || b.id;
      x = semver.rcompare(x1, x2);
    }
    if (x === 0 && a.navigationTitle && b.navigationTitle) {
      const x1 = a.navigationTitle.toString().toUpperCase();
      const x2 = b.navigationTitle.toString().toUpperCase();
      x = spaceship(x1, x2);
    }
    if (x === 0 && a.title && b.title) {
      const x1 = a.title.toString().toUpperCase();
      const x2 = b.title.toString().toUpperCase();
      x = spaceship(x1, x2);
    }
    return x;
  });
  return children;
}

function plugin(opts) {
  return function hierarchyMiddleware(files, metalsmith, done) {
    setImmediate(done);

    const possiblePaths = {};

    const findByPath = function findByPath(pathArg) {
      let pathToFind = pathArg;
      if (pathToFind[0] !== '/') {
        pathToFind = `/${pathToFind}`;
      }
      // Check if exists
      if (!possiblePaths[pathToFind]) {
        // return;
        throw new Error(`Missing file in path: ${pathToFind}`);
      }

      return possiblePaths[pathToFind];
    };

    const find = function find(key, value) {
      let found = [];
      const w = (node) => {
        const matches = node.children.filter((n) => {
          if (!value) {
            return n[key] !== undefined;
          }
          return n[key] === value;
        });
        found = found.concat(matches);
        node.children.forEach((n) => {
          w(n);
        });
      };
      w(this);
      return found;
    };

    const findParent = function findParent(pathArg, key, value) {
      if (pathArg[0] !== '/') {
        pathArg = `/${pathArg}`;
      }
      const pathSplit = pathArg.split('/');
      const parentPath = pathSplit.slice(0, pathSplit.length - 1).join('/')
      return this.findByPath(parentPath);
    };

    const checkIfPathExists = function checkIfPathExists(potentialPath) {
      try {
        return this.findByPath(potentialPath);
      } catch (err) {
        return null;
      }
    };

    const r = {
      id: '',
      title: '',
      path: '/',
      children: [],
      findByPath,
      checkIfPathExists,
      findParent,
      find,
    };

    Object.keys(files).forEach((file, _index) => {
      const pathParts = file.split('/');
      pathParts.pop();
      const children = walk(opts, file, files, pathParts, possiblePaths, r.children, 0);
      r.children = children;
    });
    metalsmith.metadata().hierarchy = r;
  };
}

module.exports = plugin;
