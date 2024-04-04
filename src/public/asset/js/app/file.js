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
        return window.API.openFile(filePath);
    }).then((fileInfo) => {
        console.log(fileInfo);
        document.title = fileInfo.name;
        document.querySelector('.article').innerHTML = fileInfo.doc.html;
        document.querySelector('.category').innerHTML = fileInfo.doc.toc;
    })
});
