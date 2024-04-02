const fs = require('node:fs');
const path = require('node:path');
const dirTree = require('directory-tree');
const { ipcMain } = require('electron');

const openFile = (filePath) => {
    const fInfo = fs.statSync(filePath);
    if (fInfo.isFile()) {
        return {
            filename: path.basename(filePath),
            mtime: fInfo.mtimeMs,
            size: fInfo.size,
            content: fs.readFileSync(filePath, { encoding: "UTF-8" })
        };
    }

    return null;
}

const openDir = (filePath) => {
    return dirTree(filePath, { extensions: /\.(md|markdown)/ });
}

const registerAPI = () => {
    ipcMain.handle('api:openFile', (event, filePath) => {
        return openFile(filePath);
    });
    ipcMain.handle('api:openDir', (event, dirPath) => {
        return openDir(dirPath);
    });
}

module.exports = { registerAPI };
