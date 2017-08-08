const contentHeadings = document.querySelectorAll('.content h2');

if (contentHeadings && window.innerWidth > 1025) {
  // create div or part of template?
  const activeElement = document.querySelector('.content__sections-sticky');
  const stickyStart = activeElement.getBoundingClientRect().top;

  const stickyState = () => {
    const scroll = window.scrollY;
    if (scroll > 0) {
      activeElement.classList.add('content__sections-sticky--fixed');
      activeElement.style[top] = stickyStart;
    } else {
      activeElement.classList.remove('content__sections-sticky--fixed');
      activeElement.style[top] = null;
    }
  };

  document.addEventListener('scroll', stickyState);
}
