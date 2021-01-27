require("./vendor/ngindox/ngindox.js");
require("./code-container.js");

require("../scss/style.scss");

require("./main.js");
require("./sidebar.js");
require("./filters.js");
require("./sidebar-drawer.js");
require("./header.js");
require("./header-dropdown.js");
require("./search.js");
require("./sections.js");
require("./switch.js");
require("./image.js");
require("./toc-scroll.js");
require("./analytics.js");
require("./tabs.js");
require("./ellipsis.js");
require("./msphere-menu.js");
require("./ksphere-menu.js");
require("./localization.js");
require("./services-landing.js");

// Initialize feather icon replacements
if (typeof feather !== "undefined") {
  feather.replace();
}

var links = document.links;

for (var i = 0, linksLength = links.length; i < linksLength; i++) {
  if (links[i].hostname != window.location.hostname) {
    links[i].target = "_blank";
  }
}
