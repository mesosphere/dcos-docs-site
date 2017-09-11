const contentContainer = document.querySelector('.content__container');
const contentHeadings = document.querySelectorAll('.content__container [id]');
const contentHeadingsArray = [...contentHeadings].filter((el) => !el.dataset.hide);

if (contentHeadings && window.innerWidth > 1025) {
  const tableOfContents = document.querySelector('.content__sections');
  document.addEventListener('scroll', () => {
    const headerOffset = 120;
    const windowOffset = window.pageYOffset + headerOffset;
    if (headerOffset > contentContainer.getBoundingClientRect().top) {
      if(!tableOfContents.classList.contains('content__sections--top')) {
        tableOfContents.classList.add('content__sections--top'); 
      }
    } else {
      tableOfContents.classList.remove('content__sections--top');
    }
    if (windowOffset < contentHeadingsArray[0].offsetTop + headerOffset) {
      const activeLink = document.querySelector('a.active');
      if (activeLink) {
        activeLink.classList.remove('active');
      }
    }
    contentHeadingsArray.forEach((el) => {
      const elTopOffset = el.getBoundingClientRect().top;
      if (headerOffset > elTopOffset) {
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
