import util from "./util";

util.ready(() => {
    document.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        contextMenu.popup(event);
    });
});

class ContextMenu {
    inject(items) {this.items = items;}
    popup(event) {
        window.API.menu(event, ['copy', 'paste', 'separator', ...this.items])
    }
}

const contextMenu = new ContextMenu();

export default contextMenu;
