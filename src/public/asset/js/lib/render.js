(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
		typeof define === 'function' && define.amd ? define(['exports'], factory) :
			(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.render = {}));
})(this, (function (exports) {
	'use strict';
	nunjucks.configure('../template', { autoescape: true });

	function markdown(md) {
		const entity = {
			content: null,
			toc: null,
		};
		const mdHljs = markedHighlight.markedHighlight({
			langPrefix: 'hljs language-',
			highlight(code, lang, info) {
				const language = hljs.getLanguage(lang) ? lang : 'plaintext';

				return hljs.highlight(code, { language }).value;
			}
		});
		marked.use(mdHljs);
		marked.use(markedGfmHeadingId.gfmHeadingId({ prefix: '' }));
		entity.content = marked.parse(md);
		entity.toc = nunjucks.render('toc.html.njk', { 'items': markedGfmHeadingId.getHeadingList() });

		return entity;
	}

	function fileTree(tree) {
		return nunjucks.render('file_tree.html.njk', { 'root': tree });
	}

	exports.markdown = markdown;
	exports.fileTree = fileTree;
}));