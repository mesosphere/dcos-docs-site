const SwaggerUIBundle = require('./vendor/dist/swagger-ui-bundle.js');
const SwaggerUIStandalonePreset = require('./vendor/dist/swagger-ui-standalone-preset.js');

const swagDiv = document.getElementById('swagger-ui');

function build() { // Build a system
  const ui = SwaggerUIBundle({
    url: 'mesosphere.json',
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
    plugins: [SwaggerUIBundle.plugins.DownloadUrl],
    // layout: 'StandaloneLayout',
  });
  window.ui = ui;
}

if (swagDiv) {
  build();
}
