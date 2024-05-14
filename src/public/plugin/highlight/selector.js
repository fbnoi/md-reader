import { util } from "./util";
import { Stage } from "./stage";
import { Selection } from "./selection";

export class TextSelector {
    constructor(elem) {
        this.container = elem;
        this.stages = [];
        this.selections = [];
        this.eventHandler = { select: [], selectionClick: [] };
        for (let index = 0; index < elem.children.length; index++) {
            const child = elem.children[index];
            this.stages.push(Stage.factory(child));
        }
        this.observeResize();
        this.observeCursor();
        this.observeSelectionClick();
    }

    highlight(selection) {
        if (!selection.isCollapsed && selection.type === 'Range') {
            const range = selection.getRangeAt(0);
            if (!range.collapsed) {
                let select = new Selection(
                    range.startContainer,
                    range.startOffset,
                    range.endContainer,
                    range.endOffset
                );
                if (select.getRects().length > 0) {
                    this.highlightSelection(select);
                }
            }
        }
    }

    highlightSelection(selection) {
        this.selections.push(selection);
        selection.getRects().forEach((rect) => {
            this.highlightRect(rect);
        }, this);
    }

    delightSelection(selection) {
        selection.getRects().forEach((rect) => {
            this.delightRect(rect);
        });
        this.selections.splice(this.selections.indexOf(selection), 1);
    }

    highlightRect(rect) {
        this.stages
            .filter(stage => stage.elem === rect.container)
            .forEach(stage => stage.addBox(rect));
    }

    delightRect(rect) {
        rect.getBox().destroy();
    }

    observeResize() {
        const observer = new ResizeObserver(util.debounce(this._handleResize.bind(this), 250))
        observer.observe(this.container)
    }

    observeCursor() {
        this.container.addEventListener('mousemove', util.debounce(event => {
            this.container.style.cursor = this.selections.filter(selection => {
                return selection.containPoint(event.clientX, event.clientY);
            }).length > 0 ? 'pointer' : 'unset';
        }, 5));
    }

    observeSelectionClick() {
        this.container.addEventListener('click', util.debounce(event => {
            event.stopPropagation();
            let selections = this.selections.filter(selection => {
                return selection.containPoint(event.clientX, event.clientY);
            });
            selections.length > 0 && this.fire('selectionClick', selections[selections.length - 1]);
        }, 5));
    }

    fire(type, ...args) {
        this.eventHandler[type].forEach(handler => {
            handler.call(null, ...args);
        });
    }

    on(type, callable) {
        if (!this.eventHandler.hasOwnProperty(type)) {
            console.error('undefined event type:', type);
            return;
        }
        if (typeof callable !== 'function') {
            console.error('callable must be a function, get', typeof callable);
            return;
        }
        this.eventHandler[type].push(callable);
    }

    serialize(selection) {
        return Selection.serialize(selection);
    }

    unserialize(str) {
        return Selection.unserialize(str);
    }

    _handleResize() {
        this.stages.forEach(stage => {
            stage.clear();
            stage.resize();
        }, this);
        this.selections.forEach((selection) => {
            selection.refreshRects();
            selection.getRects().forEach((rect) => {
                this.highlightRect(rect);
            }, this);
        }, this);
    }
}