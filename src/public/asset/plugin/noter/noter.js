(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Noter = factory());
}(this, (function () {
    'use strict';
    // for (let index = 0; index < element.children.length; index++) {
    //     const child = element.children[index];
    //     const cc = document.createElement('div');
    //     cc.style.position = 'absolute';
    //     cc.style.top = '0';
    //     cc.style.left = '0';
    //     cc.style.right = '0';
    //     cc.style.bottom = '0';
    //     cc.style.pointerEvents = 'none';
    //     child.append(cc);
    //     child.classList.add('konva-anchor');
    //     const stage = new Konva.Stage({
    //         container: cc,
    //         width: cc.clientWidth,
    //         height: getContentHeight(cc),
    //     });
    //     const layer = new Konva.Layer();
    //     stage.add(layer);
    //     child.addEventListener('mouseup', () => {
    //         const aaa = child.getBoundingClientRect();
    //         const {
    //             startContainer, // 起始节点
    //             startOffset, // 起始节点偏移量
    //             endContainer, // 终止节点
    //             endOffset // 终止节点偏移量
    //         } = document.getSelection().getRangeAt(0);
    //         console.log(startContainer.parentElement.childNodes);
    //         console.log(startContainer);
    //         console.log(endContainer.parentElement);
    //         // 创建一个 range 对象
    //         const range = document.createRange()
    //         // 设置需要获取位置信息的文本节点以及偏移量
    //         range.setStart(startContainer, startOffset)
    //         range.setEnd(endContainer, endOffset)
    //         // 通过 getBoundingClientRect 获取位置信息
    //         const rect = range.getBoundingClientRect();
    //         // create shape
    //         const box = new Konva.Rect({
    //             x: rect.x - aaa.x,
    //             y: rect.y - aaa.y,
    //             // x:0,
    //             // y:0,
    //             width: rect.width,
    //             height: rect.height,
    //             fill: '#00D2FF',
    //             stroke: 'black',
    //             strokeWidth: 4,
    //             draggable: true,
    //         });
    //         layer.add(box);
    //         // add cursor styling
    //         box.on('mouseover', function () {
    //             document.body.style.cursor = 'pointer';
    //         });
    //         box.on('mouseout', function () {
    //             document.body.style.cursor = 'default';
    //         });
    //     });
    // }

    const Noter = function Noter(elem) {
        this.layers = {};
        this.container = elem;
        for (let index = 0; index < elem.children.length; index++) {
            this._addStages(elem.children[index]);
            elem.children[index].addEventListener('mouseup', () => {
                this.highlightRanges(this.getSelectionRanges());
            });
        }
    }

    Noter.prototype.getSelectionRanges = function () {
        const { startContainer, startOffset, endContainer, endOffset } = document.getSelection().getRangeAt(0);
        const nodes = getTextNodesByDfs(startContainer, endContainer);
        const ranges = [];
        nodes.forEach(node => {
            let start = node === startContainer ? startOffset : 0;
            let end = node === endContainer ? endOffset : node.textContent.length;
            ranges.push(...splitRange(node, start, end));
        });
        return ranges;
    }

    Noter.prototype.highlightRanges = function (rects) {
        rects.forEach(rect => {
            let textContainer = document.getElementById(rect.textContainerId);
            let noterContainer = textContainer.classList.contains('konva-anchor') ?
                textContainer : getParentByClass(textContainer, 'konva-anchor');
                console.log(noterContainer);
            let layer = this.layers[noterContainer.id];
            if (layer) {
                const range = document.createRange();
                let textNode = getFirstTextNode(textContainer);
                range.setStart(textNode, rect.startOffset);
                range.setEnd(textNode, rect.endOffset);
                let nc = noterContainer.getBoundingClientRect();
                let sc = range.getBoundingClientRect();
                console.log(sc.x - nc.x, sc.y - nc.y);
                const box = new Konva.Rect({
                    x: sc.x - nc.x,
                    y: sc.y - nc.y,
                    width: sc.width,
                    height: sc.height,
                    fill: '#00D2FF',
                    stroke: 'black',
                    strokeWidth: 4,
                    draggable: true,
                });
                layer.add(box);
            }
        });
    }

    Noter.prototype.removeRanges = function (ranges) {
    }

    Noter.prototype._addStages = function (elem) {
        const cc = document.createElement('div');
        cc.style.position = 'absolute';
        cc.style.top = '0';
        cc.style.left = '0';
        cc.style.right = '0';
        cc.style.bottom = '0';
        cc.style.pointerEvents = 'none';
        elem.append(cc);
        elem.classList.add('konva-anchor');
        const stage = new Konva.Stage({
            container: cc,
            width: cc.clientWidth,
            height: getContentHeight(cc),
        });
        const layer = new Konva.Layer();
        stage.add(layer);
        this.layers[elem.id] = layer;
    }

    function highlightRange(rect) {
        // const textContainer = 
    }

    function removeHighlightRange(rect) {

    }

    function getContentHeight(element) {
        return Math.max(element.scrollHeight, element.clientHeight);
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

    function splitRange(node, startOffset, endOffset) {
        const range = document.createRange();
        const rowTop = getCharTop(node, startOffset);
        if ((endOffset - startOffset < 2) || rowTop === getCharTop(node, endOffset - 1)) {
            range.setStart(node, startOffset);
            range.setEnd(node, endOffset);
            return [rectFactory(range)];
        } else {
            const last = findRowLastChar(rowTop, node, startOffset, endOffset - 1);
            range.setStart(node, startOffset);
            range.setEnd(node, last + 1);
            const others = splitRange(node, last + 1, endOffset);
            return [rectFactory(range), ...others];
        }
    }

    function rectFactory(range) {
        return {
            // id: 
            textContainerId: range.startContainer.parentElement.id,
            startOffset: range.startOffset,
            endOffset: range.endOffset,
        };
    }

    function findRowLastChar(top, node, start, end) {
        if (end - start === 1) {
            return getCharTop(node, end) === top ? end : start;
        }
        const mid = (end + start) >> 1;
        return getCharTop(node, mid) === top
            ? findRowLastChar(top, node, mid, end)
            : findRowLastChar(top, node, start, mid);
    }

    function getCharTop(node, offset) {
        return getCharRect(node, offset).top;
    }

    function getCharRect(node, offset) {
        const range = document.createRange();
        range.setStart(node, offset);
        let length = node.textContent ? node.textContent.length : 0;
        range.setEnd(node, offset + 1 > length ? offset : offset + 1);
        return range.getBoundingClientRect();
    }

    function getParentByClass(elem, className) {
        var parent = elem.parentElement;
        while (parent && parent !== document) {
            if (parent.classList.contains(className)) {
                return parent;
            }
            parent = parent.parentNode;
        }
        return null;
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