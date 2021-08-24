const { sortPages } = require("../core/utils");

const withMenus = [];
const paths = {};

const stripLast = (file) => file.replace(/\/[^/]+\/?$/, "");
const findLongestExisting = (path, fallback) => {
  if (fallback && path.length < fallback.length) return fallback;
  return paths[path] ? path : findLongestExisting(stripLast(path));
};

const firstParagraph = (file) => {
  const contents = file.contents
    .toString("utf-8")
    .split(/\r?\n/g)
    .filter((n) => n);

  return contents[0] || "";
};

/**
 * Controls wether a file should be build based on environment variables and file annotations
 */
const shouldExcludeFile = (file) => {
  if (
    process.env.NODE_ENV === "production" &&
    (file.beta || file.draft || file.archive)
  ) {
    return true;
  }

  if (process.env.NODE_ENV === "beta" && (file.draft || file.archive)) {
    return true;
  }

  if (process.env.NODE_ENV === "archive" && (file.draft || file.beta)) {
    return true;
  }
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
    if (!filePath.endsWith(".md")) return;

    Object.assign(file, {
      children: [],
      id: filePath.split("/").slice(-2)[0],
      path: "/" + filePath.replace(/index.md$/, "").replace(/\/$/, ""),
      shortDesc: file.excerpt || firstParagraph(file),
    });

    file.parent = files[filePath.replace(/[^/]+\/index.md$/, "index.md")];
    if (!file.parent) return;

    // subtree-prop inheritance
    file.subtree = Object.assign({}, file.parent.subtree, file.subtree);
    Object.assign(file, file.subtree);

    if (shouldExcludeFile(file)) {
      return;
    }

    paths[file.path] = file;
    if (file.menus) withMenus.push(file);
    file.parent.children.push(file);
    file.parent.children.sort(sortPages);
  });

  Object.entries(files).forEach(([filePath, file]) => {
    if (shouldExcludeFile(file)) {
      delete files[filePath];
    }
  });

  metalsmith.metadata().hierarchy = {
    findByPath(pathToFind) {
      if (!paths[pathToFind]) throw new Error(`Missing file: ${pathToFind}`);
      return paths[pathToFind];
    },
    findLongestExisting,
    findMenus: (v) => withMenus.filter((c) => v(c.menus)).sort(sortPages),
  };
};
