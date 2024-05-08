(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Popper = factory());
}(this, (function () {
    'use strict';
    class Popper {
        constructor(options) {
            this.div = this.factory(options);
            this.clientX = options.position.x;
            this.clientY = options.position.y;
            this.updatePosition(options.position);
            document.body.appendChild(this.div);
        }

        factory(options) {
            const div = document.createElement('div');
            // div.classList.add(...options.class);
            if (options.textContent) {
                div.textContent = options.textContent;
            } else if (options.htmlContent) {
                div.innerHTML = options.htmlContent;
            } else if (options.elem) {
                div.append(options.elem.cloneNode());
                options.elem.remove();
            }
            div.style.position = 'absolute';
            div.style.display = 'none';
            return div;
        }

        updatePosition(position) {
            if (position.x) {
                this.clientX = position.x;
            }
            if (position.y) {
                this.clientY = position.y;
            }
            this.div.style.top = (this.clientY + (this.clientY < 30 * 2 ? 1 : -1) * 30) + 'px';
            this.div.style.left = (this.clientX - 30) + 'px';
        }

        show() {
            this.div.style.display = 'block';
        }

        hide() {
            this.div.style.display = 'none';
        }
    }

    function index(options) { return new Popper(options); }

    return index;
})));