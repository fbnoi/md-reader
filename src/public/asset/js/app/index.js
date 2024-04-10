document.addEventListener('DOMContentLoaded', function () {
    new Promise((resolve) => {
        resolve(window.API.getHistory());
    }).then((history) => {
        let html = '';
        if (typeof history.dir !== "undefined") {
            html = '<ul>';
            history.dir.forEach(dir => {
                html += `<li title="${dir.path}" class="dir-history-item" property-path="${dir.path}"><svg t="1712763895844" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4872" width="12" height="12"><path d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326z m1.8 562H232V136h302v216c0 23.2 18.8 42 42 42h216v494z" p-id="4873"></path></svg>${dir.name}<span>${dir.path}</span></li>`;
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
                html += `<li title="${file.path}" class="file-history-item" property-path="${file.path}">${file.name}<span>${file.path}</span></li>`;
            });
            html += '</ul>';
            
        } else {
            html = '<div class="history-list-empty">&lt;Empty list&gt;</div>'
        }
        document.querySelector('.file-history').innerHTML = html;
        return history;
    });
});
