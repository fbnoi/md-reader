const path = require('path');
const { application, project } = require('./workspace');

const loadPage = (win, name, query) => {
    return win.loadFile(path.join(__dirname, '../../dist', name + '.html'), { query: query });
}

const loadMainPage = (win) => {
    return loadPage(win, 'home', null);
}

const loadFilePage = (win, filePath) => {
    let dir = path.dirname(filePath);
    project.setWorkingDir(dir);
    application.addFileHistory(filePath);
    return loadPage(win, 'file', { 'filePath': filePath });
}

const loadFolderPage = (win, dirPath) => {
    project.setWorkingDir(dirPath);
    application.addDirHistory(dirPath);
    return loadPage(win, 'folder', { 'dirPath': dirPath });
}

module.exports = { loadMainPage, loadFilePage, loadFolderPage }
