const EventEmitter = require('node:events');
const { loadMainPage, loadFilePage, loadFolderPage } = require('./page');

const eventEmitter = new EventEmitter();

const bus = {
    send(event, args) {
        eventEmitter.emit(event, args);
    },
    listen(win) {
        eventEmitter.on('page:open_index', (filePath) => {
            loadMainPage(win);
        });

        eventEmitter.on('page:open_file', (filePath) => {
            loadFilePage(win, filePath);
        });

        eventEmitter.on('page:open_folder', (dirPath) => {
            loadFolderPage(win, dirPath);
        });

        eventEmitter.on('page:open_folder:error', (error) => {
            console.error(error);
        });

        eventEmitter.on('dev:debug', () => {
            win.webContents.openDevTools();
        });
    }
}

module.exports = bus;
