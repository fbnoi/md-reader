import Konva from "konva";

export class Box {
    static factory(x, y, width, height) {
        return new Konva.Rect({
            x, y, width, height,
            fill: '#00D2FF',
            draggable: false,
            opacity: 0.6,
        });
    }
}
