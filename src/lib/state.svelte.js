import { SUPPORTED_LANGS } from './config.js';
import { getSampleContent } from './sample.js';

const SETTINGS_KEY = 'md-print-settings';
const CONTENT_KEY = 'md-print-content';

function loadFromStorage(key) {
	try {
		return localStorage.getItem(key);
	} catch {
		return null;
	}
}

function loadSettings() {
	try {
		const raw = loadFromStorage(SETTINGS_KEY);
		return raw ? JSON.parse(raw) : {};
	} catch {
		return {};
	}
}

function detectLanguage() {
	if (typeof navigator === 'undefined') return 'de';
	const browserLang = (navigator.language || navigator.languages?.[0] || 'de').slice(0, 2).toLowerCase();
	return SUPPORTED_LANGS.includes(browserLang) ? browserLang : 'en';
}

const saved = typeof localStorage !== 'undefined' ? loadSettings() : {};
const savedContent = typeof localStorage !== 'undefined' ? loadFromStorage(CONTENT_KEY) : null;

class AppState {
	content = $state(savedContent || '');
	language = $state(saved.language ?? detectLanguage());
	paperSize = $state(saved.paperSize ?? 'A4');
	theme = $state(saved.theme ?? 'klassisch');
	showToc = $state(saved.showToc ?? false);
	showPageNumbers = $state(saved.showPageNumbers ?? true);
	activeTab = $state('editor');
	isUserContent = $state(!!savedContent);

	saveSettings() {
		try {
			localStorage.setItem(SETTINGS_KEY, JSON.stringify({
				language: this.language,
				paperSize: this.paperSize,
				theme: this.theme,
				showToc: this.showToc,
				showPageNumbers: this.showPageNumbers
			}));
		} catch { /* quota exceeded */ }
	}

	saveContent() {
		if (this.isUserContent && this.content) {
			try {
				localStorage.setItem(CONTENT_KEY, this.content);
			} catch { /* quota exceeded */ }
		}
	}

	clearContent() {
		this.content = '';
		this.isUserContent = false;
		try {
			localStorage.removeItem(CONTENT_KEY);
		} catch { /* ignore */ }
	}

	loadSampleIfNeeded() {
		if (!this.isUserContent) {
			this.content = getSampleContent(this.language);
		}
	}
}

export const appState = new AppState();

// Load sample content if no saved user content
if (!savedContent) {
	appState.content = getSampleContent(appState.language);
}
