<script>
	import { onDestroy, tick } from 'svelte';
	import { appState } from './state.svelte.js';
	import { renderMarkdown } from './markdown.js';
	import { PAPER_SIZES, PAGE_MARGINS, TOC_LABELS } from './config.js';
	import { paginatePaper } from './pagination.js';
	import { createPagedStyles } from './pagedStyles.js';

	let debounceTimer;
	let pagedRef = $state();
	let fallbackPaperRef = $state();
	let activePreviewer;
	let queuedRenderOptions;
	let componentDestroyed = false;
	let pageCount = $state(0);
	let pagedError = $state(false);
	let pagedReady = $state(false);
	let isRendering = $state(false);
	let hasVisiblePages = $state(false);

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
		return `@page { size: ${paper.page}; margin: 0; }`;
	});

	let paperStyle = $derived.by(() => {
		const [top, right, bottom, left] = PAGE_MARGINS.map((value) => `${value}mm`);
		return [
			`--paper-width: ${paper.width}`,
			`--paper-min-h: ${paper.page.split(' ')[1]}`,
			`--page-margin-top: ${top}`,
			`--page-margin-right: ${right}`,
			`--page-margin-bottom: ${bottom}`,
			`--page-margin-left: ${left}`
		].join('; ');
	});

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

	let documentHtml = $derived(`${frontmatterHtml}${tocHtml}${renderedResult.html}`);

	function destroyPreviewer(previewer = activePreviewer, options = {}) {
		if (!previewer) return;
		const { removePages = true } = options;
		previewer.chunker?.stop?.();
		if (removePages && previewer.chunker?.pagesArea) {
			previewer.chunker.destroy();
		} else {
			for (const page of previewer.chunker?.pages || []) page.removeListeners?.();
		}
		previewer.polisher?.destroy?.();
		if (previewer === activePreviewer) activePreviewer = null;
	}

	async function renderPagedDocument(options) {
		queuedRenderOptions = options;
		if (isRendering) return;

		isRendering = true;
		try {
			while (queuedRenderOptions && !componentDestroyed) {
				const nextOptions = queuedRenderOptions;
				queuedRenderOptions = null;
				await renderPagedDocumentNow(nextOptions);
			}
		} finally {
			isRendering = false;
			hasVisiblePages = !!pagedRef?.querySelector('.pagedjs_page');
			if (queuedRenderOptions && !componentDestroyed) renderPagedDocument(queuedRenderOptions);
		}
	}

	async function renderPagedDocumentNow({ html, theme, language, pageSize, showPageNumbers }) {
		const target = pagedRef;
		if (!target) return;

		pagedError = false;
		hasVisiblePages = !!target.querySelector('.pagedjs_page');

		if (!html.trim()) {
			destroyPreviewer();
			target.innerHTML = '';
			pageCount = 0;
			hasVisiblePages = false;
			pagedReady = true;
			return;
		}

		let previewer;
		try {
			if (document.fonts?.ready) await document.fonts.ready;

			const { Previewer } = await import('pagedjs');
			if (queuedRenderOptions || componentDestroyed) return;

			const source = document.createElement('div');
			const paperSource = document.createElement('article');
			paperSource.className = 'paper paged-paper';
			paperSource.dataset.theme = theme;
			paperSource.lang = language;
			paperSource.innerHTML = html;
			source.appendChild(paperSource);

			previewer = new Previewer();
			const styles = createPagedStyles({ pageSize, showPageNumbers });
			const flow = await previewer.preview(source, [{ [window.location.href]: styles }], target);

			if (queuedRenderOptions || componentDestroyed) {
				destroyPreviewer(previewer);
				return;
			}

			const pages = previewer.chunker?.pagesArea;
			if (!pages) throw new Error('Paged preview did not produce pages.');

			const previousPreviewer = activePreviewer;
			activePreviewer = previewer;
			if (pages.parentElement !== target) target.appendChild(pages);
			for (const child of Array.from(target.children)) {
				if (child !== pages) child.remove();
			}
			if (previousPreviewer && previousPreviewer !== previewer) {
				destroyPreviewer(previousPreviewer, { removePages: false });
			}

			pageCount = flow.total || 0;
			hasVisiblePages = true;
			pagedReady = true;
		} catch (error) {
			console.error('Paged preview failed:', error);
			destroyPreviewer(previewer);
			if (queuedRenderOptions || componentDestroyed) return;

			pagedError = !target.querySelector('.pagedjs_page');
			pagedReady = !pagedError;
			hasVisiblePages = !pagedError;

			await tick();
			if (pagedError && fallbackPaperRef) {
				paginatePaper(fallbackPaperRef, {
					showPageNumbers: appState.showPageNumbers,
					skipIfNarrow: true
				});
			}
		}
	}

	onDestroy(() => {
		componentDestroyed = true;
		queuedRenderOptions = null;
		destroyPreviewer();
	});

	// --- Pagination ---
	$effect(() => {
		// Track reactive dependencies
		const html = documentHtml;
		const theme = appState.theme;
		const language = appState.language;
		const pageSize = paper.page;
		const showPageNumbers = appState.showPageNumbers;

		tick().then(() => {
			renderPagedDocument({ html, theme, language, pageSize, showPageNumbers });
		});
	});
</script>

<svelte:head>
	{@html `<style id="page-style">${pageStyle}</style>`}
</svelte:head>

<div class="preview-container">
	<div class="preview-panel-header panel-header">
		<span class="panel-title">Vorschau</span>
		<span class="panel-info">{appState.paperSize} / {appState.theme}{pageCount ? ` / ${pageCount}` : ''}</span>
	</div>

	<div class="preview-scroll">
		<div
			bind:this={pagedRef}
			class="paged-preview"
			class:rendering={isRendering && hasVisiblePages}
			style={paperStyle}
		></div>

		{#if pagedError}
			<div
				bind:this={fallbackPaperRef}
				class="paper fallback-paper"
				data-theme={appState.theme}
				lang={appState.language}
				style={paperStyle}
			>
				{@html documentHtml}
			</div>
		{/if}
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

	.paged-preview {
		width: var(--paper-width, 210mm);
		max-width: 210mm;
		flex-shrink: 0;
		align-self: flex-start;
	}

	.paged-preview :global(.pagedjs_pages) {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2em;
		width: 100%;
	}

	.paged-preview :global(.pagedjs_page) {
		background: var(--paper-bg);
		box-shadow:
			0 1px 3px rgba(0, 0, 0, 0.3),
			0 4px 12px rgba(0, 0, 0, 0.2),
			0 12px 40px rgba(0, 0, 0, 0.15);
		border-radius: 2px;
		overflow: hidden;
		flex-shrink: 0;
	}

	.paged-preview.rendering > :global(.pagedjs_pages + .pagedjs_pages) {
		opacity: 0;
		pointer-events: none;
	}

	.fallback-paper {
		width: var(--paper-width, 210mm);
		max-width: 210mm;
		min-height: var(--paper-min-h, 297mm);
		padding: var(--page-margin-top, 25mm) var(--page-margin-right, 20mm) var(--page-margin-bottom, 30mm) var(--page-margin-left, 20mm);
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

		.paged-preview,
		.fallback-paper {
			width: 100% !important;
			max-width: 100%;
			min-height: auto;
			box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
		}

		.fallback-paper {
			padding: 1.5em;
		}
	}

	@media print {
		.paged-preview {
			width: auto !important;
			max-width: none !important;
			opacity: 1 !important;
		}

		.paged-preview :global(.pagedjs_pages) {
			display: block !important;
			gap: 0 !important;
			margin: 0 !important;
			padding: 0 !important;
			width: auto !important;
			background: #fff !important;
			transform: none !important;
		}

		.paged-preview :global(.pagedjs_page) {
			margin: 0 !important;
			padding: 0 !important;
			box-shadow: none !important;
			border-radius: 0 !important;
			break-after: page;
			page-break-after: always;
		}

		.paged-preview :global(.pagedjs_page:last-child) {
			break-after: auto;
			page-break-after: auto;
		}
	}

</style>
