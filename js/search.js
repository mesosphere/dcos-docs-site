// Debounce search form
function debounce(func, wait = 500) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

const extractPreviewData = (data) => ({
  title: data._highlightResult.title.value,
  excerpt: data._snippetResult.excerpt.value,
  content: data._snippetResult.content.value,
});

try {
  const algoliaProjectId = "Z0ZSQ5T6T2";
  const algoliaPublicKey = "d0ef5c801751c1d2d5e716af0c098bc3";
  const algoliaIndex = window.location.pathname
    .split("/")
    .slice(1, 3)
    .join("-");
  const onLandingPage = document.querySelector(".landing");
  const onSearchPage = document.querySelector("#search-form");

  if (onLandingPage) {
    const client = algoliasearch(algoliaProjectId, algoliaPublicKey);
    const index = client.initIndex(algoliaIndex);

    autocomplete(
      "#landing-search-input",
      {
        hint: false,
        minLength: 3,
        cssClasses: { root: "landing__results", prefix: "landing__results" },
      },
      {
        source: autocomplete.sources.hits(index, { hitsPerPage: 5 }),
        displayKey: "title",
        templates: {
          header: '<div class="landing__results-header">Pages</div>',
          suggestion: (data) => {
            const { excerpt, title } = extractPreviewData(data);
            return `
            <a href="/${data.path}" class="landing__results-link">
              <strong class="landing__results-title">${title}</strong>
              <div class="landing__results-snippet">&hellip; ${description} &hellip;</div>
            </a>
          `;
          },
        },
      }
    );
  } else if (onSearchPage) {
    // this means we're on /search!
    /**
     * Algolia Search Page Config
     */
    const search = instantsearch({
      appId: algoliaProjectId,
      apiKey: algoliaPublicKey,
      indexName: algoliaIndex,
      urlSync: true,
      searchParameters: { hitsPerPage: 10 },
    });

    /**
     * Search result templates
     */

    // Render search input widget
    search.addWidget(
      instantsearch.widgets.searchBox({
        container: "#search-input",
        placeholder: "Search for...",
        autofocus: true,
        magnifier: false,
        reset: false,
        wrapInput: false,
        queryHook: debounce((query, search) => search(query)),
      })
    );

    // Render search results
    search.addWidget(
      instantsearch.widgets.hits({
        container: "#search-results",
        templates: {
          empty:
            '<div class="text-center">No results found matching <strong>{{query}}</strong>.</div>',
          item: (data) => {
            const { title, excerpt, content } = extractPreviewData(data);
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
                  ${data.versionNumber ? data.versionNumber : ""}
                </span>
                <a href="/${
                  data.path
                }" class="search__meta-source">http://docs.d2iq.com/${
              data.path
            }</a>
              </div>
            </li>
          `;
          },
        },
      })
    );

    // Select widgets
    search.addWidget(
      instantsearch.widgets.menuSelect({
        container: "#search-type",
        attributeName: "type",
        templates: {
          seeAllOption: "Type",
        },
        autoHideContainer: false,
        cssClasses: { select: "search__filter__list" },
      })
    );

    // Render pagination
    search.addWidget(
      instantsearch.widgets.pagination({
        container: "#search-pagination",
        cssClasses: {
          root: "search__pagination",
          item: "search__pagination__item",
          link: "search__pagination__link",
          active: "search__pagination__item--active",
        },
        showFirstLast: false,
      })
    );
    search.start();
  }
} catch (e) {
  console.error("Error in search script" + e);
}
