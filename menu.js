const { Menu } = require('electron');
const { openFolder, readAllMDFiles } = require('./src/folder')

module.exports.createMenu = function (win) {
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open Folder...',
                    click: () => {
                        openFolder(win)
                            .then((dirPath) => {
                                readAllMDFiles(dirPath);
                            })
                            .catch(err => {
                                console.error(err);
                            });
                    }
                },
                {
                    label: 'Debug',
                    click: () => {
                        win.webContents.openDevTools();
                    }
                }
            ]
        }
    ];
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}
