const { app, BrowserWindow, Menu } = require('electron');
const { loadMainPage, loadFilePage } = require('./src/core/page');
const { createMenu } = require('./src/core/menu');
const { listen } = require('./src/core/bus');
const { registerAPI } = require('./src/core/api');

const path = require('node:path');

const DEFAULT_WIN_WIDTH = 1200;
const DEFAULT_WIN_HEIGHT = 900;

const createMainWindow = function () {
    const win = new BrowserWindow({
        width: DEFAULT_WIN_WIDTH,
        height: DEFAULT_WIN_HEIGHT,
        webPreferences: {
            preload: path.join(__dirname, 'src/core', 'preload.js'),
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
    win.webContents.openDevTools();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})
