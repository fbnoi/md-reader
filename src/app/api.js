const fs = require('node:fs');
const path = require('node:path');
const { ipcMain, dialog, shell } = require('electron');

const { dree, dreeType } = require('../lib/core/dree');
const { application } = require('../app/workspace');
const bus = require('./bus');
const markdown = require('../lib/core/markdown');

const api = {
    openFile(filePath) {
        return {
            name: path.basename(filePath),
            path: filePath,
            type: dreeType.TYPE_FILE,
            doc: markdown.makeHtml(fs.readFileSync(filePath, { encoding: "UTF-8" }))
        };
    },

    openDir(dirPath) {
        const tree = dree(dirPath);
        return tree;
    },

    getHistory() {
        return application.getHistory();
    },

    openDirDialog() {
        let dirs = dialog.showOpenDialogSync(application.win, { properties: ['openDirectory'] });
        dirs && this.openDirPage(dirs[0]);
    },

    openFileDialog() {
        let files = dialog.showOpenDialogSync(application.win, { properties: ['openFile'] });
        files && this.openFilePage(files[0]);
    },

    openIndexPage() {
        bus.send('page:open_index');
    },

    openDirPage(dirpath) {
        bus.send('page:open_folder', dirpath);
    },

    openFilePage(filepath) {
        bus.send('page:open_file', filepath);
    },

    openDevDebug() {
        bus.send('dev:debug');
    },

    openExternal(link) {
        shell.openExternal(link);
    },
}

const registerAPI = () => {
    ipcMain.handle('api:openDir', (_, dirPath) => api.openDir(dirPath));
    ipcMain.handle('api:openFile', (_, filePath) => api.openFile(filePath));
    ipcMain.handle('api:getHistory', () => api.getHistory());
    ipcMain.handle('api:openDirDialog', () => api.openDirDialog());
    ipcMain.handle('api:openFileDialog', () => api.openFileDialog());
    ipcMain.handle('api:openIndexPage', () => api.openIndexPage());
    ipcMain.handle('api:openDirPage', (_, dirpath) => api.openDirPage(dirpath));
    ipcMain.handle('api:openFilePage', (_, filepath) => api.openFilePage(filepath));
    ipcMain.handle('api:openDevDebug', () => api.openDevDebug());
    ipcMain.handle('api:openExternal', (_, link) => api.openExternal(link));
}

module.exports = { registerAPI };
