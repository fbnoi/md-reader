const { contextBridge, ipcRenderer } = require('electron');

const ioAPIs = require('./api/io.signature');
const appAPIs = require('./api/application.signature');
const projAPIs = require('./api/project.signature');

contextBridge.exposeInMainWorld('API', (() => {
    const apis = {};
    [...ioAPIs, ...appAPIs, ...projAPIs].forEach(api => {
        apis[api.id] = (...params) => ipcRenderer.invoke(api.label, ...params);
    });
    return apis;
})());
