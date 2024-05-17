const { ipcRenderer } = require("electron");

module.exports = [
    {
        id: 'onContextMenuCommand',
        label: 'api:menu:onContextMenuCommand',
        type: 'on',
    },
    {
        id: 'showContextMenu',
        label: 'api:menu:setContextMenuItems',
        type: 'fn',
        fn(items) {
            ipcRenderer.send('api:menu:showContextMenu', items);
        }
    }
]