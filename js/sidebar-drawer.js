const layout = document.querySelector('.layout');
const drawerMenu = document.querySelector('.layout__drawer');
const drawerOpen = document.querySelector('.header__drawer');

if (drawerMenu) {
  drawerOpen.addEventListener('click', drawerToggle);
  window.addEventListener('resize', checkWindowSize);
}

function checkWindowSize() {
  if (window.innerWidth > 767 && drawerMenu.classList.contains('layout__drawer--open')) {
    drawerMenu.classList.remove('layout__drawer--open');
    layout.style['overflow-x'] = 'auto';
  }
}

function drawerToggle() {
  if (!drawerMenu.classList.contains('layout__drawer--open')) {
    drawerMenu.classList.add('layout__drawer--open');
    layout.style['overflow-x'] = 'hidden';
  } else {
    drawerMenu.classList.remove('layout__drawer--open');
    layout.style['overflow-x'] = 'auto';
  }
}