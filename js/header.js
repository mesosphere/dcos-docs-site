const headerSearch = document.querySelector('.header__search-input');
const headerSearchLabel = document.querySelector('.header__search-label');
const headerMain = document.querySelector('.header__main');
const headerDropdown = document.querySelector('.header__dropdown');
const headerForm = document.querySelector('.header__search-form');

if (headerSearch) {
  headerSearch.addEventListener('focus', () => {
    headerMain.classList.add('header__main--hide');
    headerForm.classList.add('header__search-form--focused');
  });
  headerSearch.addEventListener('blur', () => {
    headerMain.classList.remove('header__main--hide');
    headerForm.classList.remove('header__search-form--focused');
  });
  headerSearchLabel.addEventListener('click', () => headerSearch.focus());
}
