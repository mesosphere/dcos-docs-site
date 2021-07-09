const $ = require("cheerio");
const md = require("markdown-it")({ typographer: true, html: true });
const { sortPages } = require("../core/utils");

const withMenus = [];
const paths = {};

const stripLast = (file) => file.replace(/\/[^/]+\/?$/, "");
const findLongestExisting = (path, fallback) => {
  if (fallback && path.length < fallback.length) return fallback;
  return paths[path] ? path : findLongestExisting(stripLast(path));
};

// We added the `.default` because CI broke after a node docker image update
// We are not sure what the actual reason is 100%, but it fixes the red CI
const firstParagraph = (file) =>
  $.default("p", md.render(file.contents.toString("utf-8"))).first();

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
      shortDesc: file.excerpt || firstParagraph(file).text(),
    });

    file.parent = files[filePath.replace(/[^/]+\/index.md$/, "index.md")];
    if (!file.parent) return;

    // subtree-prop inheritance
    file.subtree = Object.assign({}, file.parent.subtree, file.subtree);
    Object.assign(file, file.subtree);

    if (file.draft && process.env.NODE_ENV == "production") return;

    paths[file.path] = file;
    if (file.menus) withMenus.push(file);
    file.parent.children.push(file);
    file.parent.children.sort(sortPages);
  });

  Object.entries(files).forEach(([filePath, file]) => {
    if (file.draft && process.env.NODE_ENV == "production")
      delete files[filePath];
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
