const { decode } = require("html-entities");
const hs = /<(h[12])([^]*?)>([\s\S]*?)<\/h[12]>/g;

module.exports = () => (files, metalsmith, done) => {
  setImmediate(done);
  Object.entries(files).forEach(([path, file]) => {
    if (!path.endsWith(".html")) return;

    const headings = Array.from(file.contents.toString("utf-8").matchAll(hs));
    file.headings = headings.map(([_, tag, attrs, inner]) => {
      const text = decode(inner.replace(/(<([^>]+)>)/gi, "")).trim();
      const id = (attrs.match(/id="([^]*?)"/) || [])[1];
      return { id: id || text.replace(/\s+/g, "-").toLowerCase(), tag, text };
    });
  });
};
