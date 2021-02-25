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
      if (!filename.includes("mesosphere/")) {
        throw `[ERR] error compiling handlebars for "${filename}". Likely you added a code snippet with curly braces "{{ }}". The docs are using those for handlebars-templating. You might want to put a backslash before the opening curlies.`;
      }
    }
  });
  done();
};
