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

const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};


const shortcodes = {

  /**
   * Message
   * @param {string} buf
   * @param {Object} opts
   * @param {string} opts.type
   * @param {boolean} opts.fill
   */
  'message': (buf, opts) => {
    let colorClass;
    let messageType = '';
    if(opts.fill == false && opts.type) {
      colorClass = `message--outline-${opts.type}`;
      messageType = `${capitalize(opts.type)}: `;
    }
    else if(opts.fill == false) {
      colorClass = `message--outline`;
    }
    else if(opts.type) {
      colorClass = `message--${opts.type}`;
      messageType = `${capitalize(opts.type)}: `;
    }
    return sanitize(`
      <div class="message ${colorClass}"><strong>${messageType}</strong>${buf}</div>
    `);
  },

  /**
   * Enterprise
   * @param {string} buf
   * @param {Object} opts
   */
  'enterprise': (buf, opts) => {
    return sanitize(`
      <p class="tag tag--shortcode tag--small tag--enterprise">Enterprise</p>
    `);
  },

  /**
   * OSS
   * @param {string} buf
   * @param {Object} opts
   */
  'oss': (buf, opts) => {
    return sanitize(`
      <p class="tag tag--shortcode tag--small tag--oss">OSS</p>
    `);
  },

  /**
   * Swagger
   * @param {string} buf
   * @param {Object} opts
   * @param {string} opts.api
   */
  'swagger': (buf, opts) => {

    // PDF env will use pre rendered SwaggerUI from build-swagger
    if(process.env.NODE_ENV === "pdf") {

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
      return sanitize(`<div class="swagger-ui-pdf">${$.html()}</div>`);
    }

    // Regular on-demand rendering of SwaggerUI
    else {

      // Output
      return sanitize(`<div class="swagger-ui" data-api="${opts.api}" ></div>`);

    }


  },


  /**
   * Ngindox
   * @param {string} buf
   * @param {Object} opts
   * @param {string} opts.api
   */
  'ngindox': (buf, opts) => {

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

    // PDF
    if(process.env.NODE_ENV === "pdf") {
      $('body').append(`
        <style>
          #ngindox .route-meta {
            display: block !important;
          }
          #ngindox .legend,
          #ngindox .options,
          #ngindox .arrow {
            display: none !important;
          }
        </style>
      `);
    }

    // Output
    return sanitize($.html());

  },

  /**
   * Image
   * @param {string} buf
   * @param {Object} opts
   */
  'image': (buf, opts) => {
    return sanitize(`
      <a href=${opts.src} target="_blank"><img src=${opts.src} alt=${opts.alt}></a>
    `);
  },

  /**
   * Tooltip
   * @param {string} buf
   * @param {Object} opts
   */
  'tooltip': (buf, opts) => {
    console.log(opts.content);
    return sanitize(`
      <a href="#" class="tooltip" data-tooltip=${opts.content}>${opts.element}</a>
    `);
  },

};

module.exports = shortcodes;
