<script>
	let { open = $bindable(false) } = $props();

	function close() {
		open = false;
	}

	function handleBackdrop(e) {
		if (e.target === e.currentTarget) close();
	}

	function handleKey(e) {
		if (e.key === 'Escape') close();
	}
</script>

<svelte:window onkeydown={handleKey} />

{#if open}
	<div class="backdrop" onclick={handleBackdrop} role="dialog" aria-modal="true" aria-label="Über md·print">
		<div class="modal">
			<button class="close-btn" onclick={close} title="Schließen">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			</button>

			<div class="modal-header">
				<span class="modal-logo">md<span class="dot">·</span>print</span>
				<p class="modal-tagline">Beautiful Markdown Printing</p>
			</div>

			<div class="modal-body">
				<p class="about-text">
					Ein Open-Source-Werkzeug zur Umwandlung von Markdown in wunderschön
					gesetzte Druckseiten — mit professioneller Typografie, die an
					LaTeX-Qualität heranreicht.
				</p>

				<div class="section">
					<h3 class="section-title">Projekt</h3>
					<div class="link-list">
						<a href="https://github.com/Rasalas/md-print" target="_blank" rel="noopener noreferrer" class="link-item">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
								<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
							</svg>
							<div>
								<span class="link-label">GitHub</span>
								<span class="link-desc">Quellcode, Issues & Beiträge</span>
							</div>
						</a>
					</div>
				</div>

				<div class="section">
					<h3 class="section-title">Unterstützen</h3>
					<div class="link-list">
						<a href="https://buymeacoffee.com/tbuck91j" target="_blank" rel="noopener noreferrer" class="link-item coffee">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
								<path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
								<line x1="6" y1="1" x2="6" y2="4"></line>
								<line x1="10" y1="1" x2="10" y2="4"></line>
								<line x1="14" y1="1" x2="14" y2="4"></line>
							</svg>
							<div>
								<span class="link-label">Buy Me a Coffee</span>
								<span class="link-desc">Einmaliger Beitrag</span>
							</div>
						</a>
						<a href="https://github.com/sponsors/Rasalas" target="_blank" rel="noopener noreferrer" class="link-item sponsor">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
							</svg>
							<div>
								<span class="link-label">GitHub Sponsors</span>
								<span class="link-desc">Regelmäßige Unterstützung</span>
							</div>
						</a>
					</div>
				</div>

				<div class="section legal">
					<h3 class="section-title">Rechtliches</h3>
					<ul class="legal-list">
						<li>Lizenziert unter der <a href="https://github.com/Rasalas/md-print/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">MIT-Lizenz</a></li>
						<li>Schriften werden von <a href="https://fonts.google.com/" target="_blank" rel="noopener noreferrer">Google Fonts</a> geladen (Verbindung zu Google-Servern)</li>
						<li>Dokumente werden ausschließlich lokal im Browser verarbeitet — keine Daten werden an Server übertragen</li>
						<li>Einstellungen und Inhalte werden im <code>localStorage</code> des Browsers gespeichert</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
		padding: 1em;
		animation: fadeIn 0.15s ease-out;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.modal {
		background: var(--app-surface);
		border: 1px solid var(--app-border);
		border-radius: 12px;
		width: 100%;
		max-width: 440px;
		max-height: 85vh;
		overflow-y: auto;
		position: relative;
		animation: slideUp 0.2s ease-out;
	}

	@keyframes slideUp {
		from { opacity: 0; transform: translateY(12px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.close-btn {
		position: absolute;
		top: 0.8em;
		right: 0.8em;
		background: none;
		border: none;
		color: var(--app-text-muted);
		cursor: pointer;
		padding: 4px;
		border-radius: 4px;
		transition: color 0.2s, background 0.2s;
		display: flex;
	}

	.close-btn:hover {
		color: var(--app-text);
		background: var(--app-elevated);
	}

	.modal-header {
		padding: 2em 2em 0;
		text-align: center;
	}

	.modal-logo {
		font-family: var(--font-ui);
		font-size: 1.6rem;
		font-weight: 700;
		letter-spacing: -0.02em;
		color: var(--app-text);
	}

	.dot {
		color: var(--app-accent);
	}

	.modal-tagline {
		color: var(--app-text-muted);
		font-size: 0.85rem;
		margin-top: 0.2em;
	}

	.modal-body {
		padding: 1.5em 2em 2em;
	}

	.about-text {
		color: var(--app-text-muted);
		font-size: 0.85rem;
		line-height: 1.6;
		text-align: center;
		margin-bottom: 1.5em;
	}

	.section {
		margin-bottom: 1.5em;
	}

	.section:last-child {
		margin-bottom: 0;
	}

	.section-title {
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--app-text-muted);
		margin-bottom: 0.6em;
	}

	.link-list {
		display: flex;
		flex-direction: column;
		gap: 0.4em;
	}

	.link-item {
		display: flex;
		align-items: center;
		gap: 0.8em;
		padding: 0.7em 0.9em;
		border-radius: 8px;
		background: var(--app-elevated);
		border: 1px solid var(--app-border);
		color: var(--app-text);
		text-decoration: none;
		transition: border-color 0.2s, background 0.2s;
	}

	.link-item:hover {
		border-color: var(--app-accent);
		background: var(--app-accent-dim);
	}

	.link-item.coffee:hover {
		border-color: #ffdd00;
	}

	.link-item.coffee:hover svg {
		color: #ffdd00;
	}

	.link-item.sponsor:hover {
		border-color: #db61a2;
	}

	.link-item.sponsor:hover svg {
		color: #db61a2;
	}

	.link-item svg {
		flex-shrink: 0;
		color: var(--app-text-muted);
		transition: color 0.2s;
	}

	.link-item:hover svg {
		color: var(--app-accent);
	}

	.link-label {
		display: block;
		font-size: 0.85rem;
		font-weight: 500;
	}

	.link-desc {
		display: block;
		font-size: 0.72rem;
		color: var(--app-text-muted);
	}

	.legal {
		border-top: 1px solid var(--app-border);
		padding-top: 1.2em;
	}

	.legal-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.4em;
	}

	.legal-list li {
		font-size: 0.78rem;
		color: var(--app-text-muted);
		line-height: 1.5;
		padding-left: 1em;
		position: relative;
	}

	.legal-list li::before {
		content: '·';
		position: absolute;
		left: 0;
		color: var(--app-accent);
		font-weight: 700;
	}

	.legal-list a {
		color: var(--app-text);
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 2px;
		transition: color 0.2s;
	}

	.legal-list a:hover {
		color: var(--app-accent);
	}

	.legal-list code {
		font-family: var(--font-editor);
		font-size: 0.9em;
		background: var(--app-bg);
		padding: 0.1em 0.35em;
		border-radius: 3px;
	}

	@media (max-width: 480px) {
		.modal-body {
			padding: 1.2em 1.4em 1.6em;
		}

		.modal-header {
			padding: 1.5em 1.4em 0;
		}
	}
</style>
