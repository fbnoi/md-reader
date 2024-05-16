import '../css/grid.css';
import '../css/toc.css';
import '../css/article.css';
import '../css/file-tree.css';

import './common/tool';

import Split from 'split-grid';
import util from './common/util';
import Noter from "./common/noter";

util.ready(() => {
    let filepath = new URLSearchParams(window.location.search).get('filePath');
    window.API.setOpenedFileCache(filepath)
        .then(() => window.API.readFile(filepath))
        .then((fileInfo) => {
            document.title = fileInfo.name;
            document.querySelector('.article').innerHTML = fileInfo.doc.html;
            document.querySelector('.category').innerHTML = fileInfo.doc.toc;
        })
        .then(() => {
            new Noter(document.querySelector('.article'));
        })
        .then(() => {
            document.querySelectorAll('a.open-in-browser').forEach((link) => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.API.openExternal(link.href);
                });
            });
        })
        .then(() => {
            Split({
                columnGutters: [{
                    track: 1,
                    element: document.querySelector('.gutter-main'),
                }]
            });
        });
});
