const client = algoliasearch('O1RKPTZXK1', '00ad2d0be3e5a7155820357a73730e84');
const index = client.initIndex('dev_MESOSPHERE');

let searchForm = document.querySelector('#search-form');
let searchInput = document.querySelector('#search-input');
let searchFilterVersion = document.querySelector('.search__filters-version');
let searchFilterOther = document.querySelector('.search__filters-other');
let searchResults = document.querySelector('#search-results');

if (searchForm) {
  window.addEventListener('load', checkUrlQuery);
  searchForm.addEventListener('submit', onSubmit);
}

function checkUrlQuery() {
  const query = getQueryVariable('q');
  if (query) {
    search(query);
    searchInput.value = query;
  }
}

function onSubmit(event) {
  event.preventDefault();
  let filter;
  if (searchFilterVersion && searchFilterOther) {
    // Not sure if this line should be AND or TO (see docs)
  //   filter = `version: ${searchFilterVersion.value.split(' ')[1]}} AND ${searchilterOther.value.split(' ')[1]}}`;
  // } else {
  //   filter = `version: ${searchFilterVersion.value.split(' ')[1]}}`;
  // }
  filter = '';
  search(searchInput.value, filter);
}

function search(query, filters) {
  index.search({
    query: query,
    attributesToSnippet: [
      'contents:50'
    ],
    filters: filters,
  }).then(renderResults);
}

function renderResults(res) {
  console.log(res.hits);

  let finalHtml = res.hits.map((hit) => {
    // TEMP: Temporary path
    let path = `http://docs.mesosphere.com/${hit.objectID}`;
    let html = `
      <li class="search__results-item">
        <h4 class="search__title">
          <a href="${path}" class="search__link">${hit._highlightResult.title.value}</a>
        </h4>
        <p class="search__description">${hit._snippetResult.contents.value}</p>
        <div class="search__meta">
          <span class="search__meta-version">Mesosphere DC/OS 1.9</span>
          <a href="${path}" class="search__meta-source">${truncateUrl(path)}</a>
        </div>
      </li>
    `;
    return html;
  })
  .join(' ');

  searchResults.innerHTML = finalHtml;
}

function getQueryVariable(variable) {
  let query = window.location.search.substring(1);
  let vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split("=");
    if (pair[0] == variable) { return pair[1]; }
  }
  return (false);
}

function truncateUrl(url) {
  if (url.length > 60) {
    return url.substr(0, 40) + '...' + url.substr(url.length - 10, url.length);
  }
  return url;
}
