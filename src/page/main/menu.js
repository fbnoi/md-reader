const { Menu, dialog } = require('electron');

const createMenu = function (eventEmitter) {
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open Folder...',
                    click: () => {
                        dialog.showOpenDialogSync({
                            properties: ['openDirectory']
                        }).then(res => {
                            if (!res.canceled) {
                                eventEmitter.emit('menu:file:open_folder', res.filePaths);
                            }
                        });
                    }
                },
                {
                    label: 'Debug',
                    click: () => {
                        eventEmitter.emit('menu:file:debug');
                    }
                }
            ]
        }
    ];

    return Menu.buildFromTemplate(template);
}

module.exports = { createMenu }
