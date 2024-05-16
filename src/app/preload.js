const { contextBridge } = require('electron');

const signature = require('./api/api.signature');

contextBridge.exposeInMainWorld('API', signature());

console.log(1);
