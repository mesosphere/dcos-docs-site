const headerSearch = document.querySelector('.header__search-input');
const headerSearchLabel = document.querySelector('.header__search-label');
const headerMenu = document.querySelector('.header__menu');

if (headerSearch) {
  headerSearch.addEventListener('focus', () => headerMenu.classList.add('header__menu--hide'));
  headerSearch.addEventListener('blur', () => headerMenu.classList.remove('header__menu--hide'));
  headerSearchLabel.addEventListener('click', () => headerSearch.focus());
}
