document.addEventListener('DOMContentLoaded', function () {
    new Promise((resolve) => {
        resolve(window.API.getHistory());
    }).then((history) => {
        if (typeof history.dir !== "undefined") {
            let html = '';
            history.dir.forEach(dir => {
                html += `<div class="dir-history-item" property-path="${dir.path}">${dir.name}</div>`;
            });
            document.querySelector('.dir-history').innerHTML = html;
        }
        return history;
    }).then((history) => {
        if (typeof history.file !== "undefined") {
            let html = '';
            history.file.forEach(file => {
                html += `<div class="file-history-item" property-path="${file.path}">${file.name}</div>`;
            });
            document.querySelector('.file-history').innerHTML = html;
        }
        return history;
    });
});
