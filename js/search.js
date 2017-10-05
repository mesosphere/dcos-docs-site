const searchForm = document.querySelector('#search-form');

if (searchForm) {
  /**
   * Algolia Search Page Config
   */
  const search = instantsearch({
    appId: 'O1RKPTZXK1',
    apiKey: '4cc78f4d67f726ba3b2c5bd1ed690fb4',
    indexName: 'dev_MESOSPHERE',
  });

  /** 
   * Search result templates
   */
  const hitTemplate = `
    <li class="search__results-item">
      <h4 class="search__title">
        <a href="/{{path}}" class="search__link">{{{_highlightResult.title.value}}}</a>
      </h4>
      <p class="search__description">{{{_snippetResult.contents.value}}}</p>
      <div class="search__meta">
        <span class="search__meta-version">{{version}}</span>
        <a href="/{{path}}" class="search__meta-source">{{truncatedPath}}</a>
      </div>
    </li>
  `;

  const noResultsTemplate = '<div class="text-center">No results found matching <strong>{{query}}</strong>.</div>';

  // connect `renderFn` to <select> menu logic
  const selectMenu = instantsearch.connectors.connectMenu(renderFn);

  // Render search input widget
  search.addWidget(
    instantsearch.widgets.searchBox({
      container: '#search-input',
      placeholder: 'Search',
      autofocus: true,
      magnifier: false,
      reset: false,
      wrapInput: false,
      queryHook: debounce(function(inputValue, search) {
        search(inputValue);
      }, 500),
    }),
  );

  // Render search results
  search.addWidget(
    instantsearch.widgets.hits({
      container: '#search-results',
      hitsPerPage: 12,
      templates: {
        empty: noResultsTemplate,
        item: hitTemplate,
      },
      transformData: (hit) => {
        const transformedHit = Object.assign({}, hit, {
          truncatedPath: truncateUrl(hit.path),
        });
        return transformedHit;
      },
    }),
  );

  // Render search section menu
  search.addWidget(
    selectMenu({
      containerNode: '#search-section',
      attributeName: 'section',
      title: 'Section',
    }),
  );

  // Render search version menu
  search.addWidget(
    selectMenu({
      containerNode: '#search-version',
      attributeName: 'version',
      title: 'Version',
      limit: 10,
    }),
  );

  // Render pagination
  search.addWidget(
    instantsearch.widgets.pagination({
      container: '#search-pagination',
      cssClasses: {
        root: 'search__pagination',
        item: 'search__pagination__item',
        active: 'search__pagination__item--active',
      },
    }),
  );

  search.start();
}

// Render custom <select> menu
function renderFn(
  renderOptions,
  isFirstRendering,
) {
  let select;
  const containerNode = document.querySelector(renderOptions.widgetParams.containerNode);
  if (isFirstRendering) {
    const header = document.createElement('span');
    containerNode.appendChild(header);
    select = document.createElement('select');
    const title = document.createElement('option');
    title.innerText = renderOptions.widgetParams.title;

    select.addEventListener('change', e => renderOptions.refine(e.target.value));

    containerNode.appendChild(select);
    select.appendChild(title);
  } else {
    select = containerNode.querySelector('select');
  }

  if (renderOptions.items) {
    const options = renderOptions.items.map((item) => {
      const option = document.createElement('option');

      option.innerText = `${item.label} ${item.count}`;
      option.value = item.value;
      option.selected = item.isRefined;

      return option;
    });

    select.textContent = '';
    options.forEach(el => select.appendChild(el));
  }
}

// TEMP: Hardcoded path
function truncateUrl(url) {
  if (url.length > 30) {
    const pathParts = url.split('/');
    const docTitle = pathParts.pop();
    return `http://docs.mesosphere.com/${pathParts[0]}/${pathParts[1]}/.../${docTitle}`;
  }
  return `http://docs.mesosphere.com/${url}`;
}

function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    let context = this,
    args = arguments;
    let later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  }
}