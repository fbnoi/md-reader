const { MenuItem, Menu, ipcMain } = require("electron");
const { application } = require("../workspace");

function customMenuItem(label, fn) {
    return new MenuItem({
        label: label,
        click: fn.call(null),
    });
}

function copy() { return { label: 'copy', role: 'copy' } }
function paste() { return { label: 'paste', role: 'paste' } }
function separator() { return { type: 'separator' } }

const internal_items = { 'copy': copy(), 'paste': paste(), 'separator': separator() };

module.exports = [
    {
        id: 'showContextMeue',
        label: 'api:menu:showContextMenu',
        type: 'on',
        fn(msg) {
            console.log(msg);
            application.getWin().webContents.send('api:menu:onContextMenuCommand', msg);
        }
    }
]