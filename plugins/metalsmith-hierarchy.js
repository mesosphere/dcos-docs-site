const { extname } = require("path");
const $ = require("cheerio");
const md = require("markdown-it")({ typographer: true, html: true });
const semver = require("semver");

const isValue = (v) => v !== undefined && v !== null;

function spaceship(val1, val2) {
  if (!isValue(val1) || !isValue(val2) || typeof val1 !== typeof val2) {
    return 0;
  }
  if (typeof val1 === "string") {
    return val1.localeCompare(val2);
  }
  return val1 - val2;
}
const semverCompare = (a, b) => {
  try {
    return semver.rcompare(a, b);
  } catch (_) {
    return 0;
  }
};

const sortPages = (a, b) =>
  spaceship(a.menuWeight, b.menuWeight) ||
  semverCompare(a.id, b.id) ||
  spaceship(a.navigationTitle, b.navigationTitle) ||
  spaceship(a.title, b.title);

const createChild = (file, fileObj, id) => {
  // strip /index.md
  const path = "/" + file.split("/").slice(0, -1).join("/");
  const newChild = { id, path, children: [] };

  // Add front-matter
  Object.keys(fileObj).forEach((key) => {
    if (["stats", "mode", "contents"].includes(key)) return;
    newChild[key] = fileObj[key];
  });

  // Add excerpt
  if (!newChild.excerpt) {
    const html = md.render(fileObj.contents.toString("utf-8"));
    newChild.excerpt = $("p", html).first().text();
  }
  return newChild;
};

// all files are put through this. it will the walk upwards and then handle the
// ancestors until an already compiled page is found (we pass in the entry for "/", so
// there'll always be an ancestor)
function walk(file, files, path, possiblePaths, children = []) {
  const child = children.find((c, _i) => c.id === path[0]);
  const isNew = !child;
  // Build object
  if (isNew) {
    const newChild = createChild(file, files[file], path[0]);
    possiblePaths[newChild.path] = newChild;
    children.push(newChild);
    children.sort(sortPages);
  } else {
    // walk deeper
    if (child && path.length > 1) {
      child.children = walk(
        file,
        files,
        path.slice(1),
        possiblePaths,
        child.children
      );
    }
  }

  return children;
}

const findMeta = ({ children }, key, value) =>
  children
    .filter((c) =>
      c[key] && typeof value === "function"
        ? value(c[key])
        : c[key] === (value || c[key])
    )
    .concat(...children.map((c) => findMeta(c, key, value)));

module.exports = (files, metalsmith, done) => {
  setImmediate(done);
  const possiblePaths = {};
  function findByPath(pathArg, strict = true) {
    const pathToFind = `/${pathArg}`.replace(/\/$/, "").replace(/^\/\//, "/");
    if (!possiblePaths[pathToFind] && strict) {
      throw new Error(`Missing file in path: ${pathToFind}`);
    }
    return possiblePaths[pathToFind];
  }
  const findLongestExisting = (path) =>
    findByPath(path, false)
      ? path
      : findLongestExisting(path.replace(/\/[^/]+\/?$/, ""));

  const root = {
    id: "",
    title: "",
    path: "/",
    children: [],
    findByPath,
    findLongestExisting,
    checkIfPathExists: (potentialPath) => findByPath(potentialPath, false),
    find: (k, v) => findMeta(root, k, v).sort(sortPages),
  };

  Object.keys(files).forEach((file) => {
    if (extname(file) !== ".md") return;
    const path = file.split("/").slice(0, -1);
    const children = walk(file, files, path, possiblePaths, root.children);
    root.children = children;
  });
  metalsmith.metadata().hierarchy = root;
};
