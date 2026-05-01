import { paginatePaper, resetPagination } from './pagination.js';

const EXPORT_PRINT_STYLES = `
html, body {
	margin: 0 !important;
	padding: 0 !important;
	background: #fff !important;
}

body {
	overflow: visible !important;
}

.paper.export-paper {
	margin: 0 !important;
	width: var(--paper-width, 210mm) !important;
	max-width: var(--paper-width, 210mm) !important;
	min-height: auto !important;
	padding: 25mm 20mm 30mm 20mm !important;
	box-sizing: border-box !important;
	box-shadow: none !important;
	border-radius: 0 !important;
}

.paper.export-paper .page-gap {
	display: block !important;
	margin: 0 !important;
	background: transparent !important;
	break-before: page;
	page-break-before: always;
}

.paper.export-paper .page-filler,
.paper.export-paper .page-gap {
	display: block !important;
}

.paper.export-paper .page-filler {
	background: transparent !important;
}

.paper.export-paper .pagebreak {
	border: none !important;
	margin: 0 !important;
	height: 0 !important;
}

.paper.export-paper .pagebreak::after {
	display: none !important;
}

.paper.export-paper .pagebreak.paginated {
	display: none !important;
}

.paper.export-paper .page-gap + * {
	margin-top: 0 !important;
}

/* Keep print line wraps identical to preview */
.paper.export-paper a[href^="http"]::after {
	content: none !important;
}

.paper.export-paper pre {
	white-space: pre !important;
	word-wrap: normal !important;
}

.pagedjs_pages.export-pages {
	display: block !important;
	gap: 0 !important;
	margin: 0 !important;
	padding: 0 !important;
	width: auto !important;
	background: #fff !important;
	transform: none !important;
}

.pagedjs_pages.export-pages .pagedjs_page {
	margin: 0 !important;
	padding: 0 !important;
	box-shadow: none !important;
	border-radius: 0 !important;
	break-after: page;
	page-break-after: always;
}

.pagedjs_pages.export-pages .pagedjs_page:last-child {
	break-after: auto;
	page-break-after: auto;
}
`;

function getPagedSource() {
	return document.querySelector('.paged-preview .pagedjs_pages');
}

function getPaperSource() {
	return document.querySelector('.fallback-paper');
}

function getPaperSize(source) {
	const styleSource = source.closest('.paged-preview') || source;
	const width = styleSource.style.getPropertyValue('--paper-width').trim();
	const height = styleSource.style.getPropertyValue('--paper-min-h').trim();
	if (!width || !height) return null;
	return `${width} ${height}`;
}

function getDocumentTitle(source) {
	return source.querySelector('.doc-title')?.textContent?.trim() || 'document';
}

function collectHeadStyles() {
	return Array.from(document.head.querySelectorAll('link[rel="stylesheet"], style:not(#page-style)'))
		.map((node) => node.outerHTML)
		.join('\n');
}

function escapeHtml(text) {
	return text
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;');
}

async function waitForAssets(doc) {
	const imagePromises = Array.from(doc.images)
		.filter((img) => !img.complete)
		.map(
			(img) =>
				new Promise((resolve) => {
					img.addEventListener('load', resolve, { once: true });
					img.addEventListener('error', resolve, { once: true });
				})
		);

	await Promise.all(imagePromises);
	if (doc.fonts?.ready) {
		try {
			await doc.fonts.ready;
		} catch {
			// Ignore font loading errors for print/export.
		}
	}

	await new Promise((resolve) => setTimeout(resolve, 50));
}

function waitForImageElements(images) {
	const pending = Array.from(images)
		.filter((img) => !img.complete)
		.map(
			(img) =>
				new Promise((resolve) => {
					img.addEventListener('load', resolve, { once: true });
					img.addEventListener('error', resolve, { once: true });
				})
		);
	return Promise.all(pending);
}

function normalizeExportNodes(paper, options = {}) {
	if (paper.classList.contains('pagedjs_pages')) return;
	resetPagination(paper);
}

export function createExportSnapshot(options = {}) {
	const pagedSource = getPagedSource();
	if (pagedSource) {
		const pages = pagedSource.cloneNode(true);
		pages.classList.add('export-pages');

		return {
			paper: pages,
			kind: 'paged',
			title: getDocumentTitle(pagedSource),
			pageSize: getPaperSize(pagedSource)
		};
	}

	const source = getPaperSource();
	if (!source) return null;

	const paper = source.cloneNode(true);
	paper.classList.add('export-paper');
	normalizeExportNodes(paper, options);

	return {
		paper,
		kind: 'paper',
		title: getDocumentTitle(source),
		pageSize: getPaperSize(source)
	};
}

export function mountExportSnapshot(options = {}) {
	const snapshot = createExportSnapshot(options);
	if (!snapshot) return null;

	const host = document.createElement('div');
	host.style.cssText = 'position: fixed; left: 0; top: 0; z-index: -1; pointer-events: none;';
	host.appendChild(snapshot.paper);
	document.body.appendChild(host);

	return {
		...snapshot,
		cleanup: () => host.remove()
	};
}

export async function waitForExportSnapshot(rootEl) {
	if (!rootEl) return;
	await waitForImageElements(rootEl.querySelectorAll('img'));
	if (document.fonts?.ready) {
		try {
			await document.fonts.ready;
		} catch {
			// Ignore font loading errors for export.
		}
	}
	if (!rootEl.classList.contains('pagedjs_pages')) {
		paginatePaper(rootEl, { showPageNumbers: false, mode: 'export' });
	}
	await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

export async function printPreviewDocument() {
	const snapshot = mountExportSnapshot({ mode: 'print' });
	if (!snapshot) return false;

	const iframe = document.createElement('iframe');
	iframe.setAttribute('aria-hidden', 'true');
	iframe.style.cssText =
		'position: fixed; right: 0; bottom: 0; width: 0; height: 0; border: 0; opacity: 0; pointer-events: none;';
	document.body.appendChild(iframe);

	const cleanup = () => {
		if (iframe.parentNode) iframe.remove();
	};

	try {
		await waitForExportSnapshot(snapshot.paper);

		const doc = iframe.contentDocument;
		const win = iframe.contentWindow;
		if (!doc || !win) {
			snapshot.cleanup();
			cleanup();
			return false;
		}

		const pageRule = snapshot.pageSize
			? `@page { size: ${snapshot.pageSize}; margin: 0; }`
			: '@page { margin: 0; }';
		const headStyles = collectHeadStyles();

		doc.open();
		doc.write(`<!doctype html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>${escapeHtml(snapshot.title)}</title>
		${headStyles}
		<style>${pageRule}${EXPORT_PRINT_STYLES}</style>
	</head>
	<body>${snapshot.paper.outerHTML}</body>
</html>`);
		doc.close();
		snapshot.cleanup();

		await waitForAssets(doc);

		win.addEventListener('afterprint', cleanup, { once: true });
		win.focus();
		win.print();
		setTimeout(cleanup, 1500);

		return true;
	} catch {
		snapshot.cleanup();
		cleanup();
		return false;
	}
}
