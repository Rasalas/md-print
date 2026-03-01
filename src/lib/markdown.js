import { Marked } from 'marked';
import katex from 'katex';
import hljs from 'highlight.js';

/**
 * Parse simple YAML-like frontmatter (key: value pairs between --- delimiters)
 */
function parseFrontmatter(text) {
	const match = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
	if (!match) return { frontmatter: {}, body: text };

	const frontmatter = {};
	const lines = match[1].split('\n');
	for (const line of lines) {
		const colonIndex = line.indexOf(':');
		if (colonIndex > 0) {
			const key = line.slice(0, colonIndex).trim();
			const value = line.slice(colonIndex + 1).trim();
			frontmatter[key] = value;
		}
	}

	return {
		frontmatter,
		body: text.slice(match[0].length)
	};
}

/**
 * Generate a URL-friendly slug from heading text
 */
function slugify(text) {
	return text
		.toLowerCase()
		.replace(/<[^>]*>/g, '')
		.replace(/[^\w\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.trim();
}

/**
 * Protect code blocks from transformation, apply a callback, then restore them.
 */
function withProtectedCode(html, tag, transform) {
	const blocks = [];

	let result = html.replace(/<pre[\s\S]*?<\/pre>/gi, (match) => {
		blocks.push(match);
		return `\x00${tag}${blocks.length - 1}\x00`;
	});

	result = result.replace(/<code[\s\S]*?<\/code>/gi, (match) => {
		blocks.push(match);
		return `\x00${tag}${blocks.length - 1}\x00`;
	});

	result = transform(result);

	return result.replace(new RegExp(`\x00${tag}(\\d+)\x00`, 'g'), (_, idx) => blocks[Number(idx)]);
}

/**
 * Process KaTeX math expressions.
 * Protects code blocks/inline code first, then processes $$...$$ and $...$.
 */
function processKaTeX(html) {
	return withProtectedCode(html, 'KATEX', (text) => {
		// Display math $$...$$
		text = text.replace(/\$\$([\s\S]+?)\$\$/g, (match, tex) => {
			try {
				return katex.renderToString(tex.trim(), {
					displayMode: true,
					throwOnError: false,
					trust: true
				});
			} catch {
				return `<span class="katex-error" title="KaTeX error">${match}</span>`;
			}
		});

		// Inline math $...$
		// Avoid matching things like $5 or price $10 — require non-space after opening and before closing $
		text = text.replace(/\$([^\s$](?:[^$]*?[^\s$])?)\$/g, (match, tex) => {
			try {
				return katex.renderToString(tex.trim(), {
					displayMode: false,
					throwOnError: false,
					trust: true
				});
			} catch {
				return `<span class="katex-error" title="KaTeX error">${match}</span>`;
			}
		});

		return text;
	});
}

/**
 * Apply typographic enhancements
 */
function applyTypography(html) {
	return withProtectedCode(html, 'TYPO', (text) => {
		// Em dash: --- (but not in HTML comments or hr tags)
		text = text.replace(/---/g, '\u2014');
		// En dash: -- (but not in HTML comments)
		text = text.replace(/--/g, '\u2013');
		// Ellipsis
		text = text.replace(/\.\.\./g, '\u2026');
		return text;
	});
}

// Shared Marked instance — config is static, only the heading collector changes per call
const marked = new Marked();

/**
 * Main render function.
 * Returns { html, frontmatter, headings }
 */
export function renderMarkdown(markdownText) {
	if (!markdownText || !markdownText.trim()) {
		return { html: '', frontmatter: {}, headings: [] };
	}

	const { frontmatter, body } = parseFrontmatter(markdownText);
	const headings = [];

	marked.use({
		renderer: {
			heading({ text, depth }) {
				const id = slugify(text);
				headings.push({ level: depth, id, text });
				return `<h${depth} id="${id}">${text}</h${depth}>`;
			},
			code({ text, lang }) {
				const resolved = lang && hljs.getLanguage(lang) ? lang : null;
				const highlighted = resolved
					? hljs.highlight(text, { language: resolved }).value
					: hljs.highlightAuto(text).value;
				const langClass = resolved ? `hljs language-${resolved}` : 'hljs';
				return `<pre><code class="${langClass}">${highlighted}</code></pre>`;
			}
		},
		gfm: true,
		breaks: false
	});

	let html = marked.parse(body);
	html = processKaTeX(html);
	html = applyTypography(html);

	return { html, frontmatter, headings };
}
