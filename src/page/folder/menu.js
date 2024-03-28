const { Menu, dialog } = require('electron');

const createMenu = function (eventEmitter) {
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open Folder...',
                    click: () => {
                        let dirs = dialog.showOpenDialogSync({properties: ['openDirectory']});
                        if (dirs !== undefined) {
                            eventEmitter.emit('menu:file:open_folder', dirs[0]);
                        }
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
