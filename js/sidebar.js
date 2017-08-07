const sidebarDropdown = document.querySelector('.sidebar__dropdown');
const sidebarItems = document.querySelectorAll('.navigation__item');
const sidebarMenus = [...sidebarItems].filter(item => item.contains(item.querySelector('.navigation__list')));

document.addEventListener('click', detectClick);
sidebarDropdown.addEventListener('click', toggleDropdown);

sidebarMenus.forEach((menu) => {
  const caret = menu.querySelector('svg');
  caret.addEventListener('click', toggleMenu);
});

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
  event.preventDefault();
  const subHead = this.parentNode.parentNode;
  if (!subHead.classList.contains('navigation__subhead--active')) {
    subHead.classList.add('navigation__subhead--active');
  } else {
    subHead.classList.remove('navigation__subhead--active');
  }
}

