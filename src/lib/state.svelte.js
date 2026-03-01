const SETTINGS_KEY = 'md-print-settings';

function loadSettings() {
	try {
		const raw = localStorage.getItem(SETTINGS_KEY);
		return raw ? JSON.parse(raw) : {};
	} catch {
		return {};
	}
}

const saved = typeof localStorage !== 'undefined' ? loadSettings() : {};

class AppState {
	content = $state('');
	language = $state(saved.language ?? 'de');
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
