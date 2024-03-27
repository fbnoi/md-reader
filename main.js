const { app } = require('electron')
const EventEmitter = require('node:events');

const { createMainWindow } = require('./src/core/window')

const eventEmitter = new EventEmitter();

app.whenReady().then(() => {
    createMainWindow(eventEmitter);
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
});

eventEmitter.on('menu:file:open_folder', (dirPath) => {
    console.log(dirPath);
});

eventEmitter.on('menu:file:open_folder:error', (error) => {
    console.error(error);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
