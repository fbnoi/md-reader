const { dialog } = require('electron');
const fs = require('fs');
const path = require('path');

module.exports.openFolder = function () {
    return dialog.showOpenDialogSync();
}

module.exports.readAllMDFiles = function (dir) {
    fs.readdirSync(dir).forEach(item => {
        let fullPath = path.join(dir, item);
        let stat = fs.lstatSync(fullPath);
        if (!stat.isDirectory()) {
            console.log(item);
        }
    });
}
