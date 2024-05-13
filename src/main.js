const { app, BrowserWindow } = require('electron');
const { loadMainPage, loadFilePage } = require('./app/page');
const bus = require('./app/bus');
const registerAPI = require('./app/api');
const { application } = require('./app/workspace');

try {
    require('electron-reloader')(module)
} catch (_) {}

app.whenReady().then(() => {
    const args = process.argv.slice(2);
    const win = application.createMainWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) application.createMainWindow();
    });
    bus.listen(win);
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
