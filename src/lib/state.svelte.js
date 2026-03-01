const SETTINGS_KEY = 'md-print-settings';
const SUPPORTED_LANGS = ['de', 'en', 'fr', 'es', 'it'];

function loadSettings() {
	try {
		const raw = localStorage.getItem(SETTINGS_KEY);
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

class AppState {
	content = $state('');
	language = $state(saved.language ?? detectLanguage());
	paperSize = $state(saved.paperSize ?? 'A4');
	theme = $state(saved.theme ?? 'klassisch');
	showToc = $state(saved.showToc ?? false);
	activeTab = $state('editor');

	saveSettings() {
		try {
			localStorage.setItem(SETTINGS_KEY, JSON.stringify({
				language: this.language,
				paperSize: this.paperSize,
				theme: this.theme,
				showToc: this.showToc
			}));
		} catch { /* quota exceeded etc. */ }
	}
}

export const appState = new AppState();
