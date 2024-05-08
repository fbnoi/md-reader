import { util } from "./util";

export class Rect {
    constructor(containerId, x, y, width, height) {
        this.containerId = containerId;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    static factory(containerId, range) {
        const {x, y, width, height} = range.getBoundingClientRect();
        return new Rect(containerId, x, y, width, height);
    }

    static splitRange(node, startOffset, endOffset) {
        const range = document.createRange();
        range.setStart(node, startOffset);
        const rowTop = util.getCharTop(node, startOffset);
        const id = util.getOutContainer(node, '.noter').id;
        if ((endOffset - startOffset < 2) || rowTop === util.getCharTop(node, endOffset - 1)) {
            range.setEnd(node, endOffset);
            return [Rect.factory(id, range)];
        } else {
            const last = util.findRowLastChar(rowTop, node, startOffset, endOffset - 1);
            range.setEnd(node, last + 1);
            const others = Rect.splitRange(node, last + 1, endOffset);
            return [Rect.factory(id, range), ...others];
        }
    }
}
