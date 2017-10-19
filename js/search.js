const searchForm = document.querySelector('#search-form');

if (searchForm) {
  /**
   * Algolia Search Page Config
   */
  const search = instantsearch({
    appId: 'O1RKPTZXK1',
    apiKey: '4cc78f4d67f726ba3b2c5bd1ed690fb4',
    indexName: 'dev_MESOSPHERE',
    urlSync: true,
    searchParameters: {
      hitsPerPage: 10,
    },
  });

  /** 
   * Search result templates
   */
  const hitTemplate = `
    <li class="search__results-item">
      <h4 class="search__title">
        <a href="/{{path}}" class="search__link">{{{_highlightResult.title.value}}}</a>
      </h4>
      {{#excerpt}}
        <p class="search__description">{{{excerpt}}}</p>
      {{/excerpt}}
      <div class="search__meta">
        {{#product}}
          <span class="search__meta-product">
            {{product}}
            {{#versionNumber}}
              {{versionNumber}}
            {{/versionNumber}}
          </span>
        {{/product}}
        <a href="/{{path}}" class="search__meta-source">{{displayPath}}</a>
      </div>
    </li>
  `;

  const noResultsTemplate = '<div class="text-center">No results found matching <strong>{{query}}</strong>.</div>';

  // Render search input widget
  search.addWidget(
    instantsearch.widgets.searchBox({
      container: '#search-input',
      placeholder: 'Search for...',
      autofocus: true,
      magnifier: false,
      reset: false,
      wrapInput: false,
      queryHook: debounce(function (inputValue, search) {
        search(inputValue);
      }, 500),
    }),
  );

  // Render search results
  search.addWidget(
    instantsearch.widgets.hits({
      container: '#search-results',
      templates: {
        empty: noResultsTemplate,
        item: hitTemplate,
      },
      transformData: function (hit) {
        hit.displayPath = displayPath(hit.path);
        return hit;
      },
    }),
  );

  // Select widgets
  // TODO: Waiting on pull request for cssClasses fix.
  search.addWidget(
    instantsearch.widgets.menuSelect({
      container: '#search-section',
      attributeName: 'section',
      templates: {
        seeAllOption: 'Section',
      },
      autoHideContainer: false,
      sort: ['name:asc'],
      cssClasses: {
        select: 'search__filter__list',
      },
    }),
  );

  search.addWidget(
    instantsearch.widgets.menuSelect({
      container: '#search-version',
      attributeName: 'version',
      templates: {
        seeAllOption: 'Version',
      },
      autoHideContainer: false,
      sortBy: sortBy,
      cssClasses: {
        select: 'search__filter__list',
      },
    }),
  );

  search.addWidget(
    instantsearch.widgets.menuSelect({
      container: '#search-type',
      attributeName: 'type',
      templates: {
        seeAllOption: 'Type'
      },
      autoHideContainer: false,
      cssClasses: {
        select: 'search__filter__list'
      }
    })
  )

  // Render pagination
  search.addWidget(
    instantsearch.widgets.pagination({
      container: '#search-pagination',
      cssClasses: {
        root: 'search__pagination',
        item: 'search__pagination__item',
        link: 'search__pagination__link',
        active: 'search__pagination__item--active',
      },
      showFirstLast: false,
    }),
  );

  search.start();
}

// TEMP: Display path
function displayPath(url) {
  return `http://docs.mesosphere.com/${url}`;
}

// Debounce search form
function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    let context = this,
      args = arguments;
    let later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Sort alphabetically
function sortBy(a, b) {
  a = a.name;
  b = b.name;
  let aParts = a.trim().split(' ');
  let bParts = b.trim().split(' ');
  let aProduct = aParts.slice(0, -1).join(' ');
  let bProduct = bParts.slice(0, -1).join(' ');
  let aVersion = aParts[aParts.length - 1];
  let bVersion = bParts[bParts.length - 1];
  if (aProduct < bProduct) return -1;
  if (aProduct > bProduct) return 1;
  return -1 * sortVersion(aVersion, bVersion);
}

// Sort semantic versioning
function sortVersion (a, b) {
  let pa = a.split('.');
  let pb = b.split('.');
  for (let i = 0; i < 3; i++) {
    let na = Number(pa[i]);
    let nb = Number(pb[i]);
    if (na > nb) return 1;
    if (nb > na) return -1;
    if (!isNaN(na) && isNaN(nb)) return 1;
    if (isNaN(na) && !isNaN(nb)) return -1;
  }
  return 0;
};