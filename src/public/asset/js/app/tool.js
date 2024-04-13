document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.tool-open-index').addEventListener('click', window.API.openIndexPage);
    document.querySelector('.tool-open-dir').addEventListener('click', window.API.openDirDialog);
    document.querySelector('.tool-open-file').addEventListener('click', window.API.openFileDialog);
    document.querySelector('.tool-dev-debug').addEventListener('click', window.API.openDevDebug);
});