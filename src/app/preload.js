const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('API', {
    openDir: (dirpath) => ipcRenderer.invoke('api:openDir', dirpath),
    openFile: (filepath) => ipcRenderer.invoke('api:openFile', filepath),
    getHistory: () => ipcRenderer.invoke('api:getHistory'),
    openDirDialog: () => ipcRenderer.invoke('api:openDirDialog'),
    openFileDialog: () => ipcRenderer.invoke('api:openFileDialog'),
    openDirPage: (dirpath) => ipcRenderer.invoke('api:openDirPage', dirpath),
    openFilePage: (filepath) => ipcRenderer.invoke('api:openFilePage', filepath),
});
