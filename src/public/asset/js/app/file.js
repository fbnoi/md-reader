document.addEventListener('DOMContentLoaded', function () {
    new Promise((resolve) => {
        Split({
            columnGutters: [{
                track: 1,
                element: document.querySelector('.gutter-main'),
            }]
        });
        resolve();
    })
    .then(() => {
        return new URLSearchParams(window.location.search).get('filePath');
    })
    .then((filePath) => {
        return window.API.readFile(filePath);
    })
    .then((fileInfo) => {
        document.title = fileInfo.name;
        document.querySelector('.article').innerHTML = fileInfo.doc.html;
        document.querySelector('.category').innerHTML = fileInfo.doc.toc;
    })
    .then(() => {
        const article = document.querySelector('.article');
        const noter = new Noter(article);
        article.addEventListener('mouseup', () => {
            noter.highlightSelection(noter.getSelection());
        });
    })
    .then(() => {
        document.querySelectorAll('a.open-in-browser').forEach((link) => {
            link.addEventListener('click', (e) => {  
                e.preventDefault();
                window.API.openExternal(link.href);
            }); 
        });
    });
});
