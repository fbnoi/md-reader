import { TextSelector } from '../../plugin/highlight/selector';
import { Popper } from '../../plugin/popper/popper';

export default class Noter {
    constructor(container) {
        this.container = container;
        this.selector = new TextSelector(container);
        this. popper = new Popper({container: container});
        this.init();
        this.listen();
    }

    init() {
        window.API.getNotes()
        .then(notes => {
            notes.forEach(note => {
                this.selector.highlightSelection(this.selector.unserialize(note.selection));
            });
        });
    }

    listen() {
        this.selector.on('select', selection => this._onSelect.call(this, selection));
        this.selector.on('selectionClick', selection => this._onSelectionClick.call(this, selection));
    }

    _onSelect(selection) {
        let rects = selection.getRects();
        let rect = rects[rects.length - 1];
        if (rect.width > 10) {
            this.popper.setPosition(this._getPosition(rect));
            this.popper.setButtons([{
                title: 'highlight',
                onClick: () => {
                    this.selector.highlightSelection(selection);
                    this.popper.hide();
                    window.API.addNote(this.selector.serialize(selection), null);
                }
            }]);
            this.popper.show();
        }
    }

    _onSelectionClick(selection) {
        let rects = selection.getRects();
        let rect = rects[rects.length - 1];
        if (rect.width > 10) {
            this.popper.setPosition(this._getPosition(rect));
            this.popper.setButtons([{
                title: 'remove highlight',
                onClick: () => {
                    this.selector.delightSelection(selection);
                    this.popper.hide();
                    window.API.removeNote(this.selector.serialize(selection));
                }
            }]);
            this.popper.show();
        }
    }

    _getPosition(rect) {
        return {top: rect.container.offsetTop + rect.y, left: rect.container.offsetLeft + rect.width + rect.x}
    }
}