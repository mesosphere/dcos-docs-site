const Mustache = require("mustache");

module.exports = (files, metalsmith, done) => {
  Object.entries(files).forEach(([filename, file]) => {
    if (!filename.match(/\.md$/) || file.render !== "mustache") return;

    const context = Object.assign({}, metalsmith.metadata(), file);
    const result = Mustache.render(file.contents.toString(), context);

    // TODO: multipass
    file.contents = Buffer.from(result);
  });
  done();
};
