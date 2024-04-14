(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Dree = factory());
}(this, (function () {
    'use strict';

    const TYPE_DIR = 1;
    const defaultOptions = {
        element: null,
        expandedClass: 'expanded',
        selectedClass: 'selected',
        onSelect: (node) => { },
        onExpand: (node) => { },
        onFold: (node) => { },
    };

    var mergeOptions = (options) => {
        if (!options.element) {
            throw 'options.element is required';
        }

        if (!options.element instanceof HTMLLIElement) {
            throw 'options.element must be a HTMLLIElement';
        }
        !options.expandedClass && (options.expandedClass = defaultOptions.expandedClass);
        !options.selectedClass && (options.selectedClass = defaultOptions.selectedClass);
        if (options.onSelect && typeof options.onSelect != 'function') {
            throw 'options.onSelect must be a function';
        }
        if (options.onExpand && typeof options.onExpand != 'function') {
            throw 'options.onExpand must be a function';
        }
        if (options.onFold && typeof options.onFold != 'function') {
            throw 'options.onFold must be a function';
        }
        return options;
    }

    var Dree = function Dree(nodes, options) {
        options = mergeOptions(options);
        this.nodes = nodes;
        this.element = options.element;
        this.selectedNode = null;
        this.options = options;

        let selectNode = (node, fire = true) => {
            this.selectedNode && this.selectedNode.dom.querySelector('a').classList.remove(this.options.selectedClass);
            this.selectedNode = node;
            node.dom.querySelector('a').classList.add(this.options.selectedClass);
            fire && this.options.onSelect && this.options.onSelect(node);
        }

        let toggleNodeExpanded = (node) => {
            selectNode(node, false);
            if (node.type == TYPE_DIR) {
                let i = node.dom.querySelector('a i');
                node.expanded = !node.dom.classList.contains(this.options.expandedClass);
                if (node.expanded) {
                    node.dom.classList.add(this.options.expandedClass);
                    i.classList.remove('fa-folder');
                    i.classList.add('fa-folder-open');
                } else {
                    node.dom.classList.remove(this.options.expandedClass);
                    i.classList.add('fa-folder');
                    i.classList.remove('fa-folder-open');
                }
                let fn = node.expanded ? this.options.onExpand : this.options.onFold;
                fn && fn(node);
            }
        }

        let render = (nodes, options) => {
            let ul = document.createElement('ul');
            nodes.forEach(node => {
                let li = document.createElement('li');
                node.expanded && li.classList.add(options.expandedClass);
                let a = document.createElement('a');
                this.selectedNode = node.selected ? node : null;
                node.selected && a.classList.add(options.selectedClass);
                let i = document.createElement('i');
                a.text = node.name;
                let iClass = node.type === TYPE_DIR ? (options.expanded ? "fa-folder-open" : "fa-folder") : "fa-file";
                i.classList.add('fa-regular', iClass);
                a.prepend(i);
                li.append(a);
                li.parentElement
                node.type === TYPE_DIR && li.append(render(node.children, {
                    expandedClass: node.expandedClass,
                    selectedClass: options.selectedClass,
                    onClick: options.onClick,
                }));
                node.dom = li;
                ul.append(li);
                a.addEventListener('click', () => selectNode(node));
                a.addEventListener('dblclick', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    if (node.type === TYPE_DIR) {
                        toggleNodeExpanded(node);
                    }
                    
                });
            });
            return ul;
        };
        let container = document.createElement('div');
        container.classList.add('tree-container');
        container.append(render(nodes, {
            expandedClass: this.options.expandedClass,
            selectedClass: this.options.selectedClass,
        }));
        this.element.append(container);
    }

    function index(nodes, options) { return new Dree(nodes, options); }

    return index;
})));