import { Box } from "./box";
import Konva from "konva";

export class Stage {
    constructor(elem) {
        this.elem = elem;
        this.cc = document.createElement('div');
        this.cc.style.position = 'absolute';
        this.cc.style.inset = '0';
        this.cc.style.overflow = 'hidden';
        this.cc.style.zIndex = -1;
        this.elem.classList.add('noter');
        this.elem.prepend(this.cc);
        const { width, height } = this.getContainerSize();
        this.rel = new Konva.Stage({
            container: this.cc,
            width, height
        });
        this.layer = new Konva.Layer();
        this.rel.add(this.layer);
    }

    addBox(rect) {
        let box = Box.factory(rect.x, rect.y, rect.width, rect.height);
        rect.setBox(box);
        this.layer.add(box);
    }

    clear() {
        this.layer.destroyChildren();
    }

    getContainerSize() {
        return this.cc.getBoundingClientRect();
    }

    resize() {
        const { width, height } = this.getContainerSize();
        this.rel.size({width: width, height: height});
    }

    static factory(elem) {
        return new Stage(elem);
    }
}
