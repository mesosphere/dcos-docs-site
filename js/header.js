const headerSearch = document.querySelector('.header__search-input');
const headerSearchLabel = document.querySelector('.header__search-label');
const headerMenu = document.querySelector('.header__menu');

if (headerSearch) {
  headerSearch.addEventListener('focus', () => headerMenu.classList.add('header__menu--hide'));
  headerSearch.addEventListener('blur', () => headerMenu.classList.remove('header__menu--hide'));
  headerSearchLabel.addEventListener('click', () => headerSearch.focus());

  /**
  * Algolia Header Search Config
  */
  /*
  console.log('Not search page');
  const client = algoliasearch('O1RKPTZXK1', '4cc78f4d67f726ba3b2c5bd1ed690fb4');
  const index = client.initIndex('dev_MESOSPHERE');  

  autocomplete('#header-search-input', {
    hint: false,
    minLength: 3,
    debug: true,
  }, [
  {
    source: autocomplete.sources.hits(index, { hitsPerPage: 5 }),
    displayKey: 'title',
    templates: {
      suggestion: suggestion => {
        return '<span>' +
          suggestion._highlightResult.title.value + '</span><span>' +
          suggestion._highlightResult.team.value + '</span>';
      }
      suggestion: suggestion => suggestion._highlightResult.title.value,
    },
  },
  ]).on('autocomplete:selected', (event, suggestion, dataset) => {
  console.log(suggestion, dataset);
  });
  */

}