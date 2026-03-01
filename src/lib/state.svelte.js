class AppState {
	content = $state('');
	language = $state('de');
	paperSize = $state('A4');
	theme = $state('klassisch');
	showToc = $state(false);
	activeTab = $state('editor');
}

export const appState = new AppState();
