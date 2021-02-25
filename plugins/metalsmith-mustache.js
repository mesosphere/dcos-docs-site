const Handlebars = require("handlebars");

module.exports = (files, metalsmith, done) => {
  Object.entries(files).forEach(([filename, file]) => {
    if (!filename.match(/\.md$/) || file.render !== "mustache") return;

    const old = file.contents.toString();
    const template = Handlebars.compile(old);

    const context = Object.assign({}, metalsmith.metadata(), file);
    const result = template(context);

    // TODO: multipass
    file.contents = Buffer.from(result);
  });
  done();
};
