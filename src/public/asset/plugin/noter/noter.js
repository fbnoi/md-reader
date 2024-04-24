(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Noter = factory());
}(this, (function () {
    'use strict';

    class Rect {
        constructor(containerId, x, y, width, height) {
            this.containerId = containerId;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }

        static Factory(containerId, range) {
            const {x, y, width, height} = range.getBoundingClientRect();

            return new Rect(containerId, x, y, width, height);
        }
    }
    
    class Box {
        static Factory(x, y, width, height) {
            return new Konva.Rect({
                x, y, width, height,
                fill: '#00D2FF',
                draggable: false,
                opacity: 0.3
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
            const nodes = getTextNodesByDfs(this.startContainer, this.endContainer);
            const rects = [];
            nodes.forEach(node => {
                let start = node === this.startContainer ? this.startOffset : 0;
                let end = node === this.endContainer ? this.endOffset : node.textContent.length;
                rects.push(...Selection.splitRange(node, start, end));
            });
            return rects;
        }

        static splitRange(node, startOffset, endOffset) {
            const range = document.createRange();
            range.setStart(node, startOffset);
            const rowTop = Selection.getCharTop(node, startOffset);
            const id = Stage.getOutContainer(node).id;
            if ((endOffset - startOffset < 2) || rowTop === Selection.getCharTop(node, endOffset - 1)) {
                range.setEnd(node, endOffset);
                return [Rect.Factory(id, range)];
            } else {
                const last = Selection.findRowLastChar(rowTop, node, startOffset, endOffset - 1);
                range.setEnd(node, last + 1);
                const others = Selection.splitRange(node, last + 1, endOffset);
                return [Rect.Factory(id, range), ...others];
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
            this.cc.style.overflow = 'hidden';
            this.elem.append(this.cc);
            this.elem.classList.add('noter');
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

        static getOutContainer(elem) {
            var parent = elem.parentElement;
            while (parent && parent !== document) {
                if (parent.classList.contains('noter')) {
                    return parent;
                }
                parent = parent.parentNode;
            }
            return null;
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
            this.selections = [];
            for (let index = 0; index < elem.children.length; index++) {
                const child = elem.children[index];
                this.stages.push(Stage.Factory(child));
            }
            this.observeResize();
            
        }

        highlightSelection(selection) {
            this.selections.push(selection);
            selection.getRects().forEach((rect) => {
                this.highlightRect(rect);
            }, this);
        }

        highlightRect(rect) {
            this.stages
                .filter(stage => {
                    return stage.elem.id === rect.containerId || stage.elem.querySelector(`[id="${rect.containerId}"]`) !== null;
                })
                .forEach(stage => {
                    stage.addBox(rect);
                });
        }

        getSelection() {
            const selection = document.getSelection();
            const range = selection.getRangeAt(0);
            if (!selection.isCollapsed && !range.collapsed) {
                return new Selection(
                    range.startContainer, 
                    range.startOffset, 
                    range.endContainer, 
                    range.endOffset
                );
            }
            
            return null;
        }
        
        observeResize() {
            const observer = new ResizeObserver(debounce(this.handleResize.bind(this), 250))
            observer.observe(this.container)
        }

        handleResize() {
            this.stages.forEach(stage => {
                stage.clear();
                stage.resize();
            }, this);
            this.selections.forEach((selection) => {
                selection.getRects().forEach((rect) => {
                    this.highlightRect(rect);
                }, this);
            }, this);
        }

        serialize(selection) {
            return Selection.serialize(selection);
        }

        unserialize(str) {
            return Selection.unserialize(str);
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