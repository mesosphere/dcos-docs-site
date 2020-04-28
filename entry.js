require('./js/vendor/ngindox/ngindox.js');
require('./js/code-container.js');

require('./scss/style.scss');

require('./js/main.js');
require('./js/sidebar.js');
require('./js/sidebar-drawer.js');
require('./js/header.js');
require('./js/header-dropdown.js');
require('./js/search.js');
require('./js/actions.js');
require('./js/sections.js');
require('./js/switch.js');
require('./js/image.js');
require('./js/swagger-ui.js');
require('./js/toc-scroll.js');
require('./js/analytics.js');
require('./js/tooltip.js');
require('./js/tabs.js');
require('./js/ellipsis.js');
require('./js/msphere-menu.js');
require('./js/ksphere-menu.js');
require('./js/localization.js');
require('./js/services-landing.js');
if ( ENV === "development" ){
  var script = document.createElement('script');
  script.src = 'http://localhost:35729/livereload.js';
  document.getElementsByTagName('head')[0].appendChild(script);
}
