export class util {
    static debounce(func, wait) {
        let timeout;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                func.apply(context, args);
            }, wait);
        };
    }

    static getOutContainer(elem, selector) {
        var parent = elem.parentElement;
        while (parent && parent !== document) {
            if (parent.classList.contains(selector)) {
                return parent;
            }
            parent = parent.parentElement;
            
        }
        return null;
    }

    static findRowLastChar(top, node, start, end) {
        if (end - start === 1) {
            return util.getCharTop(node, end) === top ? end : start;
        }
        const mid = (end + start) >> 1;
        return util.getCharTop(node, mid) === top
            ? util.findRowLastChar(top, node, mid, end)
            : util.findRowLastChar(top, node, start, mid);
    }

    static getCharTop(node, offset) {
        return util.getCharRect(node, offset).top;
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
                var result = util.getFirstTextNode(childNode);
                if (result) {
                    return result;
                }
            }
        }
        return null;
    }

    static getTextNodesByDfs(start, end) {
        if (start === end) return [start];
        const iterator = util.nodeDfsGenerator(start, false);
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

    static *nodeDfsGenerator(node, isGoBack = false) {
        yield node
        if (!isGoBack && node.childNodes.length > 0) {
            yield* util.nodeDfsGenerator(node.childNodes[0], false)
        } else if (node.nextSibling) {
            yield* util.nodeDfsGenerator(node.nextSibling, false)
        } else if (node.parentNode) {
            yield* util.nodeDfsGenerator(node.parentNode, true)
        }
    }

    static getFirstTextNode(node) {
        for (var i = 0; i < node.childNodes.length; i++) {
            var childNode = node.childNodes[i];
            if (childNode.nodeType === Node.TEXT_NODE && childNode.nodeValue.trim() !== '') {
                return childNode;
            } else if (childNode.nodeType === Node.ELEMENT_NODE) {
                var result = util.getFirstTextNode(childNode);
                if (result) {
                    return result;
                }
            }
        }
        return null;
    }
}