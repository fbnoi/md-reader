const { ipcRenderer } = require('electron');

const ioAPIs = require('./io.signature');
const appAPIs = require('./application.signature');
const projAPIs = require('./project.signature');
const menuAPIs = require('./menu.signature');

module.exports = function signature() {
    const apis = {};
    [...ioAPIs, ...appAPIs, ...projAPIs, ...menuAPIs].forEach(api => {
        switch (api.type) {
            case 'on':
                apis[api.id] = (callback) => ipcRenderer.on(api.label, (_, ...args) => callback(...args));
                break;
            case 'fn':
                apis[api.id] = (...params) => api.fn(...params);
                break;
            default:
                apis[api.id] = (...args) => ipcRenderer.invoke(api.label, ...args);
        }
    });


    return apis;
};