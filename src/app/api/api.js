const { ipcMain } = require('electron');

const ioAPIs = require('./io');
const appAPIs = require('./application');
const projAPIs = require('./project');
const menuAPIs = require('./menu');

module.exports = function registerAPI() {
    [...ioAPIs, ...appAPIs, ...projAPIs, ...menuAPIs].forEach(api => {
        switch (api.type) {
            case 'on':
                ipcMain.on(api.label, (_event, ...args) => api.fn.call(null, ...args))
                break;
            default:
                ipcMain.handle(api.label, (_, ...args) => api.fn.call(null, ...args));
        }
    });
};