<script>
	import { appState } from './state.svelte.js';
	import AboutModal from './AboutModal.svelte';

	let isGenerating = $state(false);
	let showAbout = $state(false);

	async function downloadPdf() {
		isGenerating = true;
		try {
			const html2pdf = (await import('html2pdf.js')).default;
			const paper = document.querySelector('.paper');
			if (!paper) return;

			const title = paper.querySelector('.doc-title')?.textContent || 'document';
			const filename = title.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').toLowerCase();

			const formats = {
				A4: 'a4',
				Letter: 'letter',
				Legal: 'legal'
			};

			await html2pdf()
				.set({
					margin: [25, 20, 30, 20],
					filename: `${filename}.pdf`,
					image: { type: 'jpeg', quality: 0.98 },
					html2canvas: { scale: 2, useCORS: true },
					jsPDF: {
						unit: 'mm',
						format: formats[appState.paperSize] || 'a4',
						orientation: 'portrait'
					},
					pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
				})
				.from(paper)
				.save();
		} finally {
			isGenerating = false;
		}
	}
</script>

<header class="app-header">
	<div class="header-left">
		<div class="logo">
			<span class="logo-text">md<span class="logo-dot">·</span>print</span>
		</div>
		<span class="subtitle">Beautiful Markdown Printing</span>
	</div>

	<div class="header-controls">
		<div class="control-group">
			<label class="control-label" for="lang-select">Sprache</label>
			<select id="lang-select" bind:value={appState.language}>
				<option value="de">Deutsch</option>
				<option value="en">English</option>
				<option value="fr">Francais</option>
				<option value="es">Espanol</option>
				<option value="it">Italiano</option>
			</select>
		</div>

		<div class="control-group">
			<label class="control-label" for="paper-select">Papier</label>
			<select id="paper-select" bind:value={appState.paperSize}>
				<option value="A4">A4</option>
				<option value="Letter">Letter</option>
				<option value="Legal">Legal</option>
			</select>
		</div>

		<div class="control-group">
			<label class="control-label" for="theme-select">Thema</label>
			<select id="theme-select" bind:value={appState.theme}>
				<option value="klassisch">Klassisch</option>
				<option value="modern">Modern</option>
				<option value="editorial">Editorial</option>
			</select>
		</div>

		<button
			class="icon-btn"
			title="Über md·print"
			onclick={() => (showAbout = true)}
		>
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<circle cx="12" cy="12" r="10"></circle>
				<line x1="12" y1="16" x2="12" y2="12"></line>
				<line x1="12" y1="8" x2="12.01" y2="8"></line>
			</svg>
		</button>

		<button
			class="icon-btn"
			class:active={appState.showToc}
			title="Inhaltsverzeichnis"
			onclick={() => (appState.showToc = !appState.showToc)}
		>
			<!-- List/TOC icon -->
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<line x1="8" y1="6" x2="21" y2="6"></line>
				<line x1="8" y1="12" x2="21" y2="12"></line>
				<line x1="8" y1="18" x2="21" y2="18"></line>
				<line x1="3" y1="6" x2="3.01" y2="6"></line>
				<line x1="3" y1="12" x2="3.01" y2="12"></line>
				<line x1="3" y1="18" x2="3.01" y2="18"></line>
			</svg>
		</button>

		<button
			class="pdf-btn"
			title="Als PDF herunterladen"
			onclick={downloadPdf}
			disabled={isGenerating}
		>
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
				<polyline points="7 10 12 15 17 10"></polyline>
				<line x1="12" y1="15" x2="12" y2="3"></line>
			</svg>
			<span class="btn-label">{isGenerating ? 'PDF...' : 'PDF'}</span>
		</button>

		<button
			class="print-btn"
			title="Drucken (Ctrl+P)"
			onclick={() => window.print()}
		>
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<polyline points="6 9 6 2 18 2 18 9"></polyline>
				<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
				<rect x="6" y="14" width="12" height="8"></rect>
			</svg>
			<span class="btn-label">Drucken</span>
		</button>
	</div>
</header>

<AboutModal bind:open={showAbout} />

<style>
	.app-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 1.2em;
		height: 52px;
		background: var(--app-surface);
		border-bottom: 1px solid var(--app-border);
		flex-shrink: 0;
		gap: 1em;
	}

	.header-left {
		display: flex;
		align-items: baseline;
		gap: 0.8em;
		flex-shrink: 0;
	}

	.logo {
		flex-shrink: 0;
	}

	.logo-text {
		font-family: var(--font-ui);
		font-size: 1.2rem;
		font-weight: 700;
		letter-spacing: -0.02em;
		color: var(--app-text);
	}

	.logo-dot {
		color: var(--app-accent);
	}

	.subtitle {
		font-size: 0.75rem;
		color: var(--app-text-muted);
		font-weight: 400;
		white-space: nowrap;
	}

	.header-controls {
		display: flex;
		align-items: center;
		gap: 0.8em;
		flex-wrap: wrap;
		justify-content: flex-end;
	}

	.control-group {
		display: flex;
		align-items: center;
		gap: 0.35em;
	}

	.control-label {
		font-size: 0.7rem;
		color: var(--app-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-weight: 500;
	}

	select {
		appearance: none;
		background: var(--app-elevated);
		border: 1px solid var(--app-border);
		border-radius: 6px;
		padding: 0.3em 1.8em 0.3em 0.6em;
		font-size: 0.8rem;
		color: var(--app-text);
		cursor: pointer;
		font-family: var(--font-ui);
		transition: border-color 0.2s, box-shadow 0.2s;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238a8490' d='M3 4.5L6 8l3-3.5H3z'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 0.5em center;
	}

	select:hover {
		border-color: var(--app-accent);
	}

	select:focus {
		outline: none;
		border-color: var(--app-accent);
		box-shadow: 0 0 0 2px var(--app-accent-dim);
	}

	.icon-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 34px;
		height: 34px;
		background: var(--app-elevated);
		border: 1px solid var(--app-border);
		border-radius: 6px;
		color: var(--app-text-muted);
		cursor: pointer;
		transition: all 0.2s;
	}

	.icon-btn:hover {
		color: var(--app-text);
		border-color: var(--app-accent);
	}

	.icon-btn.active {
		color: var(--app-accent);
		border-color: var(--app-accent);
		background: var(--app-accent-dim);
	}

	.pdf-btn,
	.print-btn {
		display: flex;
		align-items: center;
		gap: 0.4em;
		padding: 0.35em 0.9em;
		border: 1px solid transparent;
		border-radius: 6px;
		font-size: 0.8rem;
		font-weight: 600;
		font-family: var(--font-ui);
		cursor: pointer;
		transition: all 0.2s;
	}

	.pdf-btn svg,
	.print-btn svg {
		flex-shrink: 0;
	}

	.pdf-btn {
		background: var(--app-elevated);
		border-color: var(--app-border);
		color: var(--app-text);
	}

	.pdf-btn:hover {
		border-color: var(--app-accent);
		color: var(--app-accent);
	}

	.pdf-btn:disabled {
		opacity: 0.6;
		cursor: wait;
	}

	.print-btn {
		background: var(--app-accent);
		color: #16141a;
	}

	.print-btn:hover {
		background: var(--app-accent-hover);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.app-header {
			flex-wrap: wrap;
			height: auto;
			padding: 0.6em 0.8em;
			gap: 0.5em;
		}

		.subtitle {
			display: none;
		}

		.header-controls {
			gap: 0.5em;
		}

		.control-label {
			display: none;
		}

		.btn-label {
			display: none;
		}
	}

	@media (max-width: 480px) {
		select {
			padding: 0.25em 1.5em 0.25em 0.4em;
			font-size: 0.75rem;
		}
	}

	@media print {
		.app-header {
			display: none !important;
		}
	}
</style>
