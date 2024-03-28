const { app } = require('electron');
const { createMainWindow, createFolderWindow } = require('./src/core/window');
const EventEmitter = require('node:events');
const fs = require('fs');

const eventEmitter = new EventEmitter();
let win = null;

app.whenReady().then(() => {
    const args = process.argv.slice(2);
    // if (args.length > 0) {
    //     let localPath = args[0];
    //     if (fs.stat(localPath)) {

    //     }
    // }

    win = createMainWindow(eventEmitter);
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createMainWindow(eventEmitter);
    });
});

eventEmitter.on('menu:file:open_folder', (dirPath) => {
    let newWin = createFolderWindow(eventEmitter, dirPath);
    win.close();
    win = newWin;
});

eventEmitter.on('menu:file:open_folder:error', (error) => {
    console.error(error);
});

eventEmitter.on('menu:file:debug', (error) => {
    win.webContents.openDevTools();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})
