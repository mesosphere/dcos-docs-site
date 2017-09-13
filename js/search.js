// Algolia Search Test
const client = algoliasearch('O1RKPTZXK1', '00ad2d0be3e5a7155820357a73730e84');
const index = client.initIndex('dev_MESOSPHERE');

let searchForm = document.querySelector('#search-form');
let searchInput = document.querySelector('#search-input');
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
  search(searchInput.value);
}

function search(query) {
  index.search({ query: query }).then(renderResults);
}

function renderResults(res) {
  console.log(res.hits);

  let finalHtml = res.hits.map((hit) => {
    let path = `/${hit.objectID}`;
    let html = `
      <li class="search__results-item">
        <h4 class="search__title">
          <a href="${path}" class="search__link">${hit._highlightResult.title.value}</a>
        </h4>
        <p class="search__description">${hit._highlightResult.contents.value}</p>
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
  if (url.length > 50) {
    return url.substr(0, 35) + '...' + url.substr(url.length - 10, url.length);
  }
  return url;
}