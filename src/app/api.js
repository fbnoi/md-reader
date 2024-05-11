const fs = require('node:fs');
const path = require('node:path');
const { ipcMain, dialog, shell } = require('electron');

const { dree, dreeType } = require('../lib/core/dree');
const { application, project } = require('../app/workspace');
const bus = require('./bus');
const markdown = require('../lib/core/markdown');
const localImage = require('../lib/marked/local-image');

const api = {
    readFile(filePath) {
        localImage.setBasepath(path.dirname(filePath));
        return {
            name: path.basename(filePath),
            path: filePath,
            type: dreeType.TYPE_FILE,
            doc: markdown.makeHtml(fs.readFileSync(filePath, { encoding: "UTF-8" }))
        };
    },

    readDir(dirPath) {
        const tree = dree(dirPath);
        const walk = (nodes, fn) => {
            nodes.forEach(node => {
                fn(node);
                if (node.children) {
                    walk(node.children, fn);
                }
            });
        }
        let snapshot = project.getSnapshot();
        walk(tree, node => {
            if (snapshot.expandedDir && snapshot.expandedDir.indexOf(node.path) !== -1) {
                node.expanded = true;
            }
            if (snapshot.selectedPath && snapshot.selectedPath == node.path) {
                node.selected = true;
            }
        });
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

    openDirPage(dirPath) {
        bus.send('page:open_folder', dirPath);
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

    addOpenDirCache(dirPath) {
        project.addExpandedDir(dirPath);
    },

    removeOpenDirCache(dirPath) {
        project.removeExpandedDir(dirPath);
    },

    setOpenedFileCache(filepath) {
        project.setOpenedFile(filepath);
    },

    getOpenedFileCache() {
        return project.getSnapshot().openedFile;
    },

    setSelectedPathCache(path) {
        project.setSelectedPath(path);
    },

    getNotes() {
        return project.getNotes();
    },

    addNote(selection, note) {
        return project.addNote(selection, note);
    },

    removeNote(selection) {
        return project.removeNote(selection);
    }
}

const registerAPI = () => {
    ipcMain.handle('api:readDir', (_, dirPath) => api.readDir(dirPath));
    ipcMain.handle('api:readFile', (_, filePath) => api.readFile(filePath));
    ipcMain.handle('api:getHistory', () => api.getHistory());
    ipcMain.handle('api:openDirDialog', () => api.openDirDialog());
    ipcMain.handle('api:openFileDialog', () => api.openFileDialog());
    ipcMain.handle('api:openIndexPage', () => api.openIndexPage());
    ipcMain.handle('api:openDirPage', (_, dirPath) => api.openDirPage(dirPath));
    ipcMain.handle('api:openFilePage', (_, filepath) => api.openFilePage(filepath));
    ipcMain.handle('api:openDevDebug', () => api.openDevDebug());
    ipcMain.handle('api:openExternal', (_, link) => api.openExternal(link));
    ipcMain.handle('api:addOpenDirCache', (_, dirPath) => api.addOpenDirCache(dirPath));
    ipcMain.handle('api:removeOpenDirCache', (dirPath) => api.removeOpenDirCache(dirPath));
    ipcMain.handle('api:setOpenedFileCache', (_, filepath) => api.setOpenedFileCache(filepath));
    ipcMain.handle('api:getOpenedFileCache', () => api.getOpenedFileCache());
    ipcMain.handle('api:setSelectedPathCache', (_, path) => api.setSelectedPathCache(path));
    ipcMain.handle('api:getNotes', () => api.getNotes());
    ipcMain.handle('api:addNote', (_, selection, note) => api.addNote(selection, note));
    ipcMain.handle('api:removeNote', (_, selection) => api.removeNote(selection));
}

module.exports = { registerAPI };
