(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
		typeof define === 'function' && define.amd ? define(['exports'], factory) :
			(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.myMarked = {}));
})(this, (function (exports) {
	'use strict';
	let content = '';
	let toc = '';
	const env = nunjucks.configure('../template', { autoescape: true });

	function parse(markdown) {
		const mdHljs = markedHighlight.markedHighlight({
			langPrefix: 'hljs language-',
			highlight(code, lang, info) {
				const language = hljs.getLanguage(lang) ? lang : 'plaintext';

				return hljs.highlight(code, { language }).value;
			}
		});
		marked.use(mdHljs);
		marked.use(markedGfmHeadingId.gfmHeadingId({ prefix: '' }));
		content = marked.parse(markdown);
		toc = parseToc(markedGfmHeadingId.getHeadingList());
	}

	function getContent() {
		return content;
	}

	function getToc() {
		return toc;
	}

	const parseToc = (headers) => {
		return nunjucks.render('toc.html.njk', {'items': headers});
	}

	exports.parse = parse;
	exports.getContent = getContent;
	exports.getToc = getToc;
}));