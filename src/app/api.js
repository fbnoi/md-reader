const { ipcMain } = require('electron');

const ioAPIs = require('./api/io');
const appAPIs = require('./api/application');
const projAPIs = require('./api/project');

module.exports = function registerAPI() {
    [...ioAPIs, ...appAPIs, ...projAPIs].forEach(api => {
        ipcMain.handle(api.label, (_, ...params) => api.fn.call(null, ...params));
    });
};