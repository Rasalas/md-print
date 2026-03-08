<script>
	import { tick } from 'svelte';
	import { appState } from './state.svelte.js';
	import { renderMarkdown } from './markdown.js';
	import { PAPER_SIZES, PAGE_MARGINS, TOC_LABELS } from './config.js';
	import { paginatePaper } from './pagination.js';

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

	let paperStyle = $derived(`--paper-width: ${paper.width}; --paper-min-h: ${paper.page.split(' ')[1]};`);

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
		appState.showPageNumbers;

		tick().then(() => {
			if (paperRef) paginatePaper(paperRef, { showPageNumbers: appState.showPageNumbers, skipIfNarrow: true });
		});
	});
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
		width: var(--paper-width, 210mm);
		max-width: 210mm;
		min-height: var(--paper-min-h, 297mm);
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
