const SwaggerUIBundle = require('./vendor/swagger/swagger-ui-bundle.js');
const SwaggerUIStandalonePreset = require('./vendor/swagger/swagger-ui-standalone-preset.js');

let uis = document.querySelectorAll('.swagger-ui');
uis = [...uis];

if (uis.length) {
  uis.forEach((uiNode) => {
    SwaggerUIBundle({
      url: uiNode.dataset.api,
      domNode: uiNode,
      deepLinking: true,
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
      plugins: [SwaggerUIBundle.plugins.DownloadUrl],
      //layout: 'StandaloneLayout',
    });
  });
}