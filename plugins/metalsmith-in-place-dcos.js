const debug = require("debug")("metalsmith-in-place-dcos");
const pluginKit = require("metalsmith-plugin-kit");
const Mustache = require("mustache");

/**
 * This copy of metalsmith-in-place has the following modifications to make it functional:
 * - Uses an 'engine' parameter in the file header, instead of checking filename extensions and
 *   hacking them off, which breaks things like site regen.
 * - Remove bad checks since switching to an 'engine' parameter makes them unneccessary:
 *   - utf8 check which produces false negatives.
 *   - 'I didn't have anything to do!' error which throws on site regen.
 */

/**
 * Plugin, the main plugin used by metalsmith
 */

module.exports = function metalsmithInPlaceDcos(opts) {
  const options = pluginKit.defaultOptions(
    { renderProperty: "render", match: "**/*.md" },
    opts
  );

  return pluginKit.middleware({
    each: (filename, file, files, metalsmith) => {
      const transformerName = file[options.renderProperty];
      if (!transformerName) return;
      if (transformerName !== "mustache")
        throw "Using a non-mustache transformer. This is not Intended!";

      debug('Rendering %s with transformer "%s"...', filename, transformerName);
      file.contents = Buffer.from(
        Mustache.render(
          file.contents.toString(),
          Object.assign({}, metalsmith.metadata(), file)
        )
      );
    },
    match: options.match,
    name: "metalsmith-in-place-dcos",
  });
};
