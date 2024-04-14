const fs = require('node:fs');
const path = require('node:path');

const defaultOptions = {
    exclude: null,
    extensions: /\.md$/,
    reserveEmptyDir: false,
    sortKey: 'mtimeMs',
    sortOrder: 'asc'
};

const dreeType = { TYPE_DIR: 1, TYPE_FILE: 2 };

const dree = (dir, options = null) => {
    const getSortValue = (node) => {
        if (typeof options.sortKey == 'string' && node.hasOwnProperty(options.sortKey)) {
            return node[options.sortKey];
        } else if (typeof options.sortKey == 'function') {
            return options.sortKey(node);
        }

        throw "options.sortKey must be a property of node or a callable function";
    }

    const getSortOrder = () => {
        if (options.sortOrder == 'asc') {
            return 1;
        } else if (options.sortOrder == 'desc') {
            return -1;
        }

        throw "options.sortOrder must be asc or desc";
    }

    const mergeOptions = (options) => {
        for (const property in options) {
            if (!defaultOptions.hasOwnProperty(property)) {
                throw `undefined option: ${property}`;
            }
        }

        for (const property in defaultOptions) {
            if (!options.hasOwnProperty(property)) {
                options[property] = defaultOptions[property];
            }
        }
    }

    const validateOptions = () => {
        getSortValue(node);
        getSortOrder();
        if (options.extensions != null && !options.extensions instanceof RegExp) {
            throw `options.extensions must be a RegExp`;
        }
        if (options.exclude != null && !options.exclude instanceof RegExp) {
            throw `options.extensions must be a RegExp`;
        }

        if (typeof options.reserveEmptyDir != 'boolean') {
            throw `options.reserveEmptyDir must be a boolean`;
        }
    }

    const sortChildren = (tree) => {
        tree.sort((n1, n2) => {
            let k1 = getSortValue(n1);
            let k2 = getSortValue(n2);
            if (n1.type == n2.type && n1.type) {
                if (k1 > k2) {
                    return getSortOrder();
                } else if (k1 < k2) {
                    return getSortOrder() * -1;
                } else {
                    return 0;
                }
            } else {
                return n1.type == dreeType.TYPE_DIR ? -1 : 1;
            }
        });
    }

    function readDir(dir, tree) {
        fs.readdirSync(dir).forEach(file => {
            let pathname = path.join(dir, file);
            let stat = fs.statSync(pathname);
            const node = { name: file, path: pathname, ctimeMs: stat.ctimeMs, mtimeMs: stat.mtimeMs };
            if (stat.isFile()) {
                if (!options.extensions || options.extensions.test(file)) {
                    node.type = dreeType.TYPE_FILE;
                    tree.push(node);
                }
            } else if (stat.isDirectory() && !options.exclude || !options.exclude.test(file)) {
                node.type = dreeType.TYPE_DIR;
                node.children = [];
                readDir(pathname, node.children);
                if (options.reserveEmptyDir || node.children.length != 0) {
                    sortChildren(node.children);
                    tree.push(node);
                }
            }
        });
        sortChildren(tree);
    }

    const debug = (node) => {
        if (node.type == dreeType.TYPE_DIR) {
            node.children.forEach(node => {
                debug(node);
            });
        }
    }

    const render = (tree) => {
        let html = '<ul>';
        tree.forEach(node => {
            html += `<li>`;
            html += `<a property-path="${node.path}" property-type="${node.type}" href="#" tabindex="-1">`;
            html += `<i class="fa-regular ${node.type === dreeType.TYPE_DIR ? 'fa-folder' : 'fa-file'}"></i>`;
            html += node.name;
            html += `</a>`;
            if (node.type === dreeType.TYPE_DIR) {
                html += render(node.children);
            }
            html += '</li>';
        });
        html += '</ul>';

        return html;
    }

    if (options == null) {
        options = defaultOptions;
    } else {
        mergeOptions(options);
        validateOptions();
    }
    const node = {
        name: path.basename(dir),
        path: dir,
        children: [],
        type: dreeType.TYPE_DIR,
    };

    const root = [];

    readDir(dir, root);

    return root;

    return render(root);
}

module.exports = { dree, dreeType }
