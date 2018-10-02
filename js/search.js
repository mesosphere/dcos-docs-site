const landingContainer = document.querySelector('.landing');

//
// Env vars injected from webpack config
//

const algoliaProjectId = ALGOLIA_PROJECT_ID;
const algoliaPublicKey = ALGOLIA_PUBLIC_KEY;
const algoliaIndex = ALGOLIA_INDEX;

//
//
//

if (landingContainer) {
  const client = algoliasearch(algoliaProjectId, algoliaPublicKey);
  const index = client.initIndex(algoliaIndex);

  autocomplete(
    '#landing-search-input',
    {
      hint: false,
      minLength: 3,
      cssClasses: {
        root: 'landing__results',
        prefix: 'landing__results',
      },
    },
    {
      source: autocomplete.sources.hits(index, { hitsPerPage: 5 }),
      displayKey: 'title',
      templates: {
        header: '<div class="landing__results-header">Pages</div>',
        suggestion: function suggestion(data) {
          let title = data.title;
          let description = data.excerpt;

          if (data._highlightResult.title) {
            title = data._highlightResult.title.value;
          }
          if (data._highlightResult.excerpt) {
            description = data._highlightResult.excerpt.value;
          }
          if (data._snippetResult.excerpt && data._snippetResult.excerpt.matchLevel === 'full') {
            description = data._snippetResult.excerpt.value;
          } else if (data._snippetResult.content && data._snippetResult.content.matchLevel === 'full') {
            description = data._snippetResult.content.value;
          }

          return `
            <a href="${data.path}" class="landing__results-link">
              <strong class="landing__results-title">${title}</strong>
              <div class="landing__results-snippet">&hellip; ${description} &hellip;</div>
            </a>
          `;
        },
      },
    },
  );

  document.addEventListener('scroll', () => {
    if (autocomplete.autocomplete.getWrapper().style.display === 'block') {
      autocomplete.autocomplete.close();
      autocomplete.autocomplete.open();
    }
  });
}

const searchForm = document.querySelector('#search-form');

if (searchForm) {
  /**
   * Algolia Search Page Config
   */
  const search = instantsearch({
    appId: algoliaProjectId,
    apiKey: algoliaPublicKey,
    indexName: algoliaIndex,
    urlSync: true,
    searchParameters: {
      hitsPerPage: 10,
    },
  });

  /**
   * Search result templates
   */

  // Render search input widget
  search.addWidget(
    instantsearch.widgets.searchBox({
      container: '#search-input',
      placeholder: 'Search for...',
      autofocus: true,
      magnifier: false,
      reset: false,
      wrapInput: false,
      queryHook: debounce((inputValue, searchFunc) => {
        searchFunc(inputValue);
      }, 500),
    }),
  );

  // Render search results
  search.addWidget(
    instantsearch.widgets.hits({
      container: '#search-results',
      templates: {
        empty: '<div class="text-center">No results found matching <strong>{{query}}</strong>.</div>',
        item: (data) => {
          const title = data._highlightResult.title.value;
          const excerpt = data._snippetResult.excerpt.value;
          const content = data._snippetResult.content.value;

          return `
            <li class="search__results-item">
              <h4 class="search__title">
                <a href="/${data.path}" class="search__link">${title}</a>
              </h4>
              <p class="search__description">${excerpt}</p>
              <p class="search__description">${content}</p>
              <div class="search__meta">
                <span class="search__meta-product">
                  ${data.product}
                  ${(data.versionNumber) ? data.versionNumber : ''}
                </span>
                <a href="/${data.path}" class="search__meta-source">http://docs.mesosphere.com/${data.path}</a>
              </div>
            </li>
          `;
        },
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
      sortBy,
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
        seeAllOption: 'Type',
      },
      autoHideContainer: false,
      cssClasses: {
        select: 'search__filter__list',
      },
    }),
  );

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

  search.on('render', handleFilterWidth);

  search.start();
}

// Debounce search form
function debounce(func, wait, immediate) {
  let timeout;
  return function _debounce(...args) {
    const context = this;
    const later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Sort alphabetically
function sortBy(a, b) {
  a = a.name;
  b = b.name;
  const aParts = a.trim().split(' ');
  const bParts = b.trim().split(' ');
  const aProduct = aParts.slice(0, -1).join(' ');
  const bProduct = bParts.slice(0, -1).join(' ');
  const aVersion = aParts[aParts.length - 1];
  const bVersion = bParts[bParts.length - 1];
  if (aProduct < bProduct) return -1;
  if (aProduct > bProduct) return 1;
  return -1 * sortVersion(aVersion, bVersion);
}

// Sort semantic versioning
function sortVersion(a, b) {
  const pa = a.split('.');
  const pb = b.split('.');
  for (let i = 0; i < 3; i += 1) {
    const na = Number(pa[i]);
    const nb = Number(pb[i]);
    if (na > nb) return 1;
    if (nb > na) return -1;
    if (!isNaN(na) && isNaN(nb)) return 1;
    if (isNaN(na) && !isNaN(nb)) return -1;
  }
  return 0;
}

// Resize filter widths based on selected menu item

function setFilterWidth(id) {
  const filterDiv = $(`#${id}`);
  const select = filterDiv.find('.ais-menu-select--footer');
  $('#templateOption').text(select.find('option:selected').text());
  select.width($('#template').width());
}

function handleFilterWidth() {
  const selectList = document.querySelectorAll('.search__filter');

  selectList.forEach((sel) => {
    const mq = window.matchMedia('(min-width: 769px)');
    if (mq.matches) {
      // the width of browser is more than 769px
      setFilterWidth(sel.getAttribute('id'));
    } else {
      // the width of browser is less than 769px
      const filterDiv = $(`#${sel.getAttribute('id')}`);
      filterDiv.find('.ais-menu-select--footer').width('100%');
    }
  });
}

window.addEventListener('resize', handleFilterWidth);
