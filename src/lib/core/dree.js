const fs = require('node:fs');
const path = require('node:path');

const defaultOptions = {
    exclude: null,
    extensions: /\.md$/,
    reserveEmptyDir: false,
    sortKey: 'name',
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
            if (stat.isFile()) {
                if (!options.extensions || options.extensions.test(file)) {
                    tree.push({ name: file, path: pathname, type: dreeType.TYPE_FILE });
                }
            } else if (stat.isDirectory() && !options.exclude || !options.exclude.test(file)) {
                const dirTree = { name: file, path: pathname, children: [], type: dreeType.TYPE_DIR }
                readDir(pathname, dirTree);
                if (options.reserveEmptyDir || dirTree.children.length != 0) {
                    sortChildren(dirTree);
                    tree.push(dirTree);
                }
            }
        });
        sortChildren(tree);
    }

    const debug = (node) => {
        console.log(node.path);
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
            html += `<span path="${node.path}">${node.name}</span>`
            if (node.children.length !== 0) {
                html += wrapHeading(node.children);
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
}

module.exports = { dree, dreeType }
