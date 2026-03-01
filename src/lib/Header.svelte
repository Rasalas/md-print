<script>
	import { appState } from './state.svelte.js';
	import { PAPER_SIZES, PAGE_MARGINS } from './config.js';
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
			const format = (PAPER_SIZES[appState.paperSize] || PAPER_SIZES.A4).pdf;

			let worker = html2pdf()
				.set({
					margin: PAGE_MARGINS,
					filename: `${filename}.pdf`,
					image: { type: 'jpeg', quality: 0.98 },
					html2canvas: { scale: 2, useCORS: true },
					jsPDF: { unit: 'mm', format, orientation: 'portrait' },
					pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
				})
				.from(paper)
				.toPdf();

			if (appState.showPageNumbers) {
				worker = worker.get('pdf').then((pdf) => {
					const total = pdf.internal.getNumberOfPages();
					for (let i = 1; i <= total; i++) {
						pdf.setPage(i);
						pdf.setFontSize(10);
						pdf.setTextColor(85, 85, 85);
						pdf.text(
							String(i),
							pdf.internal.pageSize.getWidth() / 2,
							pdf.internal.pageSize.getHeight() - 15,
							{ align: 'center' }
						);
					}
				});
			}

			await worker.save();
		} finally {
			isGenerating = false;
		}
	}
</script>

<header class="app-header">
	<div class="header-row-top">
		<div class="header-left">
			<span class="logo-text">md<span class="logo-dot">·</span>print</span>
			<span class="subtitle">Beautiful Markdown Printing</span>
		</div>

		<div class="header-actions">
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
				class="icon-btn"
				class:active={appState.showPageNumbers}
				title="Seitenzahlen"
				onclick={() => (appState.showPageNumbers = !appState.showPageNumbers)}
			>
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<line x1="4" y1="9" x2="20" y2="9"></line>
					<line x1="4" y1="15" x2="20" y2="15"></line>
					<line x1="10" y1="3" x2="8" y2="21"></line>
					<line x1="16" y1="3" x2="14" y2="21"></line>
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
	</div>

	<div class="header-row-settings">
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
	</div>
</header>

<AboutModal bind:open={showAbout} />

<style>
	.app-header {
		display: flex;
		flex-direction: column;
		background: var(--app-surface);
		border-bottom: 1px solid var(--app-border);
		flex-shrink: 0;
	}

	.header-row-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 1.2em;
		height: 48px;
		gap: 1em;
	}

	.header-row-settings {
		display: flex;
		align-items: center;
		gap: 1em;
		padding: 0.4em 1.2em;
		border-top: 1px solid var(--app-border);
	}

	.header-left {
		display: flex;
		align-items: baseline;
		gap: 0.8em;
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

	.header-actions {
		display: flex;
		align-items: center;
		gap: 0.5em;
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
		.header-row-top {
			padding: 0 0.8em;
			height: 44px;
		}

		.header-row-settings {
			padding: 0.35em 0.8em;
			gap: 0.6em;
		}

		.subtitle {
			display: none;
		}

		.control-label {
			display: none;
		}

		.btn-label {
			display: none;
		}

		.icon-btn {
			width: 32px;
			height: 32px;
		}

		.pdf-btn,
		.print-btn {
			padding: 0.3em 0.6em;
		}
	}

	@media (max-width: 480px) {
		.header-row-settings {
			gap: 0.4em;
		}

		select {
			padding: 0.25em 1.5em 0.25em 0.4em;
			font-size: 0.75rem;
		}
	}
</style>
