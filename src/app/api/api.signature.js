const { ipcRenderer } = require('electron');

const ioAPIs = require('./io.signature');
const appAPIs = require('./application.signature');
const projAPIs = require('./project.signature');
const menuAPIs = require('./menu.signature');

module.exports = function signature() {
    const apis = {};
    [...ioAPIs, ...appAPIs, ...projAPIs, ...menuAPIs].forEach(api => {
        apis[api.id] = (...params) => ipcRenderer.invoke(api.label, ...params);
    });
    return apis;
};