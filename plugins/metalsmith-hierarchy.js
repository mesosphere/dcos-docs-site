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

const firstParagraph = (file) =>
  $("p", md.render(file.contents.toString("utf-8"))).first();

module.exports = (files, metalsmith, done) => {
  setImmediate(done);

  Object.entries(files).forEach(([filePath, file]) => {
    if (!filePath.endsWith(".md")) return;

    Object.assign(file, {
      children: [],
      excerpt: file.excerpt,
      id: filePath.split("/").slice(-2)[0],
      path: "/" + filePath.replace(/index.md$/, "").replace(/\/$/, ""),
      shortDesc: file.excerpt || firstParagraph(file).text(),
    });

    file.parent = files[filePath.replace(/[^/]+\/index.md$/, "index.md")];
    if (!file.parent) return;
    paths[file.path] = file;
    if (file.menus) withMenus.push(file);
    file.parent.children.push(file);
    file.parent.children.sort(sortPages);
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
