import { util } from "./util";
import { Rect } from "./rect";

export class Selection {
    constructor(startContainer, startOffset, endContainer, endOffset) {
        this.startContainer = startContainer;
        this.startOffset = startOffset;
        this.endContainer = endContainer;
        this.endOffset = endOffset;
        this.rects = this.splitRects();
    }

    static serialize(selection) {
        return JSON.stringify({
            startElemId: selection.startContainer.parentElement.id,
            startOffset: selection.startOffset,
            endElemId: selection.endContainer.parentElement.id,
            endOffset: selection.endOffset,
        });
    }

    static unserialize(str) {
        const obj = JSON.parse(str);
        const startElem = document.getElementById(obj.startElemId);
        const endElem = document.getElementById(obj.endElemId);
        const startContainer = getFirstTextNode(startElem);
        const endContainer = getFirstTextNode(endElem);

        return new Selection(startContainer, obj.startOffset, endContainer, obj.endOffset);
    }

    getRects() {
        return this.rects;
    }

    splitRects() {
        const nodes = util.getTextNodesByDfs(this.startContainer, this.endContainer);
        const rects = [];
        nodes.forEach(node => {
            let start = node === this.startContainer ? this.startOffset : 0;
            let end = node === this.endContainer ? this.endOffset : node.textContent.length;
            rects.push(...Rect.splitRange(node, start, end));
        });
        return rects;
    }

    refreshRects() {
        this.rects = this.splitRects();
    }

    containPoint(x, y) {
        return this.rects.filter(rect => {
            return rect.x <= x && rect.x + rect.width >= x &&
                rect.y <= y && rect.y + rect.height >= y;
        }).length > 0;
    }
}