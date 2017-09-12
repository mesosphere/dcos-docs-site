// Algolia Search Test
const client = algoliasearch('O1RKPTZXK1', '00ad2d0be3e5a7155820357a73730e84');
const index = client.initIndex('dev_MESOSPHERE');

let searchForm = document.querySelector('#search-form');
let searchInput = document.querySelector('#search-input');
let searchResults = document.querySelector('#search-results');

if(searchForm) {
  searchForm.addEventListener('submit', onSubmit);
}

function onSubmit(event) {
  event.preventDefault();
  let query = searchInput.value;
  search(query);
}

function search(query) {
  index.search({query: query}).then(renderResults);
}

function renderResults(res) {
  console.log(res);

  let finalHtml = res.hits.map((hit) => {
    let html = `
      <li class="search__results-item">
        <h4 class="search__title">
          <a href="/" class="search__link">${hit.title}</a>
        </h4>
        <p class="search__description">${hit.contents}</p>
        <div class="search__meta">
          <span class="search__meta-version">Mesosphere DC/OS 1.9</span>
          <a href="/" class="search__meta-source">https://docs.mesosphere.com/1.9/.../deploying-a-local-dcos-universe</a>
        </div>
      </li>
    `;
    return html;
  })
  .join(' ');
  console.log(res);

  searchResults.innerHTML = finalHtml;
}


