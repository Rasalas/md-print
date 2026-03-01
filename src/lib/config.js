export const SUPPORTED_LANGS = ['de', 'en', 'fr', 'es', 'it'];

// Margins: [top, right, bottom, left] in mm
export const PAGE_MARGINS = [25, 20, 30, 20];

export const PAPER_SIZES = {
	A4:     { page: '210mm 297mm', width: '210mm', pdf: 'a4' },
	Letter: { page: '8.5in 11in',  width: '8.5in', pdf: 'letter' },
	Legal:  { page: '8.5in 14in',  width: '8.5in', pdf: 'legal' }
};

export const TOC_LABELS = {
	de: 'Inhaltsverzeichnis',
	en: 'Table of Contents',
	fr: 'Table des matieres',
	es: 'Tabla de contenido',
	it: 'Indice'
};
