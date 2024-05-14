const { ipcRenderer } = require("electron");


class ContextMenuBridge {
    constructor() {
        this.listen();
        this.items = [];
    }
    listen() {
        window.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            let items = this.getNeededItems();
            items && ipcRenderer.send('api:menu:showContextMenu', items);
        })
    }

    addItem(label, condition = null) {
        this.items.push({ label, condition });
    }

    getNeededItems() {
        return this.items
            .filter(item => !item.condition || item.condition.call())
            .map(item => item.label);
    }
}

const bridge = new ContextMenuBridge();

module.exports = [
    {
        id: 'onContextMenuCommand',
        label: 'api:menu:onContextMenuCommand',
        type: 'on',
    },
    {
        id: 'addConTextMenuItem',
        label: 'api:menu:addConTextMenuItem',
        type: 'fn',
        fn(item) {
            bridge.addItem(item.label, item.condition);
        }
    }
]