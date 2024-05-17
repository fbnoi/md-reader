import { TextSelector } from '../../plugin/highlight/selector';
import menu from './menu';

export default class Noter {
    constructor(container) {
        this.container = container;
        this.selector = new TextSelector(container);
        menu.clearContextMenuItems();
        menu.setContextMenuItems([
            {
                label: 'highlight',
                command: () => {
                    let selection = this.selector.generateSelection(window.getSelection());
                    if (selection) {
                        window.API.addNote(this.selector.serialize(selection), '')
                        .then(() => {
                            this.selector.highlightSelection(selection);
                        });
                    }
                },
                condition: () => {
                    let selection = window.getSelection();
                    return !selection.isCollapsed && selection.type === 'Range';
                },
            },
            {
                label: 'remove highlight',
                command: (context) =>{
                    let hltSelection = this.selector.getHighlightSelection(context.x, context.y);
                    if (hltSelection) {
                        window.API.removeNote(this.selector.serialize(hltSelection))
                        .then(() => {
                            this.selector.removeHighlight(hltSelection);
                        });
                    }
                },
                condition: (context) =>{
                    return null !== this.selector.getHighlightSelection(context.x, context.y);
                },
            }
        ]);
        window.API.getNotes()
        .then(notes => {
            notes.forEach(note => {
                this.selector.highlightSelection(this.selector.unserialize(note.selection))
            })
        });
    }
}