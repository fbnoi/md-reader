const { XMLParser, XMLBuilder } = require("fast-xml-parser");
const { id } = require("../util/helper");
const fs = require('node:fs');
const path = require('node:path');

const parser = new XMLParser();
const builder = new XMLBuilder();

const cache = {
    _strore: {},
    new(namespace, dir) {
        const subCache = {
            _dir: dir,
            _strore: {},
            setCacheDir(dir) {
                subCache._dir = dir
            },
            set(name, value) {
                subCache._strore[name] = value;
                subCache.persist();
            },
            get(name, value = null) {
                let ret = subCache._strore[name];
                if (typeof ret != 'undefined') {
                    return ret;
                }
                return value;
            },
            del(name) {
                delete subCache._strore[name];
            },
            read(filepath) {
                let stat = fs.statSync(filepath);
                if (stat.isFile()) {
                    subCache._strore = parser.parse(fs.readFileSync(filepath));
                }
            },
            persist() {
                let xmlContent = builder.build(subCache._strore);
                if (!fs.existsSync(subCache._dir)) {
                    fs.mkdirSync(subCache._dir, { recursive: true });
                }
                let filepath = path.join(subCache._dir, 'cache.xml');
                fs.writeFileSync(filepath, xmlContent);
            }
        }
        cache._strore[namespace] = subCache;
        return subCache;
    },
    get(namespace) {
        return _strore[namespace];
    }
};

module.exports = cache;
