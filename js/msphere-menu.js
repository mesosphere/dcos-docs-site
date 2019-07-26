class Spherer {
    constructor(el) {
        this.el = el;
        this.list = this.el.querySelector('#spherer-list');
        this.svg = this.el.querySelector('#spherer-svg');

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
        if (this.listShown) {
            this.list.classList.add('show');
            this.svg.classList.add('flipped');
        } else {
            this.list.classList.remove('show');
            this.svg.classList.remove('flipped');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const sphereNav = document.querySelector('#spherer');
    new Spherer(sphereNav);
});