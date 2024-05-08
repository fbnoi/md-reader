import '../css/grid.css';
import '../css/toc.css';
import '../css/article.css';
import '../css/file-tree.css';

import './lib/tool';

import { Dree } from "../plugin/dree/dree";
import Split from 'split-grid'

document.addEventListener('DOMContentLoaded', function () {
    let initialed = false;
    let radio = 0;
    const sideViewElem = document.querySelector('.side-view');
    const categoryElem = document.querySelector('.side-view .category');
    const articleElem = document.querySelector('.main-view .article');

    function splitResize() {
        sideViewElem.style['grid-template-rows'] = '1fr 5px ' + sideViewElem.clientHeight * radio + 'px';
    }
    function updateRadio() {
        radio = categoryElem.clientHeight / sideViewElem.clientHeight;
    }
    function readFile(filepath) {
        window.API.readFile(filepath)
            .then((fileInfo) => {
                document.title = fileInfo.name;
                articleElem.innerHTML = fileInfo.doc.html;
                articleElem.scrollTop = 0;;
                categoryElem.innerHTML = fileInfo.doc.toc;
                if (!initialed) {
                    initialed = true;
                    radio = 0.5;
                    splitResize();
                }
            })
            .then(() => {
                document.querySelectorAll('a.open-in-browser').forEach((link) => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        window.API.openExternal(link.href);
                    });
                });
            });
    }
    new Promise((resolve) => {
        Split({
            columnGutters: [{
                track: 1,
                element: document.querySelector('.gutter-main'),
            }],
            rowGutters: [{
                track: 1,
                element: document.querySelector('.gutter-side'),
            }],
            onDragEnd: function (direction, track) {
                if (direction === 'row' && track === 1) {
                    updateRadio();
                }
            }
        });
        resolve();
    }).then(() => {
        return new URLSearchParams(window.location.search).get('dirPath');
    }).then((dirPath) => {
        return window.API.readDir(dirPath);
    }).then((nodes) => {
        new Dree(nodes, {
            element: document.querySelector('.file-tree'),
            onSelect: (node) => {
                if (node.type != 1) {
                    readFile(node.path);
                    window.API.setOpenedFileCache(node.path);
                }
                window.API.setSelectedPathCache(node.path);
            },
            onExpand: (node) => window.API.addOpenDirCache(node.path),
            onFold: (node) => window.API.removeOpenDirCache(node.path),
        });
        return;
    }).then(() => {
        window.API.getOpenedFileCache()
            .then((filepath) => filepath && readFile(filepath));
    });

    window.addEventListener('resize', splitResize);
});
