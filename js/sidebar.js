const sidebarItems = document.querySelectorAll('.navigation__item');

console.log([...sidebarItems].filter(item => {
  return item.contains(item.querySelector('.navigation__list'))
}));