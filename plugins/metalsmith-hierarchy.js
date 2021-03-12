const { extname } = require("path");
const $ = require("cheerio");
const md = require("markdown-it")({ typographer: true, html: true });
const { sortPages } = require("../core/utils");

const createChild = (file, fileObj, id) => {
  // strip /index.md
  const path = "/" + file.split("/").slice(0, -1).join("/");
  fileObj.path = path;
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

function sortChildren(node) {
  node.children = node.children.sort(sortPages);
  node.children.forEach(sortChildren);
}

// all files are put through this. it will the walk upwards and then handle the
// ancestors until an already compiled page is found (we pass in the entry for "/", so
// there'll always be an ancestor)
function walk(file, files, path, paths, children = []) {
  if (path.length <= 1) {
    // Build object
    const newChild = createChild(file, files[file], path[0]);
    paths[newChild.path] = newChild;
    children = children.filter((c) => c.path != newChild.path);
    children.push(newChild);
  } else {
    // walk deeper
    const deeper = children.find((c, _i) => c.id === path[0]);
    deeper.children = walk(file, files, path.slice(1), paths, deeper.children);
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

const paths = {};
let root = null;
function findByPath(pathArg, strict = true) {
  const pathToFind = `/${pathArg}`.replace(/\/$/, "").replace(/^\/\//, "/");
  if (!paths[pathToFind] && strict)
    throw new Error(`Missing file in path: ${pathToFind}`);

  return paths[pathToFind];
}
const findLongestExisting = (path) =>
  findByPath(path, false)
    ? path
    : findLongestExisting(path.replace(/\/[^/]+\/?$/, ""));

module.exports = (files, metalsmith, done) => {
  setImmediate(done);
  root = root || {
    id: "",
    title: "",
    path: "/",
    children: [],
    findByPath,
    findLongestExisting,
    find: (k, v) => findMeta(root, k, v).sort(sortPages),
  };

  Object.keys(files).forEach((file) => {
    if (extname(file) !== ".md") return;
    const path = file.split("/").slice(0, -1);
    const children = walk(file, files, path, paths, root.children);
    root.children = children;
  });
  sortChildren(root);

  metalsmith.metadata().hierarchy = root;
};
