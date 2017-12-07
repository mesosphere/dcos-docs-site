const contentContainer = document.querySelector('.content__container');
const contentHeadings = document.querySelectorAll('.content__container [id]');
const contentHeadingsArray = [...contentHeadings].filter(heading => !heading.dataset.hide);
const tableOfContents = document.querySelector('.content__sections-list');
const articleContainer = document.querySelector('.content__article');

const headerOffset = 120;
const windowOffset = window.pageYOffset + headerOffset;

if (contentHeadingsArray && window.innerWidth > 1024) {
  document.addEventListener('scroll', scrollTop);
  document.addEventListener('scroll', scrollSpy);
}

/**
 *
 *
 */
function scrollTop() {
  if (tableOfContents) {
    if (windowOffset < articleContainer.getBoundingClientRect().top + headerOffset) {
      const activeLink = document.querySelector('a.active');
      if (activeLink) {
        activeLink.classList.remove('active');
      }
    }
  }
}

/**
 *
 *
 */
function scrollSpy() {
  if (tableOfContents) {
    contentHeadingsArray.forEach((el) => {
      const elTopOffset = el.getBoundingClientRect().top;
      if (elTopOffset < 1) {
        const linkSelector = `a[href='#${el.getAttribute('id')}']`;
        const activeLink = tableOfContents.querySelector(linkSelector);
        if (activeLink) {
          const curActiveLink = tableOfContents.querySelector('a.active');
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
  }
}
