<script>
	import Header from '$lib/Header.svelte';
	import Editor from '$lib/Editor.svelte';
	import Preview from '$lib/Preview.svelte';
	import { appState } from '$lib/state.svelte.js';
	import { printPreviewDocument } from '$lib/export.js';

	let splitRatio = $state(45);
	let isDragging = $state(false);
	let appEl;

	function onPointerDown(e) {
		isDragging = true;
		e.preventDefault();
	}

	function onPointerMove(e) {
		if (!isDragging || !appEl) return;
		const rect = appEl.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const pct = (x / rect.width) * 100;
		splitRatio = Math.min(75, Math.max(25, pct));
	}

	function onPointerUp() {
		isDragging = false;
	}

	function onKeydown(e) {
		if (e.defaultPrevented) return;
		if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
			e.preventDefault();
			printPreviewDocument();
		}
	}

	// Persist settings on change
	$effect(() => {
		const { language, paperSize, theme, showToc, showPageNumbers } = appState;
		appState.saveSettings();
	});

	// Persist content on change
	$effect(() => {
		appState.content;
		appState.saveContent();
	});

	// Swap sample content when language changes
	$effect(() => {
		appState.language;
		appState.loadSampleIfNeeded();
	});
</script>

<svelte:window onpointermove={onPointerMove} onpointerup={onPointerUp} onkeydown={onKeydown} />

<div class="app-shell">
	<Header />

	<!-- Mobile tabs -->
	<div class="mobile-tabs">
		<button
			class="mobile-tab"
			class:active={appState.activeTab === 'editor'}
			onclick={() => (appState.activeTab = 'editor')}
		>
			Editor
		</button>
		<button
			class="mobile-tab"
			class:active={appState.activeTab === 'preview'}
			onclick={() => (appState.activeTab = 'preview')}
		>
			Vorschau
		</button>
	</div>

	<!-- Split-pane layout -->
	<div
		class="app-layout"
		class:is-dragging={isDragging}
		bind:this={appEl}
		style="--split: {splitRatio}%"
	>
		<div class="editor-panel" class:mobile-hidden={appState.activeTab !== 'editor'}>
			<Editor />
		</div>

		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<div
			class="resize-handle"
			role="separator"
			aria-orientation="vertical"
			tabindex="0"
			onpointerdown={onPointerDown}
		>
			<div class="resize-grip">
				<span></span>
				<span></span>
				<span></span>
			</div>
		</div>

		<div class="preview-panel" class:mobile-hidden={appState.activeTab !== 'preview'}>
			<Preview />
		</div>
	</div>
</div>

<style>
	.app-shell {
		display: flex;
		flex-direction: column;
		height: 100dvh;
		overflow: hidden;
		animation: fadeIn 0.4s ease-out;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	/* Mobile tabs */
	.mobile-tabs {
		display: none;
		background: var(--app-surface);
		border-bottom: 1px solid var(--app-border);
	}

	.mobile-tab {
		flex: 1;
		padding: 0.6em 1em;
		background: none;
		border: none;
		color: var(--app-text-muted);
		font-family: var(--font-ui);
		font-size: 0.85rem;
		font-weight: 500;
		cursor: pointer;
		transition: color 0.2s, box-shadow 0.2s;
		border-bottom: 2px solid transparent;
	}

	.mobile-tab.active {
		color: var(--app-accent);
		border-bottom-color: var(--app-accent);
	}

	/* Split layout */
	.app-layout {
		display: grid;
		grid-template-columns: var(--split) 6px 1fr;
		flex: 1;
		overflow: hidden;
		min-height: 0;
	}

	.app-layout.is-dragging {
		user-select: none;
		cursor: col-resize;
	}

	.editor-panel,
	.preview-panel {
		overflow: hidden;
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	/* Resize handle */
	.resize-handle {
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--app-border);
		cursor: col-resize;
		transition: background 0.2s;
		touch-action: none;
	}

	.resize-handle:hover,
	.resize-handle:active {
		background: var(--app-accent);
	}

	.resize-grip {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}

	.resize-grip span {
		display: block;
		width: 2px;
		height: 2px;
		border-radius: 50%;
		background: var(--app-text-muted);
		transition: background 0.2s;
	}

	.resize-handle:hover .resize-grip span {
		background: white;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.mobile-tabs {
			display: flex;
		}

		.app-layout {
			display: flex;
		}

		.resize-handle {
			display: none;
		}

		.editor-panel,
		.preview-panel {
			flex: 1;
			width: 100%;
		}

		.mobile-hidden {
			display: none !important;
		}
	}

</style>
