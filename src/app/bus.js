const EventEmitter = require('node:events');
const path = require('node:path');

const localImage = require('../lib/marked/local-image');
const { loadFilePage, loadFolderPage } = require('./page');

const eventEmitter = new EventEmitter();

const listen = (win) => {
    eventEmitter.on('menu:file:open_file', (filePath) => {
        const dir = path.dirname(filePath);
        localImage.setWorkspace(dir);
        loadFilePage(win, filePath);
    });

    eventEmitter.on('menu:file:open_folder', (dirPath) => {
        localImage.setWorkspace(dirPath);
        loadFolderPage(win, dirPath);
    });

    eventEmitter.on('menu:file:open_folder:error', (error) => {
        console.error(error);
    });

    eventEmitter.on('menu:file:debug', () => {
        win.webContents.openDevTools();
    });
}

module.exports = { eventEmitter, listen };
