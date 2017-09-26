const SwaggerUIBundle = require('./vendor/swagger/swagger-ui-bundle.js');
const SwaggerUIStandalonePreset = require('./vendor/swagger/swagger-ui-standalone-preset.js');

let swagDivs = document.querySelectorAll('.swagger-ui');
swagDivs = [...swagDivs];

swagDivs.forEach((swagDiv) => {
  SwaggerUIBundle({
    url: swagDiv.dataset.api,
    domNode: swagDiv,
    deepLinking: true,
    presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
    plugins: [SwaggerUIBundle.plugins.DownloadUrl],
  });
});
