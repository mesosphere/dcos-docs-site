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
      <span class="badge badge--shortcode badge--${size} badge--${type} badge--enterprise">Enterprise</span>
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
      <span class="badge badge--shortcode badge--${size} badge--${type} badge--oss">OSS</span>
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
    // If filter is enterprise or oss, will style as pill from badge shortcode
    // Any other text will default to oss badge styling
    let badge = 'badge--' + opts.filter.toLowerCase();
    return sanitize(`
      <div class="switch__case-print-badge">
        <p class="badge badge--shortcode badge--small ${badge}">${opts.filter}</p>
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

    const swaggerSVGs = `
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="position:absolute;width:0;height:0">
        <defs>
          <symbol viewBox="0 0 20 20" id="large-arrow">
            <path d="M13.25 10L6.109 2.58c-.268-.27-.268-.707 0-.979.268-.27.701-.27.969 0l7.83 7.908c.268.271.268.709 0 .979l-7.83 7.908c-.268.271-.701.27-.969 0-.268-.269-.268-.707 0-.979L13.25 10z"/>
          </symbol>
          <symbol viewBox="0 0 20 20" id="large-arrow-down">
            <path d="M17.418 6.109c.272-.268.709-.268.979 0s.271.701 0 .969l-7.908 7.83c-.27.268-.707.268-.979 0l-7.908-7.83c-.27-.268-.27-.701 0-.969.271-.268.709-.268.979 0L10 13.25l7.418-7.141z"/>
          </symbol>
        </defs>
      </svg>
    `;

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
      return sanitize(`${swaggerSVGs}<div class="swagger-ui-pdf">${$.html()}</div>`);
    }

    // Regular on-demand rendering of SwaggerUI
    else {

      // Output
      return sanitize(`${swaggerSVGs}<div class="swagger-ui" data-api="${opts.api}" ></div>`);

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
