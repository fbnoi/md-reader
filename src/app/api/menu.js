const { MenuItem, Menu } = require("electron");
const { application } = require("../workspace");

function menuItemFactory(label, event) {
    return {label, click() { event.sender.send('api:menu:onContextMenuCommand', label); }}
}

function copy() { return { label: 'copy', role: 'copy' } }
function paste() { return { label: 'paste', role: 'paste' } }
function separator() { return { type: 'separator' } }
const internal_items = { 'copy': copy(), 'paste': paste(), 'separator': separator() };

class ContextMenuBridge {
    getItems(labels, event) {
        let items = [];
        labels.forEach(label => {
            if (internal_items.hasOwnProperty(label)) {
                items.push(internal_items[label]);
            } else {
                items.push(menuItemFactory(label, event));
            }
        });

        return items;
    }

    popup(items, win) {
        Menu.buildFromTemplate(items).popup({window: win});
    }
}

const bridge = new ContextMenuBridge();

module.exports = [
    {
        id: 'showContextMenu',
        label: 'api:menu:showContextMenu',
        type: 'on',
        fn(event, labels) {
            let items = bridge.getItems(labels, event);
            bridge.popup(items, application.getWin());
        }
    }
]