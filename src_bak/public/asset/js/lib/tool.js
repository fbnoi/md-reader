const tpl = `
<div class="tool-bar">
    <div class="tool-bar-item tool-open-index">
        <i class="fa-solid fa-house-chimney"></i>
    </div>
    <div class="tool-bar-item tool-open-dir">
        <i class="fa-solid fa-folder-plus"></i>
    </div>
    <div class="tool-bar-item tool-open-file">
        <i class="fa-solid fa-file-circle-plus"></i>
    </div>
    <div class="tool-bar-item tool-bar-item-right tool-dev-debug">
        <i class="fa-solid fa-bug"></i>
    </div>
</div>
`;

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.container').innerHTML += tpl;
    document.querySelector('.tool-open-index').addEventListener('click', window.API.openIndexPage);
    document.querySelector('.tool-open-dir').addEventListener('click', window.API.openDirDialog);
    document.querySelector('.tool-open-file').addEventListener('click', window.API.openFileDialog);
    document.querySelector('.tool-dev-debug').addEventListener('click', window.API.openDevDebug);
});
