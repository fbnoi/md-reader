(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Noter = factory());
}(this, (function () {
    'use strict';

    var Noter = function Noter(element, options) {
        element.addEventListener('mouseup', () => {
            const {
                startContainer, // 起始节点
                startOffset, // 起始节点偏移量
                endContainer, // 终止节点
                endOffset // 终止节点偏移量
            } = document.getSelection().getRangeAt(0);
            console.log(startContainer.parentElement, startOffset, endContainer.parentElement, endOffset);
        });
    }
        
    function index(element, options) { return new Noter(element, options); }

    return index;
    
})));