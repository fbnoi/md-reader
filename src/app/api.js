const fs = require('node:fs');
const path = require('node:path');
const markdown = require('../lib/marked/markdown');

const { ipcMain } = require('electron');
const { dree, dreeType } = require('../lib/core/dree');


const openFile = (filePath) => {
    const fInfo = fs.statSync(filePath);
    if (fInfo.isFile()) {
        return {
            name: path.basename(filePath),
            path: filePath,
            type: dreeType.TYPE_FILE,
            doc: markdown.makeHtml(fs.readFileSync(filePath, { encoding: "UTF-8" }))
        };
    }

    return null;
}

const registerAPI = () => {
    ipcMain.handle('api:openFile', (event, filePath) => {
        return openFile(filePath);
    });
    ipcMain.handle('api:openDir', (event, dirPath) => {
        return render.fileTree(dree(dirPath));
    });
}

module.exports = { registerAPI };
