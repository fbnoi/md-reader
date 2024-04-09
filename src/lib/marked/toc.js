const tree = [];
let cursor = null;
const { id } = require('../util/helper');

const toc = {
    heading(token) {
        if (token.type === 'heading') {
            addHeading(token);
        }
    },
    getHeadings() {
        return wrapHeading(tree);
    },
    reset() {
        cursor = null;
        tree.length = 0;
    }
}

function addHeading(token) {
    const node = { name: token.text, id: id(token.text), level: token.depth, children: [], parent: null };
    if (cursor == null) {
        tree.push(node);
    } else if (node.level < cursor.level) {
        node.parent = cursor;
        cursor.children.push(node);
    } else if (node.level >= cursor.level) {
        while (node.level > cursor.level) {
            if (cursor.parent != null) {
                cursor = cursor.parent;
                continue;
            }
            break;
        }
        if (cursor.parent == null) {
            tree.push(node);
        } else {
            node.parent = cursor.parent;
            cursor.parent.children.push(node);
        }
    }
    cursor = node;
}

function wrapHeading(tree) {
    let html = '<ul>';
    tree.forEach(node => {
        html += `<li>`;
        html += `<a href="#${node.id}">${node.name}`
        if (node.children.length !== 0) {
            html += wrapHeading(node.children);
        }
        html += '</a></li>';
    });
    html += '</ul>';

    return html;
}

module.exports = toc;
