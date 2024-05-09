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
        document.body.appendChild(this.div);
        if (options) {
            options.position && this.setPosition(options.position);
            options.buttons && this.setButtons(options.buttons);
            options.position && this.setPosition(options.position);
            options.position && this.setPosition(options.position);
        }
        this.hide();
    }

    setPosition(position) {
        this.clientX = position.clientX;
        this.clientY = position.clientY;
        this.div.style.top = (this.clientY + (this.clientY > 30 ? -1 : 0) * this.div.clientHeight + (this.clientY > 30 ? -1 : 1) * 6) + 'px';
        this.div.style.left = (this.clientX - this.div.clientWidth / 2) + 'px';
        const tooltip = this.div.querySelector('.tooltip');
        this.clientY > 30 ? tooltip.classList.remove('tooltip-bottom') : tooltip.classList.add('tooltip-bottom');
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
    }

    hide() {
        this.div.style.display = 'none';
    }

    btnFactory(button) {
        const btn = document.createElement('a');
        btn.innerText = button.title;
        btn.addEventListener('click', evt => button.onClick && button.onClick(evt));

        return btn;
    }
}
