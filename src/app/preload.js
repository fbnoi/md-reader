const { contextBridge, ipcRenderer } = require('electron');

const ioAPIs = require('./api/io.signature');
const appAPIs = require('./api/application.signature');
const projAPIs = require('./api/project.signature');

console.log(123123);

contextBridge.exposeInMainWorld('API', (() => {
    const apis = {};
    [...ioAPIs, ...appAPIs, ...projAPIs].forEach(api => {
        apis[api.id] = (...params) => ipcRenderer.invoke(api.label, ...params);
    });
    console.log(apis);
    return apis;
})());

// contextBridge.exposeInMainWorld('API', {
//     readDir: (dirPath) => ipcRenderer.invoke('api:readDir', dirPath),
//     readFile: (filepath) => ipcRenderer.invoke('api:readFile', filepath),
//     getHistory: () => ipcRenderer.invoke('api:getHistory'),
//     openDirDialog: () => ipcRenderer.invoke('api:openDirDialog'),
//     openFileDialog: () => ipcRenderer.invoke('api:openFileDialog'),
//     openIndexPage: () => ipcRenderer.invoke('api:openIndexPage'),
//     openDirPage: (dirPath) => ipcRenderer.invoke('api:openDirPage', dirPath),
//     openFilePage: (filepath) => ipcRenderer.invoke('api:openFilePage', filepath),
//     openDevDebug: () => ipcRenderer.invoke('api:openDevDebug'),
//     openExternal: (link) => ipcRenderer.invoke('api:openExternal', link),
//     addOpenDirCache: (dirPath) => ipcRenderer.invoke('api:addOpenDirCache', dirPath),
//     removeOpenDirCache: (dirPath) => ipcRenderer.invoke('api:removeOpenDirCache', dirPath),
//     setOpenedFileCache: (filepath) => ipcRenderer.invoke('api:setOpenedFileCache', filepath),
//     getOpenedFileCache: () => ipcRenderer.invoke('api:getOpenedFileCache'),
//     setSelectedPathCache: (path) => ipcRenderer.invoke('api:setSelectedPathCache', path),
//     getNotes: () => ipcRenderer.invoke('api:getNotes'),
//     addNote: (selection, note) => ipcRenderer.invoke('api:addNote', selection, note),
//     removeNote: selection => ipcRenderer.invoke('api:removeNote', selection),
// });