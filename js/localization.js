class Localizer {
  constructor(el) {
    this.el = el;
    this.list = this.el.querySelector('ul');
    this.svg = this.el.querySelector('.localization-svg');

    this.listShown = false;

    this.closeList = this.closeList.bind(this);
    this.openList = this.openList.bind(this);

    this.addOpenEventListener();
    this.render();
  }

  addOpenEventListener() {
    document.removeEventListener('click', this.closeList);

    this.el.addEventListener('click', this.openList);
  }

  addCloseEventListener() {
    this.el.removeEventListener('click', this.openList);

    document.addEventListener('click', this.closeList);
  }

  toggleListShown() {
    this.listShown = !this.listShown;
  }

  openList(e) {
    e.stopPropagation();
    this.toggleListShown();
    this.addCloseEventListener();
    this.render();
  }

  closeList(e) {
    this.toggleListShown();
    this.addOpenEventListener();
    this.render();
  }

  render() {
    if(this.listShown) {
      this.list.classList.add('show');
      this.svg.classList.add('flipped');
    } else {
      this.list.classList.remove('show');
      this.svg.classList.remove('flipped');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const localizeNav = document.querySelector('.localization');
  new Localizer(localizeNav);
});
