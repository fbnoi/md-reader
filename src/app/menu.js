const { Menu, dialog } = require('electron');
const { eventEmitter } = require('./bus');

const createMenu = function () {
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open File...',
                    click: () => {
                        let files = dialog.showOpenDialogSync({ properties: ['openFile'] });
                        if (files !== undefined) {
                            eventEmitter.emit('menu:file:open_file', files[0]);
                        }
                    }
                },
                {
                    label: 'Open Folder...',
                    click: () => {
                        let dirs = dialog.showOpenDialogSync({ properties: ['openDirectory'] });
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
