const { app, BrowserWindow, Menu } = require('electron');
const { loadMainPage, loadFilePage } = require('./page');
const { createMenu } = require('./menu');
const { listen } = require('./bus');
const { registerAPI } = require('./api');

const path = require('node:path');

const DEFAULT_WIN_WIDTH = 1200;
const DEFAULT_WIN_HEIGHT = 900;

const createMainWindow = function () {
    const win = new BrowserWindow({
        width: DEFAULT_WIN_WIDTH,
        height: DEFAULT_WIN_HEIGHT,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            enableRemoteModule: false,
            webSecurity: true
        }
    })
    const menu = createMenu();
    Menu.setApplicationMenu(menu);

    return win;
}

app.whenReady().then(() => {
    const args = process.argv.slice(2);
    const win = createMainWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
    });
    listen(win);
    registerAPI();
    if (args.length === 0) {
        loadMainPage(win);
    } else {
        loadFilePage(win, args[0]);
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})
