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
 * Process KaTeX math expressions.
 * Protects code blocks/inline code first, then processes $$...$$ and $...$.
 */
function processKaTeX(html) {
	// Step 1: Protect code blocks and inline code with placeholders
	const codeBlocks = [];
	let protectedHtml = html;

	// Protect <pre>...</pre> blocks
	protectedHtml = protectedHtml.replace(/<pre[\s\S]*?<\/pre>/gi, (match) => {
		const idx = codeBlocks.length;
		codeBlocks.push(match);
		return `\x00CODEBLOCK${idx}\x00`;
	});

	// Protect <code>...</code> inline
	protectedHtml = protectedHtml.replace(/<code[\s\S]*?<\/code>/gi, (match) => {
		const idx = codeBlocks.length;
		codeBlocks.push(match);
		return `\x00CODEBLOCK${idx}\x00`;
	});

	// Step 2: Process display math $$...$$
	protectedHtml = protectedHtml.replace(/\$\$([\s\S]+?)\$\$/g, (match, tex) => {
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

	// Step 3: Process inline math $...$
	// Avoid matching things like $5 or price $10 — require non-space after opening and before closing $
	protectedHtml = protectedHtml.replace(/\$([^\s$](?:[^$]*?[^\s$])?)\$/g, (match, tex) => {
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

	// Step 4: Restore code blocks
	protectedHtml = protectedHtml.replace(/\x00CODEBLOCK(\d+)\x00/g, (_, idx) => {
		return codeBlocks[Number(idx)];
	});

	return protectedHtml;
}

/**
 * Apply typographic enhancements
 */
function applyTypography(html) {
	// Protect code blocks
	const codeBlocks = [];
	let result = html;

	result = result.replace(/<pre[\s\S]*?<\/pre>/gi, (match) => {
		const idx = codeBlocks.length;
		codeBlocks.push(match);
		return `\x00TB${idx}\x00`;
	});

	result = result.replace(/<code[\s\S]*?<\/code>/gi, (match) => {
		const idx = codeBlocks.length;
		codeBlocks.push(match);
		return `\x00TB${idx}\x00`;
	});

	// Em dash: --- (but not in HTML comments or hr tags)
	result = result.replace(/---/g, '\u2014');
	// En dash: -- (but not in HTML comments)
	result = result.replace(/--/g, '\u2013');
	// Ellipsis
	result = result.replace(/\.\.\./g, '\u2026');

	// Restore
	result = result.replace(/\x00TB(\d+)\x00/g, (_, idx) => {
		return codeBlocks[Number(idx)];
	});

	return result;
}

/**
 * Main render function.
 * Returns { html, frontmatter, headings }
 */
export function renderMarkdown(markdownText, language = 'de') {
	if (!markdownText || !markdownText.trim()) {
		return { html: '', frontmatter: {}, headings: [] };
	}

	// Parse frontmatter
	const { frontmatter, body } = parseFrontmatter(markdownText);

	// Collect headings
	const headings = [];

	// Configure marked
	const marked = new Marked();

	const renderer = {
		heading({ text, depth }) {
			const id = slugify(text);
			headings.push({ level: depth, id, text });
			return `<h${depth} id="${id}">${text}</h${depth}>`;
		},
		code({ text, lang }) {
			const language = lang && hljs.getLanguage(lang) ? lang : null;
			const highlighted = language
				? hljs.highlight(text, { language }).value
				: hljs.highlightAuto(text).value;
			const langClass = language ? `hljs language-${language}` : 'hljs';
			return `<pre><code class="${langClass}">${highlighted}</code></pre>`;
		}
	};

	marked.use({
		renderer,
		gfm: true,
		breaks: false
	});

	// Render markdown to HTML
	let html = marked.parse(body);

	// Process KaTeX math
	html = processKaTeX(html);

	// Apply typographic enhancements
	html = applyTypography(html);

	return { html, frontmatter, headings };
}
