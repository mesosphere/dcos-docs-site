const Handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

Handlebars.registerHelper("include", (p, { data }) =>
  Handlebars.compile(
    fs.readFileSync(path.join(__dirname, "..", "pages", p)).toString()
  )(Object.assign({}, data.root))
);

module.exports = (files, metalsmith, done) => {
  Object.entries(files).forEach(([filename, file]) => {
    if (!filename.endsWith(".md")) return;

    try {
      const context = Object.assign({}, metalsmith.metadata(), file);
      file.contents = Handlebars.compile(file.contents.toString())(context);
    } catch (e) {
      if (!filename.includes("mesosphere/")) {
        throw `[ERR] error compiling handlebars for "${filename}". Likely you added a code snippet with curly braces "{{ }}". The docs are using those for handlebars-templating. You might want to put a backslash before the opening curlies in case you're not trying to use a snippet/template. \n\n ${e.toString()}`;
      }
    }
  });
  done();
};
