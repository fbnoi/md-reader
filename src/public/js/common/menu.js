import util from "./util";

util.ready(() => {
    window.addEventListener('contextmenu', (event) => {
        console.log(123);
        event.preventDefault();
        contextMenu.popup(event);
    });

    window.API.onContextMenuCommand((message) => {
        console.log(message);
    });
});

class ContextMenu {
    inject(items) { this.items = items; }
    popup(event) {
        window.API.showContextMenu(event, ['copy', 'paste', 'separator', ...this.items])
    }
}

const contextMenu = new ContextMenu();

export default contextMenu;
