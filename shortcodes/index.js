const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const minify = require('html-minifier').minify;

/**
 * Shortcodes for metalsmith-shortcode-parser
 *
 */

/**
 * Removes any extra whitespace around html tags. Whitespace is a side
 * effect from using es6 template strings.
 * @param {string} html
 */
const sanitize = (html) => {
  //let h = html.replace(/ /g, " ").trim().replace(/^ +| +$/gm, "");
  return html.replace(/^ +| +$/gm, "");
};

const shortcodes = {

  /**
   * Message
   * @param {string} buf
   * @param {Object} opts
   * @param {boolean} opts.parse
   * @param {string} opts.header
   * @param {string} opts.body
   */
  'message': (buf, opts) => {

    // Format
    if(opts.parse == false) {
      return sanitize(`
        [Message header="${opts.header}" body="${opts.body}"]
      `);
    }

    // Output
    return sanitize(`
      <div class="message">
        <div class="message__header">${opts.header}</div>
        <div class="message__body">${opts.body}</div>
      </div>
    `);

  },

  /**
   * Swagger
   * @param {string} buf
   * @param {Object} opts
   * @param {string} opts.api
   */
  'swagger': (buf, opts) => {

    // Format
    if(opts.parse == false) {
      return sanitize(`
        [api-explorer api="${opts.api}"]
      `);
    }

    // Check if exists
    let configFilePath = path.join('./pages', opts.api);
    let configFileExists = fs.existsSync(configFilePath);

    if(!configFileExists) {
      console.error("Error: SwaggerUI config file %s does not exist", configFilePath);
      return '<h4>Error loading SwaggerUI</h4>';
    }

    let buildFileDir = opts.api.replace('.yaml', '');
    let buildFilePath = path.join('./build-swagger', buildFileDir, 'index.html');
    let buildFileExists = fs.existsSync(buildFilePath);

    if(!buildFileExists) {
      console.error("Error: SwaggerUI build file %s does not exist", buildFilePath);
      return '<h4>Error loading SwaggerUI</h4>';
    }

    // Read file
    let contents = fs.readFileSync(buildFilePath, { encoding: 'utf-8' });

    // Hide from headings
    var $ = cheerio.load(contents);
    $('h1, h2, h3').each(function() { $(this).attr('data-hide', true) });

    // Output
    return sanitize($.html());
    //return contents;

  },


  /**
   * Ngindox
   * @param {string} buf
   * @param {Object} opts
   * @param {string} opts.api
   */
  'ngindox': (buf, opts) => {

    // Format
    if(opts.parse == false) {
      return sanitize(`
        [api-explorer api="${opts.api}"]
      `);
    }

    // Check if exists
    let configFilePath = path.join('./pages', opts.api);
    let configFileExists = fs.existsSync(configFilePath);

    if(!configFileExists) {
      console.error("Error: Ngindox config file %s does not exist", configFilePath);
      return '<h4>Error loading Ngindox</h4>';
    }

    let buildFileDir = opts.api.replace('.yaml', '');
    let buildFilePath = path.join('./build-ngindox', buildFileDir, 'index.html');
    let buildFileExists = fs.existsSync(buildFilePath);

    if(!buildFileExists) {
      console.error("Error: Ngindox build file %s does not exist", buildFilePath);
      return '<h4>Error loading Ngindox</h4>';
    }

    // Read file
    let contents = fs.readFileSync(buildFilePath, { encoding: 'utf-8' });

    // Hide from headings
    var $ = cheerio.load(contents);
    $('h1, h2, h3').each(function() { $(this).attr('data-hide', true) });

    // Output
    return sanitize($.html());
    //return contents;

  },

};

module.exports = shortcodes;