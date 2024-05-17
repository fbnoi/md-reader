class Menu {
    constructor() {
        window.API.onContextMenuCommand((command) => {
            this.items.forEach(item => {
                item.label === command && item.command(this.context);
            });
            window.getSelection().empty();
            this.clearContext();
        });
        window.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.context = {x: e.x, y: e.y};
            let items = this.getNeededItemLabels();
            if (items.length > 0) {
                window.API.showContextMenu(items);
            } else {
                this.context = null;
            }
        });
    }

    setContextMenuItems(items) {
        this.items = items;
    }

    clearContextMenuItems() {
        this.items = [];
    }

    getNeededItemLabels() {
        return this.items
            .filter(item => !item.condition || item.condition(this.context))
            .map(item => item.label);
    }

    setContext(context) {
        this.context = context;
    }

    clearContext() {
        this.context = null;
    }
}

export default new Menu();
