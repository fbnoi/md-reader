document.addEventListener('DOMContentLoaded', function () {
    new Promise((resolve) => {
        resolve(window.API.getHistory());
    }).then((history) => {
        if (typeof history.dir !== "undefined") {
            let html = '<ul>';
            history.dir.forEach(dir => {
                html += `<li class="dir-history-item" property-path="${dir.path}">${dir.name}</li>`;
            });
            html += '</ul>';
            document.querySelector('.dir-history').innerHTML = html;
        }
        return history;
    }).then((history) => {
        if (typeof history.file !== "undefined") {
            let html = '<ul>';
            history.file.forEach(file => {
                html += `<li class="file-history-item" property-path="${file.path}">${file.name}</li>`;
            });
            html += '</ul>';
            document.querySelector('.file-history').innerHTML = html;
        }
        return history;
    });
});
