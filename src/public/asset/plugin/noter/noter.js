(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Noter = factory());
}(this, (function () {
    'use strict';

    class Rect {
        constructor(x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }

        static Factory(range) {
            const {x, y, width, height} = range.getBoundingClientRect();

            return new Rect(x, y, width, height);
        }
    }
    
    class Box {
        static Factory(x, y, width, height) {
            return new new Konva.Rect({
                x, y, width, height,
                fill: '#00D2FF',
                stroke: 'black',
                strokeWidth: 4,
                draggable: true,
            });
        }
    }

    class Selection {
        constructor(startContainer, startOffset, endContainer, endOffset) {
            this.startContainer = startContainer;
            this.startOffset = startOffset;
            this.endContainer = endContainer;
            this.endOffset = endOffset;
        }

        getRects() {
            const nodes = getTextNodesByDfs(this.startContainer, this.endContainer);
            const rects = [];
            nodes.forEach(node => {
                let start = node === this.startContainer ? this.startOffset : 0;
                let end = node === this.endContainer ? this.endOffset : node.textContent.length;
                rects.push(...Selection.SplitRange(node, start, end));
            });
            return rects;
        }

        static SplitRange(node, startOffset, endOffset) {
            const range = document.createRange();
            range.setStart(node, startOffset);
            const rowTop = Selection.getCharTop(node, startOffset);
            if ((endOffset - startOffset < 2) || rowTop === Selection.getCharTop(node, endOffset - 1)) {
                range.setEnd(node, endOffset);
                return [Rect.Factory(range)];
            } else {
                const last = Selection.findRowLastChar(rowTop, node, startOffset, endOffset - 1);
                range.setEnd(node, last + 1);
                const others = Selection.SplitRange(node, last + 1, endOffset);
                return [Rect.Factory(range), ...others];
            }
        }

        static findRowLastChar(top, node, start, end) {
            if (end - start === 1) {
                return Selection.getCharTop(node, end) === top ? end : start;
            }
            const mid = (end + start) >> 1;
            return Selection.getCharTop(node, mid) === top
                ? Selection.findRowLastChar(top, node, mid, end)
                : Selection.findRowLastChar(top, node, start, mid);
        }
    
        static getCharTop(node, offset) {
            return Selection.getCharRect(node, offset).top;
        }
    
        static getCharRect(node, offset) {
            const range = document.createRange();
            range.setStart(node, offset);
            let length = node.textContent ? node.textContent.length : 0;
            range.setEnd(node, offset + 1 > length ? offset : offset + 1);
            return range.getBoundingClientRect();
        }

        static getFirstTextNode(node) {
            for (var i = 0; i < node.childNodes.length; i++) {
                var childNode = node.childNodes[i];
                if (childNode.nodeType === Node.TEXT_NODE && childNode.nodeValue.trim() !== '') {
                    return childNode;
                } else if (childNode.nodeType === Node.ELEMENT_NODE) {
                    var result = getFirstTextNode(childNode);
                    if (result) {
                        return result;
                    }
                }
            }
            return null;
        }
    }

    class Stage {
        constructor(elem) {
            this.boxes = [];
            this.elem = elem;
            this.cc = document.createElement('div');
            this.cc.style.position = 'absolute';
            this.cc.style.top = '0';
            this.cc.style.left = '0';
            this.cc.style.right = '0';
            this.cc.style.bottom = '0';
            this.cc.style.pointerEvents = 'none';
            this.elem.append(this.cc);
            const { width, height } = this.getContainerSize();
            this.rel = new Konva.Stage({
                container: this.cc,
                width, height
            });
            this.layer = new Konva.Layer();
            this.rel.add(this.layer);
        }

        addBox(rect) {
            const {x, y}  = this.cc.getBoundingClientRect();
            const box = Box.Factory(rect.x - x, rect.y - y, rect.width, rect.height);
            this.layer.add(box);
        }

        clear() {
            this.layer.destroyChildren();
        }

        redrew() {
            this.resize();
        }

        getContainerSize() {
            return this.cc.getBoundingClientRect();
        }

        resize() {
            const { width, height } = this.getContainerSize();
            this.rel.size({width: width, height: height});
        }

        static Factory(elem) {
            return new Stage(elem);
        }
    }

    function debounce(func, wait) {  
        let timeout;
        return function() {  
            const context = this;  
            const args = arguments;  
            clearTimeout(timeout);  
            timeout = setTimeout(function() {  
                func.apply(context, args);  
            }, wait);  
        };  
    }

    class Noter {
        constructor(elem) {
            this.container = elem;
            this.stages = [];
            for (let index = 0; index < elem.children.length; index++) {
                const child = elem.children[index];
                this.stages.push(Stage.Factory(child));
            }
            this.observeResize();
            this.rects = [];
        }

        addHighlights(rects) {
            this.rects.push(...rects);
            rects.forEach((rect) => this.highlightRect(rect), this);
        }

        highlightRect(rect) {
            this.stages
                .filter(stage => {
                    return stage.elem.id === rect.id || stage.elem.querySelector(`[id="${rect.id}"]`) !== null;
                })
                .forEach(stage => {
                    stage.addBox(rect);
                });
        }

        getSelectionRects() {
            const { startContainer, startOffset, endContainer, endOffset } = document.getSelection().getRangeAt(0);
            const nodes = getTextNodesByDfs(startContainer, endContainer);
            const rects = [];
            nodes.forEach(node => {
                let start = node === startContainer ? startOffset : 0;
                let end = node === endContainer ? endOffset : node.textContent.length;
                rects.push(...Rect.SplitRange(node, start, end));
            });
            return rects;
        }
        
        observeResize() {
            const observer = new ResizeObserver(debounce(this.handleResize.bind(this), 250))
            observer.observe(this.container)
        }

        handleResize() {
            this.stages.forEach(stage => stage.redrew(), this);
        }
    }

    function getTextNodesByDfs(start, end) {
        if (start === end) return [start];
        const iterator = nodeDfsGenerator(start, false);
        const textNodes = [];
        let node = iterator.next();
        let value = node.value;
        while (value && value !== end) {
            if (value.nodeType === Node.TEXT_NODE) {
                !/^\n$/.test(value.textContent) &&
                    !/^$/.test(value.textContent) &&
                    textNodes.push(value);
            }
            value = iterator.next().value;
        }
        if (!value) {
            return []
        }
        textNodes.push(end);
        return textNodes;
    }

    function* nodeDfsGenerator(node, isGoBack = false) {
        yield node
        if (!isGoBack && node.childNodes.length > 0) {
            yield* nodeDfsGenerator(node.childNodes[0], false)
        } else if (node.nextSibling) {
            yield* nodeDfsGenerator(node.nextSibling, false)
        } else if (node.parentNode) {
            yield* nodeDfsGenerator(node.parentNode, true)
        }
    }

    function getFirstTextNode(node) {
        for (var i = 0; i < node.childNodes.length; i++) {
            var childNode = node.childNodes[i];
            if (childNode.nodeType === Node.TEXT_NODE && childNode.nodeValue.trim() !== '') {
                return childNode;
            } else if (childNode.nodeType === Node.ELEMENT_NODE) {
                var result = getFirstTextNode(childNode);
                if (result) {
                    return result;
                }
            }
        }
        return null;
    }

    function index(element, options) { return new Noter(element, options); }

    return index;

})));