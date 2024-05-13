const path = require('node:path');

const { cleanUrl, id } = require('../util/helper');

const localImage = {
    basepath: __dirname,
    extension: () => {
        return {
            name: 'image',
            renderer(token) {
                const cleanHref = cleanUrl(token.href);
                if (cleanHref === null) {
                    return token.text;
                }
                let href = cleanHref;
                if (!href.startsWith('http') && !path.isAbsolute(href)) {
                    href = path.join(localImage.basepath, href);
                }
                let out = `<img src="${href}" alt="${token.text}" id="${id(token.href)}"`;
                if (token.title) {
                    out += ` title="${token.title}" `;
                }
                out += '>';
                return out;
            },
        }
    },
    setBasePath: (basepath) => {
        localImage.basepath = basepath;
    }
};

module.exports = localImage;
