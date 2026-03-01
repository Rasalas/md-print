<script>
	import { appState } from './state.svelte.js';
	import { renderMarkdown } from './markdown.js';
	import { PAPER_SIZES, TOC_LABELS } from './config.js';

	let debounceTimer;

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

	let pageStyle = $derived(`@page { size: ${paper.page}; margin: 25mm 20mm 30mm 20mm; }`);

	let paperStyle = $derived(`width: ${paper.width};`);

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
