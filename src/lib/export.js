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
	min-height: var(--paper-min-h, 297mm) !important;
	padding: 25mm 20mm 30mm 20mm !important;
	box-sizing: border-box !important;
	box-shadow: none !important;
	border-radius: 0 !important;
}

.paper.export-paper .page-gap {
	height: 0 !important;
	margin: 0 !important;
	background: transparent !important;
	break-before: page;
	page-break-before: always;
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
`;

function getPaperSource() {
	return document.querySelector('.paper');
}

function getPaperSize(source) {
	const width = source.style.getPropertyValue('--paper-width').trim();
	const height = source.style.getPropertyValue('--paper-min-h').trim();
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

function normalizeExportNodes(paper, options = {}) {
	const mode = options.mode || 'print';

	// Non-number filler blocks are visual helpers only.
	for (const filler of paper.querySelectorAll('.page-filler')) {
		if (!filler.classList.contains('page-number')) filler.remove();
	}

	if (mode === 'pdf') {
		// PDF page splitting is unstable with large spacer number blocks.
		// We render numbers with jsPDF after page generation.
		for (const num of paper.querySelectorAll('.page-number, .page-filler')) num.remove();
	}
}

export function createExportSnapshot(options = {}) {
	const source = getPaperSource();
	if (!source) return null;

	const paper = source.cloneNode(true);
	paper.classList.add('export-paper');
	normalizeExportNodes(paper, options);

	return {
		paper,
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

export async function printPreviewDocument() {
	const snapshot = createExportSnapshot({ mode: 'print' });
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
		const doc = iframe.contentDocument;
		const win = iframe.contentWindow;
		if (!doc || !win) {
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

		await waitForAssets(doc);

		win.addEventListener('afterprint', cleanup, { once: true });
		win.focus();
		win.print();
		setTimeout(cleanup, 1500);

		return true;
	} catch {
		cleanup();
		return false;
	}
}
