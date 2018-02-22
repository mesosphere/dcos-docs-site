'use strict';

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
module.exports = function (options) {
    options = pluginKit.defaultOptions({
        pattern: '^#include ([^ ]+)$',
        match: '**/*.md',
        matchOptions: {},
    }, options);

    const patternExp = new RegExp(options.pattern, 'gmi');

    const replaceCb = function(filename, files, content) {
        //debug('Processing includes for %s...', filename);
        return content.replace(patternExp, function(match, includePath) {
            // Trim any leading slash: /foo/bar/file.txt => foo/bar/file.txt
            if (includePath.startsWith('/')) {
                includePath = includePath.slice(1)
            }
            // Trim any whitespace, e.g. trailing newline from regex:
            includePath = includePath.trim()

            debug('Including %s in %s...', includePath, filename);
            if (!files[includePath]) {
                throw new Error('Unable to find include file ' + includePath + ' requested by ' + filename)
            }
            // RECURSE: Handle nested includes, if any (intentionally ignores options.match)
            return replaceCb(includePath, files, files[includePath].contents.toString());
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
