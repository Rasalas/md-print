<script>
	import { tick } from 'svelte';
	import { appState } from './state.svelte.js';
	import { renderMarkdown } from './markdown.js';
	import { PAPER_SIZES, PAGE_MARGINS, TOC_LABELS } from './config.js';

	let debounceTimer;
	let paperRef;

	// Debounced rendering
	let renderedResult = $state({ html: '', frontmatter: {}, headings: [] });

	$effect(() => {
		const content = appState.content;

		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			renderedResult = renderMarkdown(content);
		}, 150);

		return () => clearTimeout(debounceTimer);
	});

	let paper = $derived(PAPER_SIZES[appState.paperSize] || PAPER_SIZES.A4);

	let pageStyle = $derived.by(() => {
		const margin = PAGE_MARGINS.map(v => v + 'mm').join(' ');
		let style = `@page { size: ${paper.page}; margin: ${margin};`;
		if (appState.showPageNumbers) {
			style += ` @bottom-center { content: counter(page); font-size: 10pt; color: #555; }`;
		}
		style += ` }`;
		return style;
	});

	let paperStyle = $derived(`width: ${paper.width}; min-height: ${paper.page.split(' ')[1]};`);

	// TOC HTML
	let tocHtml = $derived.by(() => {
		if (!appState.showToc || renderedResult.headings.length === 0) return '';

		let html = '<nav class="toc">';
		html += `<div class="toc-title">${TOC_LABELS[appState.language] || TOC_LABELS.de}</div>`;
		html += '<ul>';
		for (const h of renderedResult.headings) {
			html += `<li class="toc-h${h.level}"><a href="#${h.id}">${h.text}</a></li>`;
		}
		html += '</ul></nav>';
		return html;
	});

	// Frontmatter header HTML
	let frontmatterHtml = $derived.by(() => {
		const fm = renderedResult.frontmatter;
		if (!fm.title && !fm.author && !fm.date) return '';

		let html = '<header class="frontmatter-header">';
		if (fm.title) html += `<h1 class="doc-title">${fm.title}</h1>`;
		if (fm.author) html += `<div class="doc-author">${fm.author}</div>`;
		if (fm.date) html += `<div class="doc-date">${fm.date}</div>`;
		if (fm.abstract) html += `<div class="doc-abstract">${fm.abstract}</div>`;
		html += '</header>';
		return html;
	});

	// --- Pagination ---
	$effect(() => {
		// Track reactive dependencies
		renderedResult.html;
		appState.paperSize;
		appState.theme;
		appState.showToc;

		tick().then(() => {
			if (paperRef) paginatePreview(paperRef);
		});
	});

	function paginatePreview(el) {
		// Skip on mobile widths
		if (el.offsetWidth < 400) return;

		// 1. Remove existing gaps, fillers, and paginated classes (idempotent)
		for (const gap of el.querySelectorAll('.page-gap')) gap.remove();
		for (const fill of el.querySelectorAll('.page-filler')) fill.remove();
		for (const pb of el.querySelectorAll('.paginated')) pb.classList.remove('paginated');

		// 2. Measure content height per page via probe
		const pageH = PAPER_SIZES[appState.paperSize]?.page.split(' ')[1] || '297mm';
		const [mTop, , mBottom] = PAGE_MARGINS;

		const probe = document.createElement('div');
		probe.style.cssText = `height: calc(${pageH} - ${mTop}mm - ${mBottom}mm); position: absolute; visibility: hidden;`;
		el.appendChild(probe);
		const slotHeight = probe.offsetHeight;
		probe.remove();

		if (slotHeight <= 0) return;

		// Minimum content height after a heading before it counts as
		// "anchored" — roughly 5–6 lines of body text.
		// Below this threshold the heading gets pulled to the next page.
		const minAfterHeading = slotHeight * 0.20;

		// 3. Walk top-level children, accumulate height
		const children = Array.from(el.children);
		let used = 0;
		let pageNum = 1;
		let lastHeading = null;       // most recent heading element
		let usedBeforeLastHeading = 0; // `used` just before that heading
		let contentAfterHeading = 0;   // height accumulated after the heading

		for (const child of children) {
			const h = child.offsetHeight;

			// Manual pagebreak
			if (child.classList.contains('pagebreak')) {
				child.classList.add('paginated');
				el.insertBefore(createPageGap(pageNum), child);
				used = 0;
				pageNum++;
				lastHeading = null;
				continue;
			}

			// Would this element overflow the current page?
			if (used > 0 && used + h > slotHeight) {
				// Heading protection (like LaTeX \needspace):
				// If a recent heading hasn't been followed by enough
				// content, pull it (and everything after it) to the
				// next page so it doesn't sit stranded at the bottom.
				if (lastHeading && contentAfterHeading < minAfterHeading) {
					el.insertBefore(createPageGap(pageNum), lastHeading);
					pageNum++;
					used = (used - usedBeforeLastHeading) + h;
				} else {
					el.insertBefore(createPageGap(pageNum), child);
					pageNum++;
					used = h;
				}
				lastHeading = null;
			} else {
				used += h;
			}

			// Track headings (h1-h6) for widow protection
			const tag = child.tagName;
			if (tag && /^H[1-6]$/.test(tag)) {
				lastHeading = child;
				usedBeforeLastHeading = used - h;
				contentAfterHeading = 0;
			} else if (lastHeading) {
				contentAfterHeading += h;
				// Once enough content follows, the heading is "anchored"
				if (contentAfterHeading >= minAfterHeading) {
					lastHeading = null;
				}
			}
		}

		// 4. Pad last page to full height
		if (pageNum > 1 && used > 0 && used < slotHeight) {
			const filler = document.createElement('div');
			filler.className = 'page-filler';
			filler.style.height = (slotHeight - used) + 'px';
			el.appendChild(filler);
		}
	}

	function createPageGap(pageNumber) {
		const gap = document.createElement('div');
		gap.className = 'page-gap';
		gap.setAttribute('data-page', pageNumber);
		return gap;
	}
</script>

<svelte:head>
	{@html `<style id="page-style">${pageStyle}</style>`}
</svelte:head>

<div class="preview-container">
	<div class="preview-panel-header panel-header">
		<span class="panel-title">Vorschau</span>
		<span class="panel-info">{appState.paperSize} / {appState.theme}</span>
	</div>

	<div class="preview-scroll">
		<div
			bind:this={paperRef}
			class="paper"
			data-theme={appState.theme}
			lang={appState.language}
			style={paperStyle}
		>
			{#if frontmatterHtml}
				{@html frontmatterHtml}
			{/if}

			{#if tocHtml}
				{@html tocHtml}
			{/if}

			{@html renderedResult.html}
		</div>
	</div>
</div>

<style>
	.preview-container {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
		background: var(--app-bg);
	}

	.panel-info {
		font-size: 0.7rem;
		color: var(--app-text-muted);
		font-family: var(--font-editor);
	}

	.preview-scroll {
		flex: 1;
		overflow-y: auto;
		padding: 2em;
		display: flex;
		justify-content: center;
		background: #1a181e;
	}

	.paper {
		max-width: 210mm;
		min-height: 297mm;
		padding: 25mm 20mm 30mm 20mm;
		box-shadow:
			0 1px 3px rgba(0, 0, 0, 0.3),
			0 4px 12px rgba(0, 0, 0, 0.2),
			0 12px 40px rgba(0, 0, 0, 0.15);
		border-radius: 2px;
		flex-shrink: 0;
		align-self: flex-start;
		transition: width 0.3s ease;
	}

	/* Responsive paper sizing */
	@media (max-width: 768px) {
		.preview-scroll {
			padding: 1em;
		}

		.paper {
			width: 100% !important;
			max-width: 100%;
			min-height: auto;
			padding: 1.5em;
			box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
		}
	}

</style>
