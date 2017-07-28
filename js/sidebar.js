const sidebarItems = document.querySelectorAll('.navigation__item');
const sidebarMenus = [...sidebarItems].filter(item => item.contains(item.querySelector('.navigation__list')));

const toggleMenu = (event) => {
  event.preventDefault();
  console.log('test');
};

sidebarMenus.forEach((menu) => {
  const caret = menu.querySelector('svg');
  caret.addEventListener('click', toggleMenu);
});
