const { ipcRenderer } = require("electron")

module.exports = [
    {
        id: 'onContextMenuCommand',
        label: 'api:menu:onContextMenuCommand',
        type: 'on',
    },
    {
        id: 'showContextMenu',
        label: 'api:menu:showContextMenu',
        type: 'fn',
        fn(event, items) {
            ipcRenderer.send('api:menu:showContextMenu', 'test');
        }
    }
]