const { ipcRenderer } = require("electron");


class ContextMenuBridge {
    constructor() {
        this.listen();
        this.items = [];
    }
    listen() {
        console.log(123);
        window.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            let context = this.generateMenuContext(e);
            let items = this.getNeededItems(context);
            items && ipcRenderer.send('api:menu:showContextMenu', items);
        })
    }

    setItems(items) {
        this.items = [];
        items.forEach(item => this.items.push({ label: item.label, condition: item.condition }));
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
        id: 'setContextMenuItems',
        label: 'api:menu:setContextMenuItems',
        type: 'fn',
        fn(items) {
            bridge.setItems(items);
        }
    }
]