document.addEventListener('DOMContentLoaded', function () {
    new Promise((resolve) => {
        resolve(window.API.getHistory());
    }).then((history) => {
        let html = '';
        if (typeof history.dir !== "undefined") {
            html = '<ul>';
            history.dir.forEach(dir => {
                html += 
                `<li title="${dir.path}" class="dir-history-item" property-path="${dir.path}">
                    <span class="history-item-name">
                        <i class="bi bi-folder"></i> ${dir.name}<span class="history-item-detail">${dir.path}</span>
                    </span>
                    <i class="bi bi-trash"></i>
                </li>`;
            });
            html += '</ul>';
        } else {
            html = '<div class="history-list-empty">&lt;Empty list&gt;</div>'
        }
        document.querySelector('.dir-history').innerHTML = html;
        return history;
    }).then((history) => {
        let html = '';
        if (typeof history.file !== "undefined") {
            html = '<ul>';
            history.file.forEach(file => {
                html += 
                `<li title="${file.path}" class="file-history-item" property-path="${file.path}">
                    <span class="history-item-name">
                        <i class="bi bi-file-earmark"></i> ${file.name}<span class="history-item-detail">${file.path}</span>
                    </span>
                    <i class="bi bi-trash"></i>
                </li>`;
            });
            html += '</ul>';
            
        } else {
            html = '<div class="history-list-empty">&lt;Empty list&gt;</div>'
        }
        document.querySelector('.file-history').innerHTML = html;
        return history;
    });
});
