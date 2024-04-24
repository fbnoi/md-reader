const { cleanUrl, escape, id } = require('../util/helper');

const renderer = {
    code(code, infostring, escaped) {
        const lang = (infostring || '').match(/^\S*/)?.[0];
        code = code.replace(/\n$/, '') + '\n';

        if (!lang) {
            return `<pre id="${id(code)}"><code id="${id('code' + code)}" class="highlight">`
                + (escaped ? code : escape(code, true))
                + '</code></pre>\n';
        }
        return `<pre id="${id(code)}"><code id="${id('code' + code)}" class="highlight language-`
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
        return `<h${level} id="${id(text)}"><a href="#${id(text)}" id="${id(text + '_link')}" tabindex="-1">${text}</a></h${level}>\n`;
    },

    list(body, ordered, start) {
        const type = ordered ? 'ol' : 'ul';
        const startatt = (ordered && start !== 1) ? (' start="' + start + '"') : '';
        return `<${type}${startatt} id="${id(body)}">\n${body}</${type}>\n`;
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

    table(header, body) {
        if (body) body = `<tbody id="${id(body)}">${body}</tbody>`;
    
        return '<table id="'+ id(header + body) +'">\n'
            + '<thead id="'+ id(header) +'">\n'
            + header
            + '</thead>\n'
            + body
            + '</table>\n';
    },

    tablerow(content) {
        return `<tr id="${id}">\n${content}</tr>\n`;
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
        let out = '<a href="' + href + '" id="' + id(text) + '" tabindex="-1" class="open-in-browser"';
        if (title) {
            out += ' title="' + title + '"';
        }
        out += '>' + text + '</a>';
        return out;
    },

    text(text) {
        return `<span id="${id(text)}">${text}</span>`
    }
}

module.exports = renderer
