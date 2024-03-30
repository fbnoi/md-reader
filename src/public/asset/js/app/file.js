document.addEventListener('DOMContentLoaded', function () {
    new Promise((resolve) => {
        const urlParams = new URLSearchParams(window.location.search)
        const filePath = urlParams.get('filePath')
        resolve(filePath)
    }).then((filePath) => {
        return window.API.openFile(filePath)
    }).then((fileInfo) => {
        document.title = fileInfo.filename;
        const mdHljs = markedHighlight.markedHighlight({
            langPrefix: 'hljs language-',
            highlight(code, lang, info) {
                const language = hljs.getLanguage(lang) ? lang : 'plaintext';

                return hljs.highlight(code, { language }).value;
            }
        });
        marked.use(mdHljs);
        document.querySelector('.main-view').innerHTML = marked.parse(fileInfo.content);
    });
});
