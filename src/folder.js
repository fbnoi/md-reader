const { dialog } = require('electron');
const fs = require('fs');
const path = require('path');

module.exports.openFolder = function (win) {
    return new Promise((resolve, error) => {
        dialog.showOpenDialog(win, {
            properties: ['openDirectory']
        }).then(result => {
            if (!result.canceled && result.filePaths.length > 0) {
                resolve(result.filePaths[0]);
            } else {
                error()
            }
        }).catch(err => {
            error(err)
        })
    });
}

module.exports.readAllMDFiles = function (dir) {
    fs.readdirSync(dir).forEach(item => {
        let fullPath = path.join(dir, item);
        let stat = fs.lstatSync(fullPath);
        if (!stat.isDirectory()) {
            
        }
    });
}
