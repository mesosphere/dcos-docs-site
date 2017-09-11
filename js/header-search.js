const headerSearch = document.querySelector('.header__search-input');
const headerMenu = document.querySelector('.header__menu');

headerSearch.onfocus = () => {
  headerMenu.classList.add('header__menu--hide');
};

headerSearch.onblur = () => {
  headerMenu.classList.remove('header__menu--hide');
};

// Algolia Search Test
const client = algoliasearch('O1RKPTZXK1', '00ad2d0be3e5a7155820357a73730e84');
const index = client.initIndex('dev_MESOSPHERE');

index.search({query: 'test'}).then(res => {
  console.log(res);
});