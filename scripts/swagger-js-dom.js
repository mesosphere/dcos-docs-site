const swagDiv = document.getElementById('swagger-ui');
if (swagDiv) {
  const ui = SwaggerUIBundle({
    spec: window.spec,
    domNode: swagDiv,
    deepLinking: true,
    presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
    plugins: [SwaggerUIBundle.plugins.DownloadUrl],
  });
  window.ui = ui;
  setTimeout(() => window.onModulesLoaded(), 3000);
}