const fs = require('node:fs');
const path = require('node:path');
const markdown = require('../lib/core/markdown');

const { ipcMain } = require('electron');
const { dree, dreeType } = require('../lib/core/dree');

const api = {
    openFile(filePath) {
        return {
            name: path.basename(filePath),
            path: filePath,
            type: dreeType.TYPE_FILE,
            doc: markdown.makeHtml(fs.readFileSync(filePath, { encoding: "UTF-8" }))
        };
    },
    openDir(dirPath) {
        const tree = dree(dirPath);

        return tree;
    }
}

const registerAPI = () => {
    ipcMain.handle('api:openFile', (event, filePath) => api.openFile(filePath)),
    ipcMain.handle('api:openDir', (event, dirPath) => api.openDir(dirPath))
}

module.exports = { registerAPI };
