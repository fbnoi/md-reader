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
        document.title = fileInfo.name;
        console.log(render);
        const markdown = render.markdown(fileInfo.content);
        document.querySelector('.article').innerHTML = markdown.content;
        document.querySelector('.category').innerHTML = markdown.toc;
    })
});
