const tooltip = document.body.querySelectorAll('[data-tooltip]');
for (let i = 0; i < tooltip.length; i++) {
  tooltip[i].setAttribute('data-tooltip', i);
  tooltip[i].addEventListener('mouseenter', popTip);
  tooltip[i].addEventListener('touchenter', popTip);
  tooltip[i].addEventListener('mouseleave', fadeTip);
  tooltip[i].addEventListener('touchleave', fadeTip);
}

function popTip(e) {
  const tip = document.createElement('aside');
  const nub = document.createElement('i');
  const content = this.getAttribute('data-content') || '';
  tip.setAttribute('data-tip', this.getAttribute('data-tooltip'));
  tip.style.top = measureTop(e.target) + e.target.offsetHeight + 'px';

  if (content) {
    tip.innerHTML += '<p>' + content + '</p>';
  }

  tip.addEventListener('click', function () {});
  document.body.appendChild(tip).appendChild(nub);
  tip.style.top = tip.style.top.split('p')[0] - tip.scrollHeight - 10 + 'px';


  if (window.innerWidth > 500) {
    if (measureLeft(e.target) > window.innerWidth - 300) {
      tip.style.left = nub.style.left = 'auto';
      tip.style.right = window.innerWidth - (measureLeft(e.target) + e.target.offsetWidth) + 'px';
      nub.style.right = (tip.offsetWidth / 2 - 10) + 'px';
    } else {
      tip.style.left = measureLeft(e.target) + (e.target.offsetWidth / 2 - tip.offsetWidth/2) + 'px';
      nub.style.left = (tip.offsetWidth / 2 - 10) + 'px';
    }
  } else {
    nub.style.left = measureLeft(e.target) - 5 + (e.target.offsetWidth / 2 - 10) + 'px';
    tip.style.left = 0;
  }

  setTimeout(function () {
    tip.style.opacity = 1;
    tip.style.pointerEvents = 'none';
  }, 200);
}

function fadeTip(e) {
  const attr = this.getAttribute('data-tooltip');
  const tip = document.querySelectorAll('[data-tip="' + attr + '"]')[0];
  tip.style.opacity = 0
  tip.style.pointerEvents = 'none';
  setTimeout(function () {
    document.body.removeChild(tip)
  }, 200)
}

function measureTop(el) {
  let top = 0;
  while (el) {
    top += el.offsetTop;
    el = el.offsetParent;
  }
  return top;
}

function measureLeft(el) {
  let left = 0;
  while (el) {
    left += el.offsetLeft;
    el = el.offsetParent;
  }
  return left;
}
