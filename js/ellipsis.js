function checkOverflow(el) {
  const isOverflowing = el.offsetWidth < el.scrollWidth || el.offsetHeight < el.scrollHeight;

  return isOverflowing;
}

const handleEllipsis = () => {
  const cards = document.querySelectorAll('.ellipsis');

  for (let i = 0; i < cards.length; i += 1) {
    console.log(cards[i]);
    console.log(checkOverflow(cards[i]));

    if (checkOverflow(cards[i])) {
      cards[i].querySelector('.grid__desc__ellipsis').style.visibility = 'visible';
    } else {
      cards[i].querySelector('.grid__desc__ellipsis').style.visibility = 'hidden';
    }
  }
};

window.onload = handleEllipsis;
window.onresize = handleEllipsis;

