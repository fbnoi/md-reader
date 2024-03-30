document.addEventListener('DOMContentLoaded', function () {
    new Promise((resolve) => {
        const urlParams = new URLSearchParams(window.location.search)
        const filePath = urlParams.get('filePath')
        resolve(filePath)
    }).then((filePath) => {
        return window.API.openFile(filePath)
    }).then((fileInfo) => {
        console.log(fileInfo);
        document.title = fileInfo.filename;
        document.querySelector('.main-view').innerHTML = marked.parse(fileInfo.content);
    });
});
