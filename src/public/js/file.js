import '../css/grid.css';
import '../css/toc.css';
import '../css/article.css';
import '../css/file-tree.css';

import './common/tool';

import Split from 'split-grid'
import { TextSelector } from '../plugin/noter/noter'

document.addEventListener('DOMContentLoaded', function () {
    new Promise((resolve) => {
        Split({
            columnGutters: [{
                track: 1,
                element: document.querySelector('.gutter-main'),
            }]
        });
        resolve();
    }).then(() => {
        return new URLSearchParams(window.location.search).get('filePath');
    }).then((filePath) => {
        return window.API.readFile(filePath);
    }).then((fileInfo) => {
        document.title = fileInfo.name;
        document.querySelector('.article').innerHTML = fileInfo.doc.html;
        document.querySelector('.category').innerHTML = fileInfo.doc.toc;
    }).then(() => {
        const article = document.querySelector('.article');
        const selector = new TextSelector(article);
        selector.on('select', selection => {
            console.log(selection);
        });
    }).then(() => {
        document.querySelectorAll('a.open-in-browser').forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                window.API.openExternal(link.href);
            });
        });
    });
});
