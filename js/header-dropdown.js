const headerDropdownButton = document.querySelector('.header__dropdown');
const headerDropdown = document.querySelector('.header-dropdown');
const headerDropdownArrow = document.querySelector('.header__dropdown svg');
const layout = document.querySelector('.layout');

if (headerDropdown) {
  headerDropdownButton.addEventListener('click', toggleDropdown);
  window.addEventListener('resize', checkWindowSize);
}

function checkWindowSize() {
  if (window.innerWidth > 767 && headerDropdown.classList.contains('header-dropdown--show')) {
    layout.style.overflow = null;
  }
}

function toggleDropdown() {
  if (!headerDropdown.classList.contains('header-dropdown--show')) {
    headerDropdown.classList.add('header-dropdown--show');
    headerDropdownArrow.style.transform = 'rotate(180deg)';
    layout.style['overflow-y'] = 'hidden';
  } else {
    headerDropdown.classList.remove('header-dropdown--show');
    headerDropdownArrow.style.transform = 'rotate(0)';
    layout.style['overflow-y'] = null;
  }
}
