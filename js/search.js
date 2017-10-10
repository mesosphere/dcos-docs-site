const searchForm = document.querySelector('#search-form');

if (searchForm) {
  /**
   * Algolia Search Page Config
   */
  const search = instantsearch({
    appId: 'O1RKPTZXK1',
    apiKey: '4cc78f4d67f726ba3b2c5bd1ed690fb4',
    indexName: 'dev_MESOSPHERE',
    urlSync: true
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
        <p class="search__description">{{{_highlightResult.excerpt.value}}}</p>
      {{/excerpt}}
      <div class="search__meta">
        {{#version}}
          <span class="search__meta-version">{{version}}</span>
        {{/version}}
        {{#path}}
          <a href="/{{path}}" class="search__meta-source">{{truncatedPath}}</a>
        {{/path}}
      </div>
    </li>
  `;

  const noResultsTemplate = '<div class="text-center">No results found matching <strong>{{query}}</strong>.</div>';

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
        if (hit.path) {
          hit.truncatedPath = truncateUrl(hit.path);
        }
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
				seeAllOption: 'Section'
      },
      autoHideContainer: false,
      cssClasses: {
        select: 'search__filter__list',
      },
    })
  );
  
  search.addWidget(
    instantsearch.widgets.menuSelect({
      container: '#search-version',
			attributeName: 'version',
			templates: {
        seeAllOption: 'Version'
			},
      autoHideContainer: false,
      cssClasses: {
        select: 'search__filter__list',
      },
    })
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
    }),
  );

  search.start();
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