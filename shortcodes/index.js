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
  // return html.replace(/(^\s+|\s+$)/g, '');
};


/**
 * Capitalize for message label (warning, error, etc)
 */
const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const shortcodes = {

  /**
   * Icons
   * @param {string} buf
   * @param {Object} opts
   */
  'icon': (buf, opts) => {
    return sanitize(`
      <i class="icon" data-feather="${opts.glyph}"></i>
    `)
  },

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
   * @param {string} opts.size
   * @param {string} opts.type
   */
  'enterprise': (buf, opts) => {
    let size = opts.size;
    let type = opts.type;
    if (!opts.size) {
      size = 'large';
    }
    if (!opts.type) {
      type = 'block';
    }
    return sanitize(`
      <p class="tag tag--shortcode tag--${size} tag--${type} tag--enterprise">Enterprise</p>
    `);
  },

  /**
   * OSS
   * @param {string} buf
   * @param {Object} opts
   * @param {string} opts.size
   * @param {string} opts.type
   */
  'oss': (buf, opts) => {
    let size = opts.size;
    let type = opts.type;
    if (!opts.size) {
      size = 'large';
    }
    if (!opts.type) {
      type = 'block';
    }
    return sanitize(`
      <p class="tag tag--shortcode tag--${size} tag--${type} tag--oss">OSS</p>
    `);
  },

  /**
   * Switch
   * @param {string} buf
   * @param {Object} opts
   */
  'switch': (buf, opts) => {
    return sanitize(`
      <div class="switch">
        <div class="switch__filters">
        </div>
        <div class="switch__cases">
          ${buf}
        </div>
      </div>
    `);
  },

  /**
   * Case
   * @param {string} buf
   * @param {Object} opts
   * @param {Object} opts.filter
   */
  'case': (buf, opts) => {
    // If filter is enterprise or oss, will style as pill from tag shortcode
    // Any other text will default to oss tag styling
    let tag = 'tag--' + opts.filter.toLowerCase();
    return sanitize(`
      <div class="switch__case-print-tag">
        <p class="tag tag--shortcode tag--small ${tag}">${opts.filter}</p>
      </div>
      <div class="switch__case" data-filter="${opts.filter}">${buf}</div>
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
   * @param {string} opts.src
   * @param {string} opts.srcset
   * @param {string} opts.sizes
   * @param {string} opts.alt
   * @param {string} opts.type
   */
  'image': (buf, opts) => {
    if (opts.srcset && opts.sizes) {
      return sanitize(`
      <div class="img__wrapper img__wrapper--${opts.type}"><a href=${opts.src} target="_blank"><img srcset=${opts.srcset} sizes=${opts.sizes} src=${opts.src} alt=${opts.alt} class="img--${opts.type}"></a><p class="img__caption img__caption--${opts.type}">${opts.caption}</p></div>
    `)
    }
    return sanitize(`
    <div class="img__wrapper img__wrapper--${opts.type}"><a href=${opts.src} target="_blank"><img src=${opts.src} alt=${opts.alt} class="img--${opts.type}"></a><p class="img__caption img__caption--${opts.type}">${opts.caption}</p></div>
    `);
  },

  /**
   * Tooltip
   * @param {string} buf
   * @param {Object} opts
   * @param {string} opts.content
   */
  'tooltip': (buf, opts) => {
    return sanitize(`
      <span class="tooltip" data-tooltip="${opts.content}">${buf}</span>
    `);
  },

  /**
   * Button
   * @param {string} buf
   * @param {Object} opts
   * @param {string} opts.type
   * @param {string} opts.size
   * @param {string} opts.color
   */
  'button': (buf, opts) => {
    if(!opts.color) {
      opts.color = 'purple';
    }
    if(!opts.type) {
      opts.type = 'large';
    }
    let classes = `btn--${opts.color} btn--${opts.size}`;
    return sanitize(`
      <button type=${opts.type} class="btn ${classes}">${buf.toUpperCase()}</button>
    `);
  },

};

module.exports = shortcodes;
