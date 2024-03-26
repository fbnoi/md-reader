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
            ]
        },
    ];
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}
