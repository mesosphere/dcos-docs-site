function checkOverflow(el) {
  const isOverflowing = el.offsetWidth < el.scrollWidth || el.offsetHeight < el.scrollHeight;
  return isOverflowing;
}

const handleEllipsis = () => {
  const cards = document.querySelectorAll('.grid__desc__wrapper');

  for (let i = 0; i < cards.length; i += 1) {
    if (checkOverflow(cards[i])) {
      cards[i].querySelector('.grid__desc__ellipsis').style.visibility = 'visible';
    } else {
      cards[i].querySelector('.grid__desc__ellipsis').style.visibility = 'hidden';
    }
  }
};

window.addEventListener('load', handleEllipsis);
window.addEventListener('resize', handleEllipsis);

