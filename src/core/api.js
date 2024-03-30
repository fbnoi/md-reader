const fs = require('node:fs');
const path = require('node:path');
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

const registerAPI = () => {
    ipcMain.handle('api:openFile', (event, filePath) => {
        return openFile(filePath);
    });
}

module.exports = { registerAPI };
