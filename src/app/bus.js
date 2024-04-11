const EventEmitter = require('node:events');
const { loadFilePage, loadFolderPage } = require('./page');

const eventEmitter = new EventEmitter();

const bus = {
    send(event, args) {
        eventEmitter.emit(event, args);
    },
    listen(win) {
        eventEmitter.on('menu:file:open_file', (filePath) => {
            loadFilePage(win, filePath);
        });

        eventEmitter.on('menu:file:open_folder', (dirPath) => {
            loadFolderPage(win, dirPath);
        });

        eventEmitter.on('menu:file:open_folder:error', (error) => {
            console.error(error);
        });

        eventEmitter.on('menu:file:debug', () => {
            win.webContents.openDevTools();
        });
    }
}

module.exports = bus;
