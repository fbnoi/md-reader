document.addEventListener('DOMContentLoaded', function () {
    let initialed = false;
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
        document.querySelectorAll('.file-tree a[property-type="2"]').forEach(elem => {
            elem.addEventListener('click', function() {
                const filePath = this.getAttribute('property-path');
                new Promise(resolve => {
                    resolve(window.API.openFile(filePath));
                }).then((fileInfo) => {
                    document.title = fileInfo.name;
                    document.querySelector('.article').innerHTML = fileInfo.doc.html;
                    document.querySelector('.category').innerHTML = fileInfo.doc.toc;
                    if (!initialed) {
                        initialed = true;
                        document.querySelector('.side-view').style['grid-template-rows'] = "1fr 2px 50%";
                    }
                });
            })
        });
    });
});