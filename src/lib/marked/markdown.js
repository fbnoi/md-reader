const marked = require('marked');
const renderer = require('./renderer');
const toc = require('./toc');
const doc = {
    html: null,
    toc: null,
};

marked.use({ renderer: renderer, walkTokens: toc.heading });

const markdown = {
    makeHtml(markdown) {
        doc.html = marked.parse(markdown);
        doc.toc = toc.getHeadings()
        return doc;
    },

    fileTree(tree) {
        return nunjucks.render('file_tree.html.njk', { 'root': tree });
    }
}

module.exports = markdown
