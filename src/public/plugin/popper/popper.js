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
        this.div = document.createElement('div');
        this.div.classList.add('tooltip-container');
        this.div.innerHTML = TPL;
        this.container = options && options.container ? options.container : document.body;
        this.container.appendChild(this.div);

        options && options.position && this.setPosition(options.position);
        options && options.buttons && this.setButtons(options.buttons);
        
        this.hide();
        this._observe();
    }

    _observe() {
        this.container.addEventListener('click', (evt) => {
            if (!this.div.contains(evt.target)) {
                this.hide();
            };
        });
        new ResizeObserver((evt) => this.hide.apply(this, evt)).observe(this.container);
    }

    setPosition(position) {
        this.left = position.left;
        this.top = position.top;
    }

    updateViewPosition() {
        this.div.style.top = (this.top + (this.top > 30 ? -1 : 0) * this.div.clientHeight + (this.top > 30 ? -1 : 1) * 10) + 'px';
        this.div.style.left = (this.left - this.div.clientWidth / 2) + 'px';
        const tooltip = this.div.querySelector('.tooltip');
        this.top > 30 ? tooltip.classList.remove('tooltip-bottom') : tooltip.classList.add('tooltip-bottom');
    }

    setButtons(buttons) {
        const tooltipInner = this.div.querySelector('.tooltip-inner');
        tooltipInner.innerHTML = '';
        buttons.forEach(button => {
            tooltipInner.appendChild(this.btnFactory(button));
        });
    }

    show() {
        this.div.style.display = 'inline-block';
        this.updateViewPosition();
    }

    hide() {
        this.div.style.display = 'none';
    }

    btnFactory(button) {
        let btn = document.createElement('a');
        btn.innerText = button.title;
        btn.addEventListener('click', evt => button.onClick && button.onClick(evt));

        return btn;
    }
}
