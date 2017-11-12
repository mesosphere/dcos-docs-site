const inPageToc = document.querySelector('.content__sections-list-container');

if (inPageToc.offsetHeight > document.body.clientHeight) {
  inPageToc.setAttribute('style', `height: ${document.body.clientHeight - 140}px;`);

  const followScroll = (element, position) => {
    element.scrollTop = position;
  };

  window.onscroll = () => {
    const scrollAmount = window.pageYOffset || document.documentElement.scrollTop;
    const listItems = document.querySelectorAll('.content__sections-item');
    const listLength = listItems.length;
    const mainContent = document.querySelector('.content__container--with-sections').offsetHeight;

    const pos = (inPageToc.scrollHeight / mainContent) * scrollAmount - (mainContent / listLength) + document.body.clientHeight - 210;
    followScroll(inPageToc, pos);
  };
}
