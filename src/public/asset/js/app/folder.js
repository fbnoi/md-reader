document.addEventListener('DOMContentLoaded', function () {
    new Promise((resolve) => {
        Split({
            columnGutters: [{
                track: 1,
                element: document.querySelector('.gutter-main'),
            }],
            rowGutters: [{
                track: 1,
                element: document.querySelector('.gutter-side'),
            }]
        });
        resolve();
    }).then(() => {
        return new URLSearchParams(window.location.search).get('dirPath');
    }).then((dirPath) => {
        return window.API.openDir(dirPath);
    }).then((html) => {
        document.querySelector('.file-tree').innerHTML = html;
        return;
    }).then(() => {
        document.querySelector('.file-tree a[property-type="2"]').addEventListener('click', function() {
            const filePath = this.getAttribute('property-path');
            new Promise(resolve => {
                resolve(window.API.openFile(filePath));
            }).then((fileInfo) => {
                document.title = fileInfo.name;
                document.querySelector('.article').innerHTML = fileInfo.doc.html;
                document.querySelector('.category').innerHTML = fileInfo.doc.toc;
            });;
        });
    });
});