<script>
	import { appState } from './state.svelte.js';

	let textarea;
	let fileInput;
	let showDropOverlay = $state(false);
	let dragCounter = $state(0);

	function handleKeydown(e) {
		// Tab: insert 2 spaces
		if (e.key === 'Tab') {
			e.preventDefault();
			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;
			const value = appState.content;
			appState.content = value.substring(0, start) + '  ' + value.substring(end);
			// Restore cursor position after Svelte updates the DOM
			requestAnimationFrame(() => {
				textarea.selectionStart = textarea.selectionEnd = start + 2;
			});
		}

		// Ctrl/Cmd+B: bold
		if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
			e.preventDefault();
			wrapSelection('**');
		}

		// Ctrl/Cmd+I: italic
		if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
			e.preventDefault();
			wrapSelection('*');
		}

		// Ctrl/Cmd+P: print
		if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
			e.preventDefault();
			window.print();
		}
	}

	function wrapSelection(marker) {
		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const value = appState.content;
		const selected = value.substring(start, end);

		if (selected) {
			appState.content =
				value.substring(0, start) +
				marker + selected + marker +
				value.substring(end);
			requestAnimationFrame(() => {
				textarea.selectionStart = start + marker.length;
				textarea.selectionEnd = end + marker.length;
			});
		} else {
			appState.content =
				value.substring(0, start) +
				marker + marker +
				value.substring(end);
			requestAnimationFrame(() => {
				textarea.selectionStart = textarea.selectionEnd = start + marker.length;
			});
		}
	}

	function openFile() {
		fileInput.click();
	}

	function handleFileSelect(e) {
		const file = e.target.files?.[0];
		if (file) readFile(file);
	}

	function readFile(file) {
		const reader = new FileReader();
		reader.onload = (e) => {
			appState.content = e.target.result;
			appState.isUserContent = true;
		};
		reader.readAsText(file);
	}

	function clearEditor() {
		if (confirm('Inhalt löschen?')) {
			appState.clearContent();
		}
	}

	// Drag & drop
	function handleDragEnter(e) {
		e.preventDefault();
		dragCounter++;
		showDropOverlay = true;
	}

	function handleDragLeave(e) {
		e.preventDefault();
		dragCounter--;
		if (dragCounter <= 0) {
			dragCounter = 0;
			showDropOverlay = false;
		}
	}

	function handleDragOver(e) {
		e.preventDefault();
	}

	function handleDrop(e) {
		e.preventDefault();
		dragCounter = 0;
		showDropOverlay = false;
		const file = e.dataTransfer?.files?.[0];
		if (file) readFile(file);
	}
</script>

<div
	class="editor-container"
	ondragenter={handleDragEnter}
	ondragleave={handleDragLeave}
	ondragover={handleDragOver}
	ondrop={handleDrop}
	role="region"
	aria-label="Editor"
>
	<div class="panel-header">
		<span class="panel-title">Markdown</span>
		<div class="panel-actions">
			<button class="panel-btn" onclick={openFile} title="Datei öffnen">
				<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
					<polyline points="14 2 14 8 20 8"></polyline>
				</svg>
			</button>
			<button class="panel-btn" onclick={clearEditor} title="Löschen">
				<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<polyline points="3 6 5 6 21 6"></polyline>
					<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
				</svg>
			</button>
		</div>
	</div>

	<textarea
		bind:this={textarea}
		bind:value={appState.content}
		onkeydown={handleKeydown}
		oninput={() => { appState.isUserContent = true; }}
		class="editor-textarea"
		placeholder="Schreiben Sie Ihr Markdown hier..."
		spellcheck="true"
	></textarea>

	<input
		bind:this={fileInput}
		type="file"
		accept=".md,.txt,.markdown"
		onchange={handleFileSelect}
		class="file-input-hidden"
	/>

	{#if showDropOverlay}
		<div class="drop-overlay">
			<div class="drop-message">
				<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
					<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
					<polyline points="14 2 14 8 20 8"></polyline>
				</svg>
				<span>Datei hier ablegen</span>
			</div>
		</div>
	{/if}
</div>

<style>
	.editor-container {
		display: flex;
		flex-direction: column;
		height: 100%;
		position: relative;
		background: var(--app-bg);
	}

	.panel-actions {
		display: flex;
		gap: 0.3em;
	}

	.panel-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		background: none;
		border: 1px solid transparent;
		border-radius: 4px;
		color: var(--app-text-muted);
		cursor: pointer;
		transition: all 0.2s;
	}

	.panel-btn:hover {
		color: var(--app-text);
		background: var(--app-elevated);
		border-color: var(--app-border);
	}

	.editor-textarea {
		flex: 1;
		width: 100%;
		padding: 1em 1.2em;
		background: var(--app-bg);
		border: none;
		color: var(--app-text);
		font-family: var(--font-editor);
		font-size: 0.88rem;
		line-height: 1.65;
		resize: none;
		outline: none;
		tab-size: 2;
		overflow-y: auto;
	}

	.editor-textarea::placeholder {
		color: var(--app-text-muted);
		font-style: italic;
	}

	.editor-textarea:focus {
		box-shadow: inset 0 0 0 1px var(--app-accent-dim);
	}

	.file-input-hidden {
		display: none;
	}

	/* Drop overlay */
	.drop-overlay {
		position: absolute;
		inset: 0;
		background: rgba(22, 20, 26, 0.92);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
		border: 2px dashed var(--app-accent);
		border-radius: 4px;
		animation: fadeIn 0.15s ease-out;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.drop-message {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.8em;
		color: var(--app-accent);
		font-size: 1rem;
		font-weight: 500;
	}

</style>
