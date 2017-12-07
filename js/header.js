const headerSearch = document.querySelector('.header__search-input');
const headerSearchLabel = document.querySelector('.header__search-label');
const headerMenu = document.querySelector('.header__menu');
const headerMain = document.querySelector('.header__main');
const headerDropdown = document.querySelector('.header__dropdown');

if (headerSearch) {
  headerSearch.addEventListener('focus', () => {
    // headerMenu.classList.add('header__menu--hide');
    headerMain.classList.add('header__main--hide');
  });
  headerSearch.addEventListener('blur', () => {
    // headerMenu.classList.remove('header__menu--hide')
    headerMain.classList.remove('header__main--hide');
  });
  headerSearchLabel.addEventListener('click', () => headerSearch.focus());
}
