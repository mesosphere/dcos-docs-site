//
// Shortcode Parser
//
// TEMP: Awaiting pull request for bug fix Blake submitted. Original plugin was
// corrupting all images.
//
// Will be using npm package once PR is merged.
// https://github.com/csmets/metalsmith-shortcode-parser
//

const parser = require('shortcode-parser');
const path = require('path');

function plugin(opts) {
  const wrapper= opts => (files, metalsmith, done) => {
    setImmediate(done);
    const shortcodeOpts = opts || {};
    if (shortcodeOpts.shortcodes !== undefined) {
      Object.keys(shortcodeOpts.shortcodes).forEach((shortcode) => {
        parser.add(shortcode, shortcodeOpts.shortcodes[shortcode]);
      });
    } else {
      console.log('No Shortcodes given');
    }
    Object.keys(files).forEach((file) => {
      let ext = path.extname(file);
      if(!shortcodeOpts.files || (shortcodeOpts.files && shortcodeOpts.files.indexOf(ext) != -1)) {
        try {
          const out = parser.parse(files[file].contents.toString('utf8'));
          files[file].contents = Buffer.from(out, 'utf8');
        }
        catch(err) {
          throw err + ` File: ${file}`;
        }
      }
    });
  };
  return wrapper(opts);
}

module.exports = plugin;