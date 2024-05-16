import '../css/grid.css';
import '../css/toc.css';
import '../css/article.css';
import '../css/file-tree.css';

import './common/tool';

import { Dree } from "../plugin/dree/dree";
import Split from 'split-grid';
import util from './common/util';
import Noter from "./common/noter";

util.ready(() => {
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
        return window.API.setOpenedFileCache(filepath)
            .then(() => window.API.readFile(filepath))
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
            })
            .then(() => new Noter(document.querySelector('.article')));
    }

    const dirPath = new URLSearchParams(window.location.search).get('dirPath');
    window.API.readDir(dirPath)
        .then((nodes) => {
            new Dree(nodes, {
                element: document.querySelector('.file-tree'),
                onSelect: (node) => {
                    if (node.type != 1) {
                        readFile(node.path);
                    }
                    window.API.setSelectedPathCache(node.path);
                },
                onExpand: (node) => window.API.addOpenDirCache(node.path),
                onFold: (node) => window.API.removeOpenDirCache(node.path),
            });
        })
        .then(() => window.API.getOpenedFileCache())
        .then((filepath) => filepath && readFile(filepath))
        .then(() => {
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
        });

    window.addEventListener('resize', splitResize);
});
