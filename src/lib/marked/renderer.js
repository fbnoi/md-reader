const { cleanUrl, escape, id } = require('./helper');

const renderer = {
    code(code, infostring, escaped) {
        const lang = (infostring || '').match(/^\S*/)?.[0];

        code = code.replace(/\n$/, '') + '\n';

        if (!lang) {
            return '<pre><code class="highlight">'
                + (escaped ? code : escape(code, true))
                + '</code></pre>\n';
        }

        return '<pre><code class="highlight language-'
            + escape(lang)
            + '">'
            + (escaped ? code : escape(code, true))
            + '</code></pre>\n';
    },

    blockquote(quote) {
        return `<blockquote id="${id(quote)}">\n${quote}</blockquote>\n`;
    },

    html(html, block) {
        return '';
    },

    heading(text, level, raw) {
        return `<h${level} id="${id(text)}"><a href="#${id(text)}" id="${id(text + '_link')}">${text}</a></h${level}>\n`;
    },

    listitem(text, task, checked) {
        return `<li id="${id(text)}">${text}</li>\n`;
    },

    checkbox(checked) {
        return '<input '
            + (checked ? 'checked="" ' : '')
            + 'disabled="" type="checkbox">';
    },

    paragraph(text) {
        return `<p id="${id(text)}">${text}</p>\n`;
    },

    tablerow(content) {
        return `<tr>\n${content}</tr>\n`;
    },

    tablecell(content, flags) {
        const type = flags.header ? 'th' : 'td';
        const tag = flags.align
            ? `<${type} align="${flags.align}" id="${id(content)}">`
            : `<${type} id="${id(content)}">`;
        return tag + content + `</${type}>\n`;
    },

    /**
     * span level renderer
     */
    strong(text) {
        return `<strong id="${id(text)}">${text}</strong>`;
    },

    em(text) {
        return `<em id="${id(text)}">${text}</em>`;
    },

    codespan(text) {
        return `<code id="${id(text)}">${text}</code>`;
    },

    del(text) {
        return `<del id="${id(text)}">${text}</del>`;
    },

    link(href, title, text) {
        const cleanHref = cleanUrl(href);
        if (cleanHref === null) {
            return text;
        }
        href = cleanHref;
        let out = '<a href="' + href + '" id="' + id(text) + '"';
        if (title) {
            out += ' title="' + title + '"';
        }
        out += '>' + text + '</a>';
        return out;
    },

    // image(href, title, text) {
    //     const cleanHref = cleanUrl(href);
    //     if (cleanHref === null) {
    //         return text;
    //     }
    //     href = cleanHref;

    //     let out = `<img src="${href}" alt="${text}"`;
    //     if (title) {
    //         out += ` title="${title}" id="${id(text)}"`;
    //     }
    //     out += '>';
    //     return out;
    // },
}

module.exports = renderer
