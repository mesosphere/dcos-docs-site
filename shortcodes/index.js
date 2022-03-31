const fs = require("fs");
const NgindoxUi = require("ngindox/lib/ui");
const Yaml = require("js-yaml");

///////////////////////////////////////////////////////////////////////////////
//                                  HELPERS                                  //
///////////////////////////////////////////////////////////////////////////////
const badge =
  (style, label) =>
  (buf, { size = "large", type = "block" }) =>
    buf
      ? `${buf} <span class="badge badge--shortcode badge--${size} badge--${type} badge--${style}">${label}</span>`
      : `<span class="badge__container badge__container--${type}"><span class="badge badge--shortcode badge--${size} badge--${type} badge--${style}">${label}</span></span>`;

const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const swaggerSVGs = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="position:absolute;width:0;height:0"><defs><symbol viewBox="0 0 20 20" id="large-arrow"><path d="M13.25 10L6.109 2.58c-.268-.27-.268-.707 0-.979.268-.27.701-.27.969 0l7.83 7.908c.268.271.268.709 0 .979l-7.83 7.908c-.268.271-.701.27-.969 0-.268-.269-.268-.707 0-.979L13.25 10z"/></symbol><symbol viewBox="0 0 20 20" id="large-arrow-down"><path d="M17.418 6.109c.272-.268.709-.268.979 0s.271.701 0 .969l-7.908 7.83c-.27.268-.707.268-.979 0l-7.908-7.83c-.27-.268-.27-.701 0-.969.271-.268.709-.268.979 0L10 13.25l7.418-7.141z"/></symbol></defs></svg>`;

/**
 * Shortcodes for metalsmith-shortcode-parser
 */
const shortcodes = {
  // badges
  beta: badge("beta", "Beta"),
  community: badge("community", "Community"),
  enterprise: badge("enterprise", "Enterprise"),
  experimental: badge("experimental", "Experimental"),
  oss: badge("oss", "Open Source"),
  preview: badge("preview", "Preview"),
  techPreview: badge("techPreview", "Tech Preview"),

  button: (buf, { href, color = "purple" }) => {
    const btn = `<button type="button" class="btn btn--${color} btn--large">${buf.toUpperCase()}</button>`;
    return href ? `<a href="${href}" target="_blank">${btn}</a>` : btn;
  },

  message: (buf, { type, label = `<strong>${capitalize(type)}: </strong>` }) =>
    `<span class="message message--${type}">${label}${buf}</span>`,

  ngindox: (buf, { api }) =>
    NgindoxUi.toHtml(Yaml.safeLoad(fs.readFileSync(`./pages${api}`)), {
      title: "Routes",
      legend: true,
    }).replace(/^ +| +$/gm, ""),

  swagger: (buf, { api }) =>
    `${swaggerSVGs}<div class="swagger-ui" data-api="${api}"></div><script src="/js/swagger.js"></script>`,
};

module.exports = shortcodes;
