import { TextSelector } from '../../plugin/highlight/selector';
import { Popper } from '../../plugin/popper/popper';

export default class Noter {
    constructor(container) {
        this.container = container;
        this.selector = new TextSelector(container);
        this. popper = new Popper({container: container});
        this.listen();
    }

    listen() {
        this.selector.on('select', selection => this._onSelect.call(this, selection));
        this.selector.on('selectionClick', selection => this._onSelectionClick.call(this, selection));
    }

    _onSelect(selection) {
        let rects = selection.getRects();
        let rect = rects[rects.length - 1];
        if (rect.width > 10) {
            this.popper.setPosition({
                top: rect.y + this.container.scrollTop,
                left: rect.x - this.container.getBoundingClientRect().x + rect.width,
            });
            this.popper.setButtons([{
                title: 'highlight',
                onClick: () => {
                    this.selector.highlightSelection(selection);
                    this.popper.hide();
                }
            }]);
            this.popper.show();
        }
    }

    _onSelectionClick(selection) {
        let rects = selection.getRects();
        let rect = rects[rects.length - 1];
        if (rect.width > 10) {
            this.popper.setPosition({
                top: rect.y + this.container.scrollTop,
                left: rect.x - this.container.getBoundingClientRect().x + rect.width,
            });
            this.popper.setButtons([{
                title: 'remove highlight',
                onClick: () => {
                    this.selector.delightSelection(selection);
                    this.popper.hide();
                }
            }]);
            this.popper.show();
        }
    }

    syncNote() {
        
    }
}