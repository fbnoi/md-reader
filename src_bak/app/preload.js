const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('API', {
    readDir: (dirPath) => ipcRenderer.invoke('api:readDir', dirPath),
    readFile: (filepath) => ipcRenderer.invoke('api:readFile', filepath),
    getHistory: () => ipcRenderer.invoke('api:getHistory'),
    openDirDialog: () => ipcRenderer.invoke('api:openDirDialog'),
    openFileDialog: () => ipcRenderer.invoke('api:openFileDialog'),
    openIndexPage: () => ipcRenderer.invoke('api:openIndexPage'),
    openDirPage: (dirPath) => ipcRenderer.invoke('api:openDirPage', dirPath),
    openFilePage: (filepath) => ipcRenderer.invoke('api:openFilePage', filepath),
    openDevDebug: () => ipcRenderer.invoke('api:openDevDebug'),
    openExternal: (link) => ipcRenderer.invoke('api:openExternal', link),
    addOpenDirCache: (dirPath) => ipcRenderer.invoke('api:addOpenDirCache', dirPath),
    removeOpenDirCache: (dirPath) => ipcRenderer.invoke('api:removeOpenDirCache', dirPath),
    setOpenedFileCache: (filepath) => ipcRenderer.invoke('api:setOpenedFileCache', filepath),
    getOpenedFileCache: () => ipcRenderer.invoke('api:getOpenedFileCache'),
    setSelectedPathCache: (path) => ipcRenderer.invoke('api:setSelectedPathCache', path),
});