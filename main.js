const { app, BrowserWindow } = require('electron')
const { createMenu } = require('./menu.js');

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        titleBarStyle: 'hidden',
    })
    createMenu(mainWindow);
    mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
