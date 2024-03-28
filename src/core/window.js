const { BrowserWindow, Menu } = require('electron')
const path = require('node:path')

const DEFAULT_WIN_WIDTH = 1200;
const DEFAULT_WIN_HEIGHT = 900;

const createMainWindow = function (eventEmitter) {
    const { createMenu } = require('../../menu.js');
    const win = new BrowserWindow({
        width: DEFAULT_WIN_WIDTH,
        height: DEFAULT_WIN_HEIGHT,
        webPreferences: {
            preload: path.join(__dirname, '../page/main/preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            enableRemoteModule: false
        }
    })
    const menu = createMenu(eventEmitter);
    Menu.setApplicationMenu(menu);
    win.loadFile(path.join(__dirname, '../page/main/index.html'));

    return win;
}

module.exports = { createMainWindow }