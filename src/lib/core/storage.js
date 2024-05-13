const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
const fs = require('node:fs');
const path = require('node:path');

const storage = {
    _store: {},
    _xmlBuilder: new XMLBuilder({ format: true }),
    _xmlParser: new XMLParser({
        isArray: (tagName, jPath, isLeafNode, isAttribute) => {
            return ['file', 'dir', 'expandedDir', 'note'].indexOf(tagName) !== -1;
        }
    }),

    new(namespace, filepath) {
        const subCache = {
            _location: filepath,
            _store: {root: {}},
            add(name, value) {
                if (!this._store.root.hasOwnProperty(name)) {
                    this._store.root[name] = [];
                }
                if (!Array.isArray(this._store.root[name])) {
                    throw `key ${name} is already exist and is not an Array`;
                }
                this._store.root[name].push(value);
                this._persist();
            },
            addInTop(name, value) {
                if (typeof this._store.root[name] === undefined) {
                    this._store.root[name] = [];
                }
                if (!Array.isArray(this._store.root[name])) {
                    throw `key ${name} is already exist and is not an Array`;
                }
                this._store.root[name].unshift(value);
                this._persist();
            },
            remove(name, key) {
                this._store.root[name].splice(key, 1);
                this._persist();
            },
            set(name, value) {
                this._store.root[name] = value;
                this._persist();
            },
            del(name) {
                delete this._store.root[name];
                this._persist();
            },
            get(name, value = null) {
                let ret = this._store.root[name];
                if (typeof ret !== undefined) {
                    return ret;
                }
                return value;
            },
            all() {
                return this._store.root;
            },
            _persist() {
                const xmlContent = storage._xmlBuilder.build(this._store);
                const dir = path.dirname(this._location);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
                fs.writeFileSync(this._location, xmlContent);
            }
        }
        this._store[namespace] = subCache;
        if (fs.existsSync(filepath)) {
            const xmlContent = fs.readFileSync(filepath, {encoding: 'utf-8'});
            if (XMLValidator.validate(xmlContent) === true) {
                subCache._store = this._xmlParser.parse(fs.readFileSync(filepath));
            }
            if (typeof subCache._store.root !== 'object') {
                subCache._store.root = {};
            }
        }
        return subCache;
    },
    get(namespace, value = null) {
        let ret = this._store[namespace];
        if (typeof ret !== undefined) {
            return ret;
        }
        return value;
    },
    all() {
        return this._store;
    }
};

module.exports = storage;
