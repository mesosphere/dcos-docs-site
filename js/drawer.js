const drawerMenu = document.querySelector('.layout__sidebar');
const drawerOpen = document.querySelector('.header__drawer');

if (drawerMenu && window.innerWidth < 500) {
  drawerOpen.addEventListener('click', drawerToggle);
}

function drawerToggle() {
  console.log('drawerToggle()');
  if (!drawerMenu.classList.contains('layout__sidebar--mobile')) {
    drawerMenu.classList.add('layout__sidebar--mobile');
  } else {
    drawerMenu.classList.remove('layout__sidebar--mobile');
  }
}