import { util } from "./util";

export class Rect {
    constructor(container, x, y, width, height, selection) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.container = container;
        this.selection = selection;
    }

    containPoint(clientX, clientY) {
        let containerRect = this.container.getBoundingClientRect();
        let currentClientX = this.x + containerRect.x;
        let currentClientY = this.y + containerRect.y;

        return currentClientX <= clientX && currentClientX + this.width >= clientX &&
            currentClientY <= clientY && currentClientY + this.height >= clientY;
    }

    getBox() {
        return this.box;
    }

    setBox(box) {
        this.box = box;
    }

    getStage() {
        return this.stage;
    }

    setStage(stage) {
        this.stage = stage;
    }

    getSelection() {
        return this.selection;
    }

    setSelection(selection) {
        this.selection = selection;
    }

    static factory(selection, container, range) {
        let rangeRect = range.getBoundingClientRect();
        let containerRect = container.getBoundingClientRect();

        return new Rect(
            container,
            rangeRect.x - containerRect.x,
            rangeRect.y - containerRect.y,
            rangeRect.width,
            rangeRect.height,
            selection,
        );
    }

    static splitRange(selection, node, startOffset, endOffset) {
        let range = document.createRange();
        range.setStart(node, startOffset);
        let rowTop = util.getCharTop(node, startOffset);
        let container = util.getOutContainer(node, 'noter');
        if ((endOffset - startOffset < 2) || rowTop === util.getCharTop(node, endOffset - 1)) {
            range.setEnd(node, endOffset);
            return [Rect.factory(selection, container, range)];
        } else {
            let last = util.findRowLastChar(rowTop, node, startOffset, endOffset - 1);
            range.setEnd(node, last + 1);
            let others = Rect.splitRange(selection, node, last + 1, endOffset);
            return [Rect.factory(selection, container, range), ...others];
        }
    }
}
