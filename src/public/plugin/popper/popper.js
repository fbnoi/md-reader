import './popper.css';

const TPL = `
<div role="tooltip" class="tooltip">
    <div data-popper-arrow class="tooltip-arrow tooltip-arrow-top"></div>
    <div role="tooltip" class="tooltip-inner"></div>
    <div data-popper-arrow class="tooltip-arrow"></div>
</div>
`;

export class Popper {
    constructor(options) {
        this.clientX = options.position.clientX;
        this.clientY = options.position.clientY;
        this.options = options;
        this.div = document.createElement('div');
        this.div.classList.add('tooltip-container');
        this.div.innerHTML = TPL;
        document.body.appendChild(this.div);
        this.hide();
    }

    setOptions(options) {
        this.clientX = options.position.clientX;
        this.clientY = options.position.clientY;
        this.options = options;
        this.updatePopper();
    }

    updatePopper() {
        this.resetButtons();
        this.div.style.top = this.calcTop() + 'px';
        this.div.style.left = this.calcLect() + 'px';
    }

    resetButtons() {
        const tooltipInner = this.div.querySelector('.tooltip-inner')
        tooltipInner.innerHTML = '';

        this.options.buttons.forEach(button => {
            tooltipInner.appendChild(this.btnFactory(button));
        });
    }

    calcTop() {
        return this.clientY < 30 ? this.clientY : this.clientY - this.div.clientHeight;
    }

    calcLect() {
        return this.clientX - this.div.clientWidth / 2;
    }

    btnFactory(button) {
        const btn = document.createElement('a');
        btn.innerText = button.title;
        btn.addEventListener('click', evt => button.onClick && button.onClick(evt));

        return btn;
    }

    show() {
        this.div.style.visibility = 'visible';
        this.div.style.pointerEvents = 'all';
    }

    hide() {
        this.div.style.visibility = 'none';
        this.div.style.pointerEvents = 'none';
    }
}
