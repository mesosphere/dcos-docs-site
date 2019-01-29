const sidebarDropdown = document.querySelector('.sidebar__dropdown');
const sidebarDropdownList = document.querySelector('.sidebar__dropdown__list');
let sidebarItems = document.querySelectorAll('.sidebar__nav__item--parent');
sidebarItems = [...sidebarItems];

if (sidebarDropdown && sidebarDropdownList) {
  document.addEventListener('click', detectClick);
  sidebarDropdown.addEventListener('click', toggleDropdown);
}

if (sidebarItems.length) {
  sidebarItems.forEach((menu) => {
    const caret = menu.querySelector('svg');
    if (caret) caret.addEventListener('click', toggleMenu);
  });
}

/**
 *
 *
 */
function toggleDropdown() {
  if (!sidebarDropdown.classList.contains('sidebar__dropdown--active')) {
    sidebarDropdown.classList.add('sidebar__dropdown--active');
  } else {
    sidebarDropdown.classList.remove('sidebar__dropdown--active');
  }
}

/**
 *
 *
 */
function detectClick(event) {
  if (sidebarDropdown.classList.contains('sidebar__dropdown--active') && !sidebarDropdown.contains(event.target)) {
    sidebarDropdown.classList.remove('sidebar__dropdown--active');
  }
}

/**
 *
 *
 */
function toggleMenu(event) {
  event.stopPropagation();
  event.preventDefault();
  const childMenu = this.parentNode.parentNode.nextSibling;
  if (!childMenu.classList.contains('sidebar__nav__list--active')) {
    childMenu.classList.add('sidebar__nav__list--active');
    this.style.transform = 'rotate(90deg)';
  } else {
    childMenu.classList.remove('sidebar__nav__list--active');
    this.style.transform = 'rotate(0)';
  }
}
