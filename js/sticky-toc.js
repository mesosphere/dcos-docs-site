const contentHeadings = document.querySelectorAll('.content h2');

if (contentHeadings && window.innerWidth > 1025) {
  // create div or part of template?
  const bodyOffset = document.body.getBoundingClientRect().top;
  const firstHeading = contentHeadings[0].getBoundingClientRect().top;
  const offset = firstHeading - bodyOffset;

  const activeElement = document.querySelector('.content__sections-sticky');
  activeElement.style.top = `${offset}px`;

  const stickyState = () => {
    const pageScroll = window.scrollY;
    const offsetY = offset - pageScroll;
    // wip: set values
    if (pageScroll > offsetY + 100) {
      activeElement.style.top = '100px';
    } else {
      activeElement.style.top = `${offsetY}px`;
    }
  };

  document.addEventListener('scroll', stickyState);
}
