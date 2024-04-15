(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Noter = factory());
}(this, (function () {
    'use strict';

    var Noter = function Noter(element, options) {
        for (let index = 0; index < element.children.length; index++) {
            const child = element.children[index];
            const cc = document.createElement('div');
            cc.style.position = 'absolute';
            cc.style.top = '0';
            cc.style.left = '0';
            cc.style.right = '0';
            cc.style.bottom = '0';
            cc.style.pointerEvents = 'none';
            child.append(cc);
            const aaa = child.getBoundingClientRect();
            const stage = new Konva.Stage({
                container: cc,
                width: cc.clientWidth,
                height: getContentHeight(cc),
            });
            const layer = new Konva.Layer();
            stage.add(layer);
            // console.log(aaa);
            // var box = new Konva.Rect({
            //     x: 0,
            //     y: 0,
            //     width: 20,
            //     height: 20,
            //     fill: '#00D2FF',
            //     stroke: 'black',
            //     strokeWidth: 4,
            //     draggable: true,
            // });
            // layer.add(box);
            // // return;
            // continue;
            child.addEventListener('mouseup', () => {
                const {
                    startContainer, // 起始节点
                    startOffset, // 起始节点偏移量
                    endContainer, // 终止节点
                    endOffset // 终止节点偏移量
                } = document.getSelection().getRangeAt(0);
                // 创建一个 range 对象
                const range = document.createRange()
                // 设置需要获取位置信息的文本节点以及偏移量
                range.setStart(startContainer, startOffset)
                range.setEnd(startContainer, endOffset)
                // 通过 getBoundingClientRect 获取位置信息
                const rect = range.getBoundingClientRect();
                console.log(aaa.x, aaa.y, rect.x, rect.y);
                console.log(rect.x - aaa.x, rect.y - aaa.y);
                // create shape
                const box = new Konva.Rect({
                    x: rect.x - aaa.x,
                    y: rect.y + element.scrollTop - aaa.y,
                    width: rect.width,
                    height: rect.height,
                    fill: '#00D2FF',
                    stroke: 'black',
                    strokeWidth: 4,
                    draggable: true,
                });
                layer.add(box);
                // add cursor styling
                box.on('mouseover', function () {
                    document.body.style.cursor = 'pointer';
                });
                box.on('mouseout', function () {
                    document.body.style.cursor = 'default';
                });
            });
        }
        function getContentHeight(element) {
            // scrollHeight 是元素内容的总高度（包括不可见部分）  
            // clientHeight 是元素内部的可视高度（不包括滚动条）  
            const scrollHeight = element.scrollHeight;
            const clientHeight = element.clientHeight;

            // 如果 scrollHeight 大于 clientHeight，说明内容被裁剪了  
            if (scrollHeight > clientHeight) {
                return scrollHeight; // 返回内容总高度，即使部分内容被隐藏  
            } else {
                return clientHeight; // 返回可见内容的高度  
            }
        }
    }

    function index(element, options) { return new Noter(element, options); }

    return index;

})));