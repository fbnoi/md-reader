import { TextSelector } from '../../plugin/highlight/selector';
import { Popper } from '../../plugin/popper/popper';

class MenuItem {
    constructor(label, command, condition) {
        this.label = label;
        this.command = () => {
            console.log(this.context);
            command(this.context);
        };
        this.condition = (e) => {
            this.context = e;
            return condition(e);
        };
    }
}

export default class Noter {
    constructor(container) {
        this.container = container;
        this.selector = new TextSelector(container);
        this.popper = new Popper({container: container});
        this.init();
    }

    init() {
        this.items = [
            new MenuItem(
                'highlight',
                () => {
                    let selection = this.selector.generateSelection(window.getSelection());
                    if (selection) {
                        window.API.addNote(this.selector.serialize(selection), '')
                        .then(() => {
                            this.selector.highlightSelection(selection);
                        });
                    }
                },
                () => {
                    let selection = window.getSelection();
                    return !selection.isCollapsed && selection.type === 'Range';
                },
            ),
            new MenuItem(
                'remove highlight',
                (context) => {
                    let hltSelection = this.selector.getHighlightSelection(context.x, context.y);
                    if (hltSelection) {
                        window.API.removeNote(this.selector.serialize(hltSelection))
                        .then(() => {
                            this.selector.removeHighlight(hltSelection);
                        });
                    }
                },
                (context) => {
                    return null !== this.selector.getHighlightSelection(context.x, context.y);
                },
            ),
        ]
        window.API.getNotes()
        .then(notes => {
            notes.forEach(note => {
                this.selector.highlightSelection(this.selector.unserialize(note.selection))
            })
        });
        window.API.onContextMenuCommand((command) => {
            this.items.forEach(item => {
                item.label === command && item.command();
            });
            window.getSelection().empty();
        });
        window.API.setContextMenuItems(this.items);
    }
}