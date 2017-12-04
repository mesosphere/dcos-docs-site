const inPageToc = document.querySelector('.content__sections-list-container');

if (inPageToc && inPageToc.offsetHeight > document.body.clientHeight) {
  inPageToc.setAttribute('style', `height: ${document.body.clientHeight - 172}px;`);

  const followScroll = (element, position) => {
    // subtract element.offsetHeight / 3 to center the active link in toc
    element.scrollTop = position - (element.offsetHeight / 3);
  };


  window.onscroll = () => {
    const activeLink = document.querySelector('a.active');

    if (activeLink) {
      followScroll(inPageToc, activeLink.offsetTop);
    }
  };
}
