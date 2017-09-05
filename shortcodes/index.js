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
  return html.replace(/\s+/g, " ").trim();
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
   * API Explorer
   * @param {string} buf
   * @param {Object} opts
   * @param {string} opts.api
   */
  'api-explorer': (buf, opts) => {

    // Format
    if(opts.parse == false) {
      return sanitize(`
        [api-explorer api="${opts.api}"]
      `);
    }

    // Output
    return sanitize(`
      <div class="swagger-ui" data-api="${opts.api}"></div>
    `);

  },

};

module.exports = shortcodes;