const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('API', {
    openDir: (dirpath) => ipcRenderer.invoke('api:openDir', dirpath),
    openFile: (filepath) => ipcRenderer.invoke('api:openFile', filepath),
    getHistory: () => ipcRenderer.invoke('api:getHistory'),
    openDirDialog: () => ipcRenderer.invoke('api:openDirDialog'),
    openFileDialog: () => ipcRenderer.invoke('api:openFileDialog'),
    openIndexPage: () => ipcRenderer.invoke('api:openIndexPage'),
    openDirPage: (dirpath) => ipcRenderer.invoke('api:openDirPage', dirpath),
    openFilePage: (filepath) => ipcRenderer.invoke('api:openFilePage', filepath),
    openDevDebug: () => ipcRenderer.invoke('api:openDevDebug'),
    openExternal: (link) => ipcRenderer.invoke('api:openExternal', link),
});