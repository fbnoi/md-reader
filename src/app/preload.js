const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('API', {
    openFile: (filePath) => ipcRenderer.invoke('api:openFile', filePath),
    openDir: (filePath) => ipcRenderer.invoke('api:openDir', filePath)
});
