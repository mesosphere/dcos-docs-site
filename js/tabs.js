const $ = global.$;

/**
 * Returns a click handler that activates the respective tab button and tab
 * body. The `tabButtons` and `tabBodies` reference should point to an array
 * that contain the references to the buttons and bodies.
 *
 * @param {array} tabButtons - A list of the buttons in the tab group
 * @param {array} tabBodies - A list of the tab bodies in the tab group
 * @returns - Returns a function that can be used as a click handler
 */
function createTabClickController(tabButtons, tabBodies) {
  /**
   * @param {index} - The index of the button to activate
   * @param {event} - The click event argument
   */
  return (index, event) => {
    // If we have an ID, append it on hash, without jumping on that
    // hash, using the history service
    if (event) {
      event.preventDefault();
      event.stopPropagation();

      try {
        const buttonElm = $(event.target);
        window.history.pushState(null, null, buttonElm.attr('href'));
      } catch (e) {
        // Some browsers might not support history
      }
    }

    // Activate the selected tab
    tabButtons.forEach((button, idx) => {
      if (idx === index) {
        button.addClass('tabs__button__selected');
      } else {
        button.removeClass('tabs__button__selected');
      }
    });

    // Activate the selected body
    tabBodies.forEach((body, idx) => {
      if (idx === index) {
        body.show();
      } else {
        body.hide();
      }
    });
  };
}

/**
 * Converts the heading structure into tabs, by performing the following steps:
 */
function convertHeadingToTab(heading) {
  const isHeadingElement = /^h[0-9]$/i;
  const headingLevel = parseInt(heading[0].tagName.substr(-1), 10);

  const tabButtonContainer = $('<ul class="tabs__buttons"></ul>');
  const tabBodyContainer = $('<div class="tabs__body"></div>');
  let activeTabBody = null;

  const tabButtons = [];
  const tabBodies = [];
  const clickController = createTabClickController(tabButtons, tabBodies);

  // If the heading is empty, hide it
  if (heading.text().trim() === '') heading.hide();

  // Walk down the heading siblings and construct the tab interface
  let elm = $(heading);

  // eslint-disable-next-line
  while ((elm = elm.next()).length) {
    const tagName = elm[0].tagName;

    //
    // When we encounter a heading element we have three options:
    //
    if (tagName.match(isHeadingElement)) {
      const level = parseInt(tagName.substr(-1), 10);

      // 1. If the heading is the same or smaller than the `headingLevel`, we
      //    should complete the tab conversion because we ran out of the scope.
      if (level <= headingLevel) break;

      // 2. If the heading is exactly one level deeper, we should start a new
      //    tab capturing group.
      if (level === headingLevel + 1) {
        // If this is the first tab, we should inject here the bodies
        if (activeTabBody == null) {
          tabButtonContainer.insertBefore(elm);
          tabBodyContainer.insertBefore(elm);
        }

        // Create a tab button and link it on the click controller
        const tabId = elm.attr('id');
        const tabTitle = elm.text();
        const tabIndex = tabButtons.length;
        const tabButton = $(
          `<li class="tabs__button"><a href="#${tabId}">${tabTitle}</a></li>`,
        );
        tabButton.click(clickController.bind(tabButton, tabIndex));
        tabButton.appendTo(tabButtonContainer);
        tabButtons.push(tabButton);

        // Create and activate a new tab body
        activeTabBody = $('<div class="tabs__body__tab"></div>');
        activeTabBody.appendTo(tabBodyContainer);
        tabBodies.push(activeTabBody);

        // Hide the heading (we keep the element in the DOM just in case
        // this header acts as an anchor)
        elm.hide();

        // eslint-disable-next-line
        continue;
      }

      // 3. If the heading is more than one level deeper, it should be accounted
      //    as a regular occurrence, and should be put into the active tab group.
    }

    // Every other encounter should be appended on the active tab body
    if (activeTabBody != null) {
      const popElm = elm;
      elm = elm.prev();
      popElm.appendTo(activeTabBody);
    }
  }

  // If we followed a permalink to the specific tab, then the hash should contain
  // the ID of the tab. Use this information to activate the correct tab.
  clickController(
    Math.max(
      0,
      tabButtons.findIndex(
        tabElm => tabElm.attr('href') === window.location.hash,
      ),
    ),
  );
}

// Convert all headings with tabs at load time
$('h1.tabs, h2.tabs, h3.tabs, h4.tabs').each((idx, elm) => {
  convertHeadingToTab($(elm));
});
