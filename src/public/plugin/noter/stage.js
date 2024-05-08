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
        this.elem.prepend(this.cc);
        this.elem.classList.add('noter');
        const { width, height } = this.getContainerSize();
        this.rel = new Konva.Stage({
            container: this.cc,
            width, height
        });
        this.layer = new Konva.Layer();
        this.rel.add(this.layer);
        this.rects = {};
        this.boxes = {};
    }

    dispatchEvent(callable) {
        this.elem.addEventListener('click', function(event) {
            event.preventDefault();
            callable(event);
        });
    }

    rectsEvent(rects) {
        for (const id in this.rects) {
            const rect = this.rects[id];
            if (rects.indexOf(rect) !== -1) {
                const box = this.boxes[id];
                box.fire('click', {});
            }
        }
    }

    addBox(rect) {
        const {x, y}  = this.cc.getBoundingClientRect();
        let box = Box.factory(rect.x - x, rect.y - y, rect.width, rect.height);
        box.on('click', (evt) => {
            console.log(evt);
        });
        this.layer.add(box);
        this.boxes[box.id] = box;
        this.rects[box.id] = rect;
    }

    clear() {
        this.layer.destroyChildren();
        this.boxes = {};
        this.rects = {};
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
