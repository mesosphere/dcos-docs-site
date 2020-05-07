const { resolve } = require("path");
const fs = require("fs");
const glob = require("glob");
const crypto = require("crypto");

const checksum = (str) =>
  crypto.createHash("md5").update(str, "utf8").digest("hex");

// attributes that are not used to generate a cache-hash. those are the attributes metalsmith sets on a `File` - the frontmatter in particular.
const attrsToIgnore = ["contents", "stats", "model", "filename"];
const hashMeta = (meta) =>
  checksum(
    Object.keys(meta)
      .filter((x) => !attrsToIgnore.includes(x))
      .sort() // somehow the order of keys in metalsmiths' Files changes.
      .map((key) => meta[key])
      .reduce((string, value = "") => value + string, "")
  );

const loadRevision = (configPath) => {
  const { contents = {}, meta = {}, layouts = {} } = fs.existsSync(configPath)
    ? JSON.parse(fs.readFileSync(configPath, "utf-8"))
    : {};
  return { contents, meta, layouts };
};

module.exports = function (files, metalsmith, done) {
  const configPath = resolve(metalsmith._directory, ".revision");

  const newHashes = { meta: {}, contents: {}, layouts: {} };
  const oldHashes = loadRevision(configPath);

  const unchangedFiles = [];
  let rebuildAll = false;
  Object.entries(files).forEach(([file, meta]) => {
    // only care about markdown files as those are slow to process
    if (!file.match(/.md$/)) return;

    // a hash out of the contents of this file. this changes, if we e.g. change some markdown.
    const currentContentsHash = checksum(meta.contents);
    // a hash to invalidate the whole cache in case we change the frontmatter. imagine you change the `navigationTitle` of a page - now we want ot rebuild everything, as all menus need to be updated accordingly.
    const currentMetaHash = hashMeta(meta);

    newHashes.contents[file] = currentContentsHash;
    newHashes.meta[file] = currentMetaHash;

    if (oldHashes.meta[file] !== currentMetaHash) {
      rebuildAll = true;
    }

    if (oldHashes.contents[file] === currentContentsHash) {
      unchangedFiles.push(file);
    }
  });
  glob.sync("./layouts/**/*.pug").map((file) => {
    const layoutHash = checksum(fs.readFileSync(file, "utf-8"));
    if (oldHashes.layouts[file] !== layoutHash) {
      rebuildAll = true;
    }
    newHashes.layouts[file] = layoutHash;
  });
  fs.writeFileSync(configPath, JSON.stringify(newHashes), "utf-8");

  if (!rebuildAll) {
    unchangedFiles.forEach((file) => {
      delete files[file];
    });
  }

  done();
};
