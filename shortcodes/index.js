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
const sanitize = html => html.replace(/^ +| +$/gm, '');

/**
 * Capitalize for message label (warning, error, etc)
 */
const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

const shortcodes = {

  /**
   * Icons
   * @param {string} buf
   * @param {Object} opts
   */
  icon: (buf, opts) => sanitize(`
      <i class="icon" data-feather="${opts.glyph}"></i>
    `),

  /**
   * Message
   * @param {string} buf
   * @param {Object} opts
   * @param {string} opts.type
   * @param {boolean} opts.fill
   */
  message: (buf, opts) => {
    let colorClass;
    let messageType = '';
    if (opts.fill === false && opts.type) {
      colorClass = `message--outline-${opts.type}`;
      messageType = `${capitalize(opts.type)}: `;
    } else if (opts.fill === false) {
      colorClass = 'message--outline';
    } else if (opts.type) {
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
  enterprise: (buf, opts) => {
    let size = opts.size;
    let type = opts.type;
    if (!opts.size) {
      size = 'large';
    }
    if (!opts.type) {
      type = 'block';
    } else if (opts.type === 'inline' || opts.type === 'inline-block') {
      type = 'inline';
    }
    if (buf) {
      return sanitize(`${buf} <span class="badge badge--shortcode badge--${size} badge--${type} badge--enterprise">Enterprise</span>`);
    }
    return sanitize(`<span class="badge__container badge__container--${type}"><span class="badge badge--shortcode badge--${size} badge--${type} badge--enterprise">Enterprise</span></span>`);
  },

  /**
   * OSS
   * @param {string} buf
   * @param {Object} opts
   * @param {string} opts.size
   * @param {string} opts.type
   */
  oss: (buf, opts) => {
    let size = opts.size;
    let type = opts.type;
    if (!opts.size) {
      size = 'large';
    }
    if (!opts.type) {
      type = 'block';
    } else if (opts.type === 'inline' || opts.type === 'inline-block') {
      type = 'inline';
    }
    if (buf) {
      return sanitize(`${buf} <span class="badge badge--shortcode badge--${size} badge--${type} badge--oss">Open Source</span>`);
    }
    return sanitize(`<span class="badge__container badge__container--${type}"><span class="badge badge--shortcode badge--${size} badge--${type} badge--oss">Open Source</span></span>`);
  },


  /**
   * Beta
   * @param {string} buf
   * @param {Object} opts
   * @param {string} opts.size
   * @param {string} opts.type
   */
  beta: (buf, opts) => {
    let size = opts.size;
    let type = opts.type;
    if (!opts.size) {
      size = 'large';
    }
    if (!opts.type) {
      type = 'block';
    } else if (opts.type === 'inline' || opts.type === 'inline-block') {
      type = 'inline';
    }
    if (buf) {
      return sanitize(`${buf} <span class="badge badge--shortcode badge--${size} badge--${type} badge--beta">Beta</span>`);
    }
    return sanitize(`<span class="badge__container badge__container--${type}"><span class="badge badge--shortcode badge--${size} badge--${type} badge--beta">Beta</span></span>`);
  },
  /**
   * Switch
   * @param {string} buf
   * @param {Object} opts
   */
  switch: (buf, _opts) => sanitize(`
      <div class="switch">
        <div class="switch__filters">
        </div>
        <div class="switch__cases">
          ${buf}
        </div>
      </div>
    `),

  /**
   * Preview
   * @param {string} buf
   * @param {Object} opts
   * @param {string} opts.size
   * @param {string} opts.type
   */
  preview: (buf, opts) => {
    let size = opts.size;
    let type = opts.type;
    if (!opts.size) {
      size = 'large';
    }
    if (!opts.type) {
      type = 'block';
    } else if (opts.type === 'inline' || opts.type === 'inline-block') {
      type = 'inline';
    }
    if (buf) {
      return sanitize(`${buf} <span class="badge badge--shortcode badge--${size} badge--${type} badge--preview">Preview</span>`);
    }
    return sanitize(`<span class="badge__container badge__container--${type}"><span class="badge badge--shortcode badge--${size} badge--${type} badge--preview">Preview</span></span>`);
  },

  /**
   * Experimental
   * @param {string} buf
   * @param {Object} opts
   * @param {string} opts.size
   * @param {string} opts.type
   */
  experimental: (buf, opts) => {
    let size = opts.size;
    let type = opts.type;
    if (!opts.size) {
      size = 'large';
    }
    if (!opts.type) {
      type = 'block';
    } else if (opts.type === 'inline' || opts.type === 'inline-block') {
      type = 'inline';
    }
    if (buf) {
      return sanitize(`${buf} <span class="badge badge--shortcode badge--${size} badge--${type} badge--experimental">Experimental</span>`);
    }
    return sanitize(`<span class="badge__container badge__container--${type}"><span class="badge badge--shortcode badge--${size} badge--${type} badge--experimental">Experimental</span></span>`);
  },

  /**
   * Case
   * @param {string} buf
   * @param {Object} opts
   * @param {Object} opts.filter
   */
  case: (buf, opts) => {
    // If filter is enterprise or oss, will style as pill from badge shortcode
    // Any other text will default to oss badge styling
    const badge = `badge--${opts.filter.toLowerCase()}`;
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
  swagger: (buf, opts) => {
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
    if (process.env.NODE_ENV === 'pdf') {
      // Check if exists
      const configFilePath = path.join('./pages', opts.api);
      const configFileExists = fs.existsSync(configFilePath);

      if (!configFileExists) {
        throw new Error(`SwaggerUI config file does not exist ${configFilePath}`);
      }

      const buildFileDir = opts.api.replace('.yaml', '');
      const buildFilePath = path.join('./build-swagger', buildFileDir, 'index.html');
      const buildFileExists = fs.existsSync(buildFilePath);

      if (!buildFileExists) {
        throw new Error(`SwaggerUI build file does not exist ${buildFilePath}`);
      }

      // Read file
      const contents = fs.readFileSync(buildFilePath, { encoding: 'utf-8' });

      // Hide from headings
      const $ = cheerio.load(contents);
      $('h1, h2, h3').each(el => $(el).attr('data-hide', true));

      // Output
      return sanitize(`${swaggerSVGs}<div class="swagger-ui-pdf">${$.html()}</div>`);
    }
    // Else, regular on-demand rendering of SwaggerUI
    // Output
    return sanitize(`${swaggerSVGs}<div class="swagger-ui" data-api="${opts.api}" ></div>`);
  },

  /**
   * Ngindox
   * @param {string} buf
   * @param {Object} opts
   * @param {string} opts.api
   */
  ngindox: (buf, opts) => {
    // Check if exists
    const configFilePath = path.join('./pages', opts.api);
    const configFileExists = fs.existsSync(configFilePath);

    if (!configFileExists) {
      throw new Error(`Ngindox config file does not exist ${configFilePath}`);
    }

    const buildFileDir = opts.api.replace('.yaml', '');
    const buildFilePath = path.join('./build-ngindox', buildFileDir, 'index.html');
    const buildFileExists = fs.existsSync(buildFilePath);

    if (!buildFileExists) {
      throw new Error(`Ngindox build file does not exist ${buildFilePath}`);
    }

    // Read file
    const contents = fs.readFileSync(buildFilePath, { encoding: 'utf-8' });

    // Hide from headings
    const $ = cheerio.load(contents);
    $('h1, h2, h3').each(el => $(el).attr('data-hide', true));

    // PDF
    if (process.env.NODE_ENV === 'pdf') {
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
  image: (buf, opts) => {
    if (opts.srcset && opts.sizes) {
      return sanitize(`
        <div class="img__wrapper img__wrapper--${opts.type}"><a href=${opts.src} target="_blank"><img srcset=${opts.srcset} sizes=${opts.sizes} src=${opts.src} alt=${opts.alt} class="img--${opts.type}"></a><p class="img__caption img__caption--${opts.type}">${opts.caption}</p></div>
      `);
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
  tooltip: (buf, opts) => sanitize(`
      <span class="tooltip" data-tooltip data-content="${opts.content}">${buf}</span>
    `),

  /**
   * Button
   * @param {string} buf
   * @param {Object} opts
   * @param {string} opts.type
   * @param {string} opts.size
   * @param {string} opts.color
   * @param {string} opts.href
   */
  button: (buf, givenOpts) => {
    const opts = Object.assign({}, givenOpts);
    if (!opts.color) {
      opts.color = 'purple';
    }
    if (!opts.size) {
      opts.size = 'large';
    }
    if (!opts.type) {
      opts.type = 'button';
    }
    const classes = `btn--${opts.color} btn--${opts.size}`;
    if (opts.href) {
      return sanitize(`
      <a href="${opts.href}" target="_blank"><button type=${opts.type} class="btn ${classes}">${buf.toUpperCase()}</button></a>
    `);
    }

    return sanitize(`
      <button type=${opts.type} class="btn ${classes}">${buf.toUpperCase()}</button>
    `);
  },
};

module.exports = shortcodes;
