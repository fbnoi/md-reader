const { MenuItem, Menu } = require("electron");
const { application } = require("../workspace");

function customMenuItem(label, fn) {
    return new MenuItem({
        label: label,
        click: fn.call(null),
    });
}

function copy() {return {label: 'copy', role: 'copy'}}
function paste() {return {label: 'paste', role: 'paste'}}
function separator() {return {type: 'separator'}}

const internal_items = {'copy': copy(), 'paste': paste(), 'separator': separator()};

module.exports = [
    {
        id: 'menu',
        label: 'api:menu:menu',
        fn (event, items) {
            const tpl = [];
            console.log(items);
            items.forEach(item => {
                if (typeof item === 'string') {
                    if (internal_items.hasOwnProperty(item)) {
                        tpl.push(internal_items[item]);
                    } else {
                        console.error('unrecognized menu:', item);
                    }
                } else {
                    tpl.push(customMenuItem(item.label, item.click));
                }
            });
            const menu = Menu.buildFromTemplate(tpl);
            menu.popup({
                window: application.getWin(),
                x: event.x,
                y: event.y,
            });
        }
    }    
]