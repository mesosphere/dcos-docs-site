const debug = require('debug')('metalsmith-in-place-dcos');
const jstransformer = require('jstransformer');
const toTransformer = require('inputformat-to-jstransformer');
const pluginKit = require('metalsmith-plugin-kit');

/**
 * This copy of metalsmith-in-place has the following modifications to make it functional:
 * - Uses an 'engine' parameter in the file header, instead of checking filename extensions and
 *   hacking them off, which breaks things like site regen.
 * - Remove bad checks since switching to an 'engine' parameter makes them unneccessary:
 *   - utf8 check which produces false negatives.
 *   - 'I didn't have anything to do!' error which throws on site regen.
 */

/**
 * Gets jstransformer for an extension, and caches them
 */
const cache = {};

function getTransformer(name) {
    if (name in cache) {
        return cache[name];
    }

    const transformer = toTransformer(name);
    cache[name] = transformer ? jstransformer(transformer) : false;

    return cache[name];
}

/**
 * Plugin, the main plugin used by metalsmith
 */

module.exports = function(options) {
    options = pluginKit.defaultOptions({
        renderProperty: 'render',
        renderOptionsProperty: 'renderOptions',
        match: '**/*.md',
        matchOptions: {},
    }, options);

    return pluginKit.middleware({
        each: (filename, file, files, metalsmith) => {
            const transformerName = file[options.renderProperty]
            if (!transformerName) {
                // No render property defined, skip
                //debug('No render property "%s" in %s', options.renderProperty, filename);
                return;
            }
            debug('Rendering %s with transformer "%s"...', filename, transformerName);
            const transformer = getTransformer(transformerName);
            if (!transformer) {
                throw new Error('Unable to find transformer named ' + transformerName + ' as requested in ' + filename);
            }
            var renderOptions = file[options.renderOptions]
            if (!renderOptions) {
                renderOptions = {}
            }
            file.contents = Buffer.from(transformer.render(
                file.contents.toString(),
                renderOptions,
                Object.assign({}, metalsmith.metadata(), file)).body);
        },
        match: options.match,
        matchOptions: options.matchOptions,
        name: 'metalsmith-in-place-dcos',
    });
};
