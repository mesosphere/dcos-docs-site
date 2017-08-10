const contentHeadings = document.querySelectorAll('.content__container [id]');
const contentHeadingsArray = [...contentHeadings];

if (contentHeadings && window.innerWidth > 1025) {
  document.addEventListener('scroll', () => {
    const windowOffset = window.pageYOffset + 80;
    if (windowOffset < contentHeadingsArray[0].offsetTop + 80) {
      const activeLink = document.querySelector('a.active');
      if (activeLink) {
        activeLink.classList.remove('active');
      }
    }
    contentHeadingsArray.forEach((el) => {
      const elTopOffset = (el.offsetTop - (el.offsetHeight / 3)) + 80;
      const elBottomOffset = (el.offsetTop + el.offsetHeight) + 80;
      if (windowOffset > elTopOffset && elBottomOffset > windowOffset) {
        const linkSelector = `a[href='#${el.getAttribute('id')}']`;
        const activeLink = document.querySelector(linkSelector);
        if (activeLink) {
          const curActiveLink = document.querySelector('a.active');
          if (curActiveLink) {
            if (curActiveLink.getAttribute('href') !== `#${el.getAttribute('id')}`) {
              curActiveLink.classList.remove('active');
            }
          }
          if (!activeLink.classList.contains('active')) {
            activeLink.classList.add('active');
          }
        }
      }
    });
  });
}
