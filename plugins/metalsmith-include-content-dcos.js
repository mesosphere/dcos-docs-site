const debug = require('debug')('metalsmith-include-content-dcos');
const pluginKit = require('metalsmith-plugin-kit');

/**
 * A Metalsmith plugin that allows content to be included (nested)
 * within other content by including the file path in the document.
 *
 * This is a rewritten version of the original metalsmith-include-content:
 * - Refrain from creating nested object in file.includes
 * - Throw when included path is missing
 * - Support filtering files to be processed via 'match'/'matchOptions'
 *
 * @return {Function}
 */
module.exports = function metalsmithIncludeContentDcos(givenOptions) {
  const options = pluginKit.defaultOptions({
    pattern: '^#include ([^ ]+)$',
    match: '**/*.md',
    matchOptions: {},
  }, givenOptions);

  const patternExp = new RegExp(options.pattern, 'gmi');

  const replaceCb = function replaceCb(filename, files, content) {
    // debug('Processing includes for %s...', filename);
    return content.replace(patternExp, (match, includePath) => {
      let path = includePath;
      // Trim any leading slash: /foo/bar/file.txt => foo/bar/file.txt
      if (includePath.startsWith('/')) {
        path = path.slice(1);
      }
      // Trim any whitespace, e.g. trailing newline from regex:
      path = path.trim();
      debug('Including %s in %s...', path, filename);
      if (!files[path]) {
        throw new Error(`Unable to find include file ${path} requested by ${filename}`);
      }
      // RECURSE: Handle nested includes, if any (intentionally ignores options.match)
      return replaceCb(path, files, files[path].contents.toString());
    });
  };

  return pluginKit.middleware({
    each: (filename, file, files, metalsmith) => {
      files[filename].contents = replaceCb(filename, files, file.contents.toString());
    },
    match: options.match,
    matchOptions: options.matchOptions,
    name: 'metalsmith-include-content-dcos',
  });
};
