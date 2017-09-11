const headerSearch = document.querySelector('.header__search-input');
const headerMenu = document.querySelector('.header__menu');

headerSearch.onfocus = () => {
  headerMenu.classList.add('header__menu--hide');
};

headerSearch.onblur = () => {
  headerMenu.classList.remove('header__menu--hide');
};
