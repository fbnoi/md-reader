const path = require('path');
const workspace = require('./workspace');

const loadPage = (win, name, query) => {
    return win.loadFile(path.join(__dirname, '../public/page', name + '.html'), { query: query });
}

const loadMainPage = (win) => {
    return loadPage(win, 'index', null);
}

const loadFilePage = (win, filePath) => {
    let dir = path.dirname(filePath);
    workspace.setWorkingDir(dir);
    return loadPage(win, 'file', { 'filePath': filePath });
}

const loadFolderPage = (win, dirPath) => {
    workspace.setWorkingDir(dirPath);
    return loadPage(win, 'folder', { 'dirPath': dirPath });
}

module.exports = { loadMainPage, loadFilePage, loadFolderPage }
