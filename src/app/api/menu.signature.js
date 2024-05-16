const { ipcRenderer } = require("electron");


class ContextMenuBridge {
    constructor() {
        this.listen();
        this.items = [];
    }
    listen() {
        window.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            let context = this.generateMenuContext(e);
            let items = this.getNeededItems(context);
            items && ipcRenderer.send('api:menu:showContextMenu', items);
        })
    }

    addItem(label, condition) {
        this.items.push({ label, condition });
    }

    getNeededItems(context) {
        return this.items
            .filter(item => !item.condition || item.condition.call(null, context))
            .map(item => item.label);
    }

    generateMenuContext(e) {
        return {
            x: e.x,
            y: e.y,
            type: e.type
        }
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