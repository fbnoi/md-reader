document.addEventListener('DOMContentLoaded', function () {
    new Promise((resolve) => {
        resolve(window.API.getHistory());
    }).then((history) => {
        let html = '';
        if (typeof history.dir !== "undefined") {
            html = '<ul>';
            history.dir.forEach(dir => {
                html += 
                `<li class="dir-history-item">
                    <span class="history-item-inner open" title="${dir.path}" property-path="${dir.path}">
                        <i class="fa-regular fa-folder"></i> ${dir.name}<span class="history-item-detail">${dir.path}</span>
                    </span>
                    <i class="fa-regular fa-trash-can"></i>
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
                `<li class="file-history-item">
                    <span class="history-item-inner" title="${file.path}" property-path="${file.path}">
                        <i class="fa-regular fa-file"></i> ${file.name}<span class="history-item-detail">${file.path}</span>
                    </span>
                    <i class="fa-regular fa-trash-can"></i>
                </li>`;
            });
            html += '</ul>';
            
        } else {
            html = '<div class="history-list-empty">&lt;Empty list&gt;</div>'
        }
        document.querySelector('.file-history').innerHTML = html;
        return history;
    }).then(() => {
        document.querySelector('.open-dir').addEventListener('click', () => {
            window.API.openDirDialog();
        });
        document.querySelector('.open-file').addEventListener('click', () => {
            window.API.openFileDialog();
        });
        document.querySelectorAll('.dir-history .history-item-inner').forEach(elem => {
            elem.addEventListener('click', () => {
                window.API.openDirPage(elem.getAttribute('property-path'));
            })
        });
        document.querySelectorAll('.file-history .history-item-inner').forEach(elem => {
            elem.addEventListener('click', () => {
                window.API.openFilePage(elem.getAttribute('property-path'));
            })
        });
    });
});
