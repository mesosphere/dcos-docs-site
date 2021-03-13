const $ = require("cheerio");
const extname = require("path").extname;

module.exports = () => (files, metalsmith, done) => {
  setImmediate(done);
  Object.entries(files).forEach(([path, file]) => {
    if (".html" != extname(path)) return;
    file.headings = [];
    $("h1,h2", file.contents.toString("utf-8")).each((_, el) => {
      const $el = $(el);
      const text = $el.text().trim();
      const id = $el.attr("id") || text.replace(/\s+/g, "-").toLowerCase();
      file.headings.push({ id, tag: el.name, text });
    });
  });
};
