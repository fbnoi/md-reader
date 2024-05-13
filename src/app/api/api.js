const { ipcMain } = require('electron');

const ioAPIs = require('./io');
const appAPIs = require('./application');
const projAPIs = require('./project');
const menuAPIs = require('./menu');

module.exports = function registerAPI() {
    [...ioAPIs, ...appAPIs, ...projAPIs, ...menuAPIs].forEach(api => {
        ipcMain.handle(api.label, (_, ...params) => api.fn.call(null, ...params));
    });
};