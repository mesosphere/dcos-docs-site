const sidebarDropdown = document.querySelector('.sidebar__dropdown');
const sidebarDropdownList = document.querySelector('.sidebar__dropdown__list');
const sidebarDropdownListItems = document.querySelectorAll('.sidebar__dropdown__link');
let sidebarItems = document.querySelectorAll('.sidebar__nav__item--parent');
sidebarItems = [...sidebarItems];

if (sidebarDropdown && sidebarDropdownList) {
  document.addEventListener('click', detectClick);
  sidebarDropdown.addEventListener('click', toggleDropdown);
}

if (sidebarItems.length) {
  sidebarItems.forEach((menu) => {
    const caret = menu.querySelector('svg');
    caret.addEventListener('click', toggleMenu);
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

sidebarDropdownListItems.forEach(trigger => {
  
  trigger.addEventListener('click', (evt) => {    
    evt.stopPropagation();
    evt.preventDefault();    

    const urlPath = window.location.pathname;
    const newVersion = trigger.getAttribute('href');
    let pathSegments = urlPath.split('/');
      
    pathSegments.shift();
    pathSegments[0] = newVersion;
  
    let newPath = pathSegments.join('/');

    $.ajax({
      type: 'OPTIONS',
      url: newPath,
      success: ((data) => {
        window.location.href = newPath;
      }),
      error: ((xhr, err) => {
        window.location.href= newVersion;
      })
    });
  });
});