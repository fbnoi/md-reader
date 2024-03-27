const { BrowserWindow, Menu } = require('electron')
const path = require('node:path')

const DEFAULT_WIN_WIDTH = 1200;
const DEFAULT_WIN_HEIGHT = 900;

const createMainWindow = function (eventEmitter) {
    const { createMenu } = require('../page/main/menu.js');
    const mainWindow = new BrowserWindow({
        width: DEFAULT_WIN_WIDTH,
        height: DEFAULT_WIN_HEIGHT,
        webPreferences: {
            preload: path.join(__dirname, '../page/main/preload.js')
        }
    })
    const menu = createMenu(eventEmitter);
    Menu.setApplicationMenu(menu);

    return mainWindow.loadFile(path.join(__dirname, '../page/main/index.html'));
}

module.exports = { createMainWindow }