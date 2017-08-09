const contentHeadings = document.querySelectorAll('.content h2');

if (contentHeadings && window.innerWidth > 1025) {
  // create div or part of template?
  const activeElement = document.querySelector('.content__sections-sticky');
  const bodyOffset = document.body.getBoundingClientRect().top;
  const firstHeading = contentHeadings[0].getBoundingClientRect().top;
  const offset = firstHeading - bodyOffset;
  console.log(offset);
  // const firstHeadingOffset = window.clientTop;
  activeElement.classList.add('content__sections-sticky--fixed');
  activeElement.style['top'] = `${offset}px`;
  // const stickyStart = activeElement.getBoundingClientRect().top;

  const stickyState = () => {
    const pageScroll = window.scrollY;
    const offsetY = offset - pageScroll;
    if (pageScroll > offsetY + 100) {
      activeElement.style['top'] = '100px';
    } else {
      activeElement.style['top'] = `${offsetY}px`;
    }
  };

  document.addEventListener('scroll', stickyState);
}
