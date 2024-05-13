const { ipcMain } = require('electron');

const ioAPIs = require('./io');
const appAPIs = require('./application');
const projAPIs = require('./project');

module.exports = function registerAPI() {
    [...ioAPIs, ...appAPIs, ...projAPIs].forEach(api => {
        ipcMain.handle(api.label, (_, ...params) => api.fn.call(null, ...params));
    });
};