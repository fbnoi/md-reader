const fs = require('node:fs');
const path = require('node:path');
const { ipcMain } = require('electron');

const { dree, dreeType } = require('./dree');

const openFile = (filePath) => {
    const fInfo = fs.statSync(filePath);
    if (fInfo.isFile()) {
        return {
            name: path.basename(filePath),
            path: filePath,
            type: dreeType.TYPE_FILE,
            content: fs.readFileSync(filePath, { encoding: "UTF-8" }),
        };
    }

    return null;
}

const registerAPI = () => {
    ipcMain.handle('api:openFile', (event, filePath) => {
        return openFile(filePath);
    });
    ipcMain.handle('api:openDir', (event, dirPath) => {
        return dree(dirPath);
    });
}

module.exports = { registerAPI };
