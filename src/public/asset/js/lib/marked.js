(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
		typeof define === 'function' && define.amd ? define(['exports'], factory) :
			(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.myMarked = {}));
})(this, (function (exports) {
	'use strict';
	let content = '';
	let toc = '';

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
		let toc = '<div class="toc">';
		headers.forEach(element => {
			toc += `<div class="toc-${element.level}">`;
			toc += `<a class="toc-${element.level}-link" href="#${element.id}">`;
			toc += element.text;
			toc += '</a></div>';
		});
		toc += '</div>';

		return toc;
	}

	exports.parse = parse;
	exports.getContent = getContent;
	exports.getToc = getToc;
}));