const path = require('path');

const loadPage = (win, name, query) => {
    return win.loadFile(path.join(__dirname, 'src/page', name, 'index.html'), { query: query });
}

const loadMainPage = (win) => {
    return loadPage(win, 'main', null);
}

const loadFilePage = (win, filePath) => {
    return loadPage(win, 'file', { 'filePath': filePath });
}

const loadFolderPage = (win, dirPath) => {
    return loadPage(win, 'folder', { 'dirPath': dirPath });
}

module.exports = { loadMainPage, loadFilePage, loadFolderPage }
