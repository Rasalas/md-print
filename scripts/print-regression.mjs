import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright';

const HOST = '127.0.0.1';
const PORT = 4174;
const BASE_URL = `http://${HOST}:${PORT}/`;
const HTML2PDF_BUNDLE = resolve('node_modules/html2pdf.js/dist/html2pdf.bundle.min.js');

const BISSELL_CASE = String.raw`# Anleitung: BISSELL SpotClean ProHeat (36988) mit Reinigungslösung

## Was du brauchst
- BISSELL SpotClean ProHeat (36988)
- BISSELL Spot & Stain Pro Oxy Lösung **oder** Spot & Stain Pet Pro Oxy Lösung
- Leitungswasser (warm)

---

## Dosierung

| Wassertank (ca. 0,75 Liter) | Lösung |
|---|---|
| Bis zur MAX-Linie mit Wasser füllen | **30–60 ml** Reinigungslösung (ca. 2–4 EL) |

> Bei hartnäckigen Flecken oder starken Tiergerüchen: eher **60 ml**, bei leichten Flecken reichen **30 ml**.

---

## Schritt-für-Schritt

**1. Vorbereitung**
- Grobe Verschmutzungen vorher trocken absaugen (normaler Staubsauger)
- Frische Flecken: erst so viel wie möglich mit einem Tuch abtupfen (nicht reiben!)

**2. Tank befüllen**
- Schmutzwassertank herausnehmen und entleeren (falls bereits benutzt)
- Frischwassertank abnehmen, Reinigungslösung einfüllen, dann bis zur **MAX-Markierung** mit Wasser auffüllen
- Tank wieder einsetzen

**3. Gerät einschalten & HeatWave nutzen**
- Gerät einstecken und einschalten
- **Kurz warten** (ca. 30 Sekunden), bis die HeatWave-Technologie das Wasser erwärmt – das verbessert die Reinigungsleistung deutlich

**4. Fleck behandeln**
- Düse direkt auf den Fleck aufsetzen
- Sprühtaste gedrückt halten und die Düse **langsam über den Fleck führen** (Hin- und Herbewegung)
- Danach Sprühtaste loslassen und nochmals über die Stelle fahren, um die Lösung wieder aufzusaugen

**5. Nachbehandlung**
- Den Bereich einige Male **nur absaugend** (ohne Sprühen) überfahren, um möglichst viel Feuchtigkeit zu entfernen
- Mit einem sauberen Tuch leicht nachtupfen
- Den Bereich **gut trocknen lassen** (ggf. Fenster öffnen oder Ventilator nutzen) – nicht betreten, solange feucht

**6. Reinigung nach Benutzung**
- Frischwassertank leeren und ausspülen
- Schmutzwassertank entleeren und ausspülen
- Düse unter fließendem Wasser durchspülen

---

## Welche Lösung wofür?

| Situation | Empfohlene Lösung |
|---|---|
| Allgemeine Flecken, Kaffee, Rotwein, Schmutz | **Spot & Stain Pro Oxy** |
| Haustierurin, Kotspuren, Tiergerüche | **Spot & Stain Pet Pro Oxy** |

---

> ⚠️ **Wichtig:** Keine andere Reinigungslösung verwenden – nur BISSELL-Produkte, da Fremdprodukte den Tank und die Düsen beschädigen und die Garantie erlöschen lassen können. Immer erst an einer unauffälligen Stelle testen.`;

const HEADING_CASE = String.raw`# Wartungsprotokoll

## Ausgangslage
Dieses Dokument enthält mehrere Abschnitte, die bewusst so gebaut sind, dass Überschriften in die Nähe eines Seitenendes rutschen können. Genau diese Situation hat zuvor dazu geführt, dass Druck und Vorschau auseinanderlaufen.

Die folgenden Absätze sind lang genug, um die Seite fast zu füllen. Sie beschreiben wiederholt denselben Sachverhalt: Geräte sollen erst geprüft, dann gereinigt, dann erneut kontrolliert werden. Alle Hinweise bleiben gleich, aber die Textmenge ist so gewählt, dass eine Überschrift nicht als letzte Zeile einer Seite stehen sollte.

Die Prüfperson kontrolliert Gehäuse, Netzkabel, Tank, Düse und die allgemeine Funktionsfähigkeit. Danach werden alle sichtbaren Rückstände entfernt und die Maschine zehn Minuten offen stehen gelassen, damit Restfeuchte entweichen kann.

Die Prüfperson kontrolliert Gehäuse, Netzkabel, Tank, Düse und die allgemeine Funktionsfähigkeit. Danach werden alle sichtbaren Rückstände entfernt und die Maschine zehn Minuten offen stehen gelassen, damit Restfeuchte entweichen kann.

Die Prüfperson kontrolliert Gehäuse, Netzkabel, Tank, Düse und die allgemeine Funktionsfähigkeit. Danach werden alle sichtbaren Rückstände entfernt und die Maschine zehn Minuten offen stehen gelassen, damit Restfeuchte entweichen kann.

## Checkliste vor der Freigabe
- Sichtprüfung ohne Beschädigungen
- Tank sauber und trocken
- Düse gespült
- Stromkabel ohne Knickstellen

## Dokumentation
Alle Ergebnisse werden im Wartungsheft eingetragen. Wenn Auffälligkeiten bestehen, wird zusätzlich ein kurzer Bericht mit Datum, Uhrzeit und genauer Beobachtung erstellt.

> Hinweis: Dieser Abschnitt kombiniert normale Absätze, Listen und eine Blockquote, damit der Paginierungsalgorithmus nicht nur mit Fließtext getestet wird.

## Abschluss
Nach der Kontrolle wird das Gerät freigegeben und erst dann wieder verstaut.`;

const MIXED_BLOCKS_CASE = String.raw`# Reisecheckliste

## Unterlagen
Vor der Abfahrt werden alle Unterlagen einmal vollständig durchgesehen. Reisepass, Tickets, Buchungsnummern und Versicherungsdaten liegen am besten gesammelt an einer Stelle.

| Bereich | Prüfen |
|---|---|
| Identität | Reisepass, Ausweis, Führerschein |
| Unterkunft | Adresse, Kontakt, Check-in-Zeit |
| Mobilität | Tickets, Parken, Transfers |

## Kleidung
- Zwei vollständige Wechselsets
- Warme Schicht für den Abend
- Leichte Jacke für Regen
- Bequeme Schuhe

## Technik
Ladegeräte, Adapter und Akkus werden getrennt nach Gerät sortiert. So fällt später schneller auf, wenn etwas fehlt.

> Besser jetzt einmal mehr prüfen als unterwegs improvisieren.

## Kurz vor der Abfahrt
Fenster schließen, Müll rausbringen, Pflanzen versorgen und die wichtigsten Nummern griffbereit halten.`;

const CASES = [
	{ id: 'bissell', label: 'BISSELL-Problemfall', content: BISSELL_CASE },
	{ id: 'heading-anchor', label: 'Heading-Schutz', content: HEADING_CASE },
	{ id: 'mixed-blocks', label: 'Gemischte Blöcke', content: MIXED_BLOCKS_CASE }
];

function waitForServer(proc) {
	return new Promise((resolve, reject) => {
		const timeout = setTimeout(() => {
			reject(new Error(`Dev-Server unter ${BASE_URL} wurde nicht rechtzeitig bereit.`));
		}, 20000);

		const onData = (chunk) => {
			const text = chunk.toString();
			if (text.includes(BASE_URL)) {
				clearTimeout(timeout);
				resolve();
			}
		};

		proc.stdout.on('data', onData);
		proc.stderr.on('data', onData);
		proc.once('exit', (code) => {
			clearTimeout(timeout);
			reject(new Error(`Dev-Server wurde vorzeitig beendet (exit ${code ?? 'unknown'}).`));
		});
	});
}

function startServer() {
	const proc = spawn('npm', ['run', 'dev', '--', '--host', HOST, '--port', String(PORT)], {
		stdio: ['ignore', 'pipe', 'pipe']
	});
	return { proc, ready: waitForServer(proc) };
}

function formatBreaks(breaks) {
	return breaks.map((entry) => entry.replace(/\s+/g, ' ').trim());
}

function sameBreaks(left, right) {
	return JSON.stringify(left) === JSON.stringify(right);
}

async function loadCase(page, markdown) {
	await page.goto(BASE_URL, { waitUntil: 'networkidle' });
	await page.evaluate((content) => {
		localStorage.setItem('md-print-content', content);
		localStorage.setItem(
			'md-print-settings',
			JSON.stringify({
				language: 'de',
				paperSize: 'A4',
				theme: 'klassisch',
				showToc: false,
				showPageNumbers: true
			})
		);
	}, markdown);
	await page.reload({ waitUntil: 'networkidle' });
	await page.addScriptTag({ path: HTML2PDF_BUNDLE });
	await page.waitForTimeout(800);
}

async function collectPreviewMetrics(page) {
	return page.evaluate(() => {
		const collectPaperMetrics = (paper) => {
			const breaks = [];
			for (const gap of paper.querySelectorAll(':scope > .page-gap')) {
				let next = gap.nextElementSibling;
				while (
					next &&
					(next.classList.contains('page-number') || next.classList.contains('page-filler'))
				) {
					next = next.nextElementSibling;
				}

				const label = next
					? `${next.tagName}:${next.textContent.replace(/\s+/g, ' ').trim().slice(0, 90)}`
					: 'EOF';
				breaks.push(label);
			}

			return {
				pageCount: breaks.length + 1,
				breakCount: breaks.length,
				breaks
			};
		};

		const paper = document.querySelector('.paper');
		if (!paper) throw new Error('Preview-Paper nicht gefunden.');
		return collectPaperMetrics(paper);
	});
}

async function collectExportMetrics(page, mode) {
	return page.evaluate(async (currentMode) => {
		const collectPaperMetrics = (paper) => {
			const breaks = [];
			for (const gap of paper.querySelectorAll(':scope > .page-gap')) {
				let next = gap.nextElementSibling;
				while (
					next &&
					(next.classList.contains('page-number') || next.classList.contains('page-filler'))
				) {
					next = next.nextElementSibling;
				}

				const label = next
					? `${next.tagName}:${next.textContent.replace(/\s+/g, ' ').trim().slice(0, 90)}`
					: 'EOF';
				breaks.push(label);
			}

			return {
				pageCount: breaks.length + 1,
				breakCount: breaks.length,
				breaks
			};
		};

		const { mountExportSnapshot, waitForExportSnapshot } = await import('/src/lib/export.js');
		const snapshot = mountExportSnapshot({ mode: currentMode });
		if (!snapshot) throw new Error(`Export-Snapshot für ${currentMode} fehlt.`);

		try {
			await waitForExportSnapshot(snapshot.paper);
			return collectPaperMetrics(snapshot.paper);
		} finally {
			snapshot.cleanup();
		}
	}, mode);
}

async function collectHtml2PdfPageCount(page) {
	return page.evaluate(async () => {
		const html2pdf = window.html2pdf;
		if (!html2pdf) throw new Error('html2pdf ist im Browserkontext nicht geladen.');
		const { PAPER_SIZES } = await import('/src/lib/config.js');
		const { appState } = await import('/src/lib/state.svelte.js');
		const { mountExportSnapshot, waitForExportSnapshot } = await import('/src/lib/export.js');
		const snapshot = mountExportSnapshot({ mode: 'pdf' });
		if (!snapshot) throw new Error('PDF-Snapshot fehlt.');

		try {
			await waitForExportSnapshot(snapshot.paper);
			const format = (PAPER_SIZES[appState.paperSize] || PAPER_SIZES.A4).pdf;
			const pdf = await html2pdf()
				.set({
					margin: 0,
					filename: 'regression.pdf',
					image: { type: 'jpeg', quality: 0.98 },
					html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
					jsPDF: { unit: 'mm', format, orientation: 'portrait' },
					pagebreak: { mode: ['css'] }
				})
				.from(snapshot.paper)
				.toPdf()
				.get('pdf');

			return pdf.internal.getNumberOfPages();
		} finally {
			snapshot.cleanup();
		}
	});
}

async function main() {
	const { proc, ready } = startServer();
	const browser = await chromium.launch({ headless: true, channel: 'chrome' });
	const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });

	let hasFailures = false;

	try {
		await ready;

		for (const testCase of CASES) {
			await loadCase(page, testCase.content);

			const preview = await collectPreviewMetrics(page);
			const printSnapshot = await collectExportMetrics(page, 'print');
			const pdfSnapshot = await collectExportMetrics(page, 'pdf');
			const pdfPages = await collectHtml2PdfPageCount(page);

			const previewBreaks = formatBreaks(preview.breaks);
			const printBreaks = formatBreaks(printSnapshot.breaks);
			const pdfBreaks = formatBreaks(pdfSnapshot.breaks);

			const previewMatchesPrint = sameBreaks(previewBreaks, printBreaks);
			const printMatchesPdf = sameBreaks(printBreaks, pdfBreaks);
			const pdfPageCountMatches = pdfPages === pdfSnapshot.pageCount;

			if (!previewMatchesPrint || !printMatchesPdf || !pdfPageCountMatches) {
				hasFailures = true;
			}

			console.log(`\n[${testCase.id}] ${testCase.label}`);
			console.log(`  Preview-Seiten: ${preview.pageCount}`);
			console.log(`  Print-Snapshot: ${printSnapshot.pageCount}`);
			console.log(`  PDF-Snapshot:   ${pdfSnapshot.pageCount}`);
			console.log(`  html2pdf Seiten: ${pdfPages}`);
			console.log(`  Preview == Print: ${previewMatchesPrint ? 'ja' : 'nein'}`);
			console.log(`  Print == PDF-Snapshot: ${printMatchesPdf ? 'ja' : 'nein'}`);
			console.log(`  PDF-Zahl passt: ${pdfPageCountMatches ? 'ja' : 'nein'}`);

			if (!previewMatchesPrint || !printMatchesPdf) {
				console.log('  Preview-Breaks:', previewBreaks);
				console.log('  Print-Breaks:  ', printBreaks);
				console.log('  PDF-Breaks:    ', pdfBreaks);
			}
		}
	} finally {
		await browser.close();
		proc.kill('SIGTERM');
	}

	if (hasFailures) {
		process.exitCode = 1;
		return;
	}

	console.log('\nAlle Print-/PDF-Regressionen erfolgreich.');
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
