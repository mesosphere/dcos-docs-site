const inPageToc = document.querySelector('.content__sections-list-container');

if (inPageToc.offsetHeight > document.body.clientHeight) {
  inPageToc.setAttribute('style', `height: ${document.body.clientHeight - 140}px;`);

  const followScroll = (element, position) => {
    element.scrollTop = position;
  };

  window.onscroll = () => {
    // create window to TOC scroll ratio
    const pos = getScrollRatio(inPageToc.scrollHeight) - 190;
    followScroll(inPageToc, pos);
  };
}

function getScrollRatio(tocHeight) {
  const doc = document.documentElement || document.body;
  const st = 'scrollTop';
  const sh = 'scrollHeight';
  return (doc[st] / (doc[sh] - doc.clientHeight)) * tocHeight;
}
