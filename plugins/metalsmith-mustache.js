const Handlebars = require("handlebars");

module.exports = (files, metalsmith, done) => {
  Object.entries(files).forEach(([filename, file]) => {
    if (!filename.endsWith(".md")) return;

    try {
      const old = file.contents.toString();
      const template = Handlebars.compile(old);

      const context = Object.assign({}, metalsmith.metadata(), file);
      const result = template(context);

      // TODO: multipass
      file.contents = Buffer.from(result);
    } catch (e) {
      console.warn(`[WARN] error compiling handlebars for "${filename}"`);
    }
  });
  done();
};
