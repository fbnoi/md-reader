import { TextSelector } from '../../plugin/highlight/selector';
import { Popper } from '../../plugin/popper/popper';

export default class Noter {
    constructor(container) {
        this.container = container;
        this.selector = new TextSelector(container);
        this.popper = new Popper({container: container});
        this.init();
    }

    init() {
        window.API.getNotes().then(notes => notes.forEach(note => this.selector.highlightSelection(this.selector.unserialize(note.selection))));
        window.API.onContextMenuCommand((command) => {
            this.getItems().forEach(item => {
                item.label === command && item.command();
            });
            window.getSelection().empty();
        });
        this.getItems().forEach(item => window.API.addConTextMenuItem(item));
    }

    getItems() {
        const selector = this.selector;
        return [
            {
                label: 'highlight',
                condition() {
                    let selection = window.getSelection();
                    return !selection.isCollapsed && selection.type === 'Range'
                },
                command() {
                    selector.highlight(window.getSelection());
                }
            }
        ];
    }
}