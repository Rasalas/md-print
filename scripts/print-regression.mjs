import { spawn } from 'node:child_process';
import process from 'node:process';
import { chromium } from 'playwright';

const HOST = '127.0.0.1';
const PORT = 4174;
const BASE_URL = `http://${HOST}:${PORT}/`;

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

const LONG_PARAGRAPH_CASE = `# Langer Absatz

${Array.from(
	{ length: 220 },
	(_, index) =>
		`Dies ist Satz ${index + 1} mit etwas Text, der bewusst in einem einzigen Markdown-Absatz bleibt und daher nicht als eigener Top-Level-Knoten paginiert werden kann.`
).join(' ')}`;

const CASES = [
	{ id: 'bissell', label: 'BISSELL-Problemfall', content: BISSELL_CASE },
	{ id: 'heading-anchor', label: 'Heading-Schutz', content: HEADING_CASE },
	{ id: 'mixed-blocks', label: 'Gemischte Blöcke', content: MIXED_BLOCKS_CASE },
	{ id: 'long-paragraph', label: 'Langer Absatz', content: LONG_PARAGRAPH_CASE }
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
	await page.waitForFunction(
		() =>
			document.querySelectorAll('.paged-preview .pagedjs_page').length > 0 ||
			document.querySelector('.fallback-paper'),
		null,
		{ timeout: 10000 }
	);
	await page.waitForTimeout(500);
}

async function collectPreviewMetrics(page) {
	return page.evaluate(() => {
		const collectPagedMetrics = (pagesRoot) => {
			const pages = Array.from(pagesRoot.querySelectorAll(':scope > .pagedjs_page'));
			const breaks = pages.slice(1).map((pagedPage) => {
				const label = pagedPage.textContent.replace(/\s+/g, ' ').trim().slice(0, 90);
				return label || 'EMPTY';
			});

			return {
				engine: 'paged',
				pageCount: pages.length,
				breakCount: Math.max(0, pages.length - 1),
				breaks,
				paddingTop: 0,
				gapOffsets: []
			};
		};

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

		const paged = document.querySelector('.paged-preview .pagedjs_pages');
		if (paged?.querySelector('.pagedjs_page')) return collectPagedMetrics(paged);

		const paper = document.querySelector('.fallback-paper');
		if (!paper) throw new Error('Preview-Paper nicht gefunden.');
		const metrics = collectPaperMetrics(paper);
		const paddingTop = Number.parseFloat(getComputedStyle(paper).paddingTop) || 0;
		const gapOffsets = Array.from(paper.querySelectorAll(':scope > .page-gap')).map((gap) => {
			const gapRect = gap.getBoundingClientRect();
			let next = gap.nextElementSibling;
			while (
				next &&
				(next.classList.contains('page-number') || next.classList.contains('page-filler'))
			) {
				next = next.nextElementSibling;
			}

			if (!next) return null;
			const nextRect = next.getBoundingClientRect();
			return nextRect.top - gapRect.bottom;
		}).filter((value) => value !== null);

		return {
			engine: 'paper',
			...metrics,
			paddingTop,
			gapOffsets
		};
	});
}

async function collectExportMetrics(page, mode) {
	return page.evaluate(async (currentMode) => {
		const collectPagedMetrics = (pagesRoot) => {
			const pages = Array.from(pagesRoot.querySelectorAll(':scope > .pagedjs_page'));
			const breaks = pages.slice(1).map((pagedPage) => {
				const label = pagedPage.textContent.replace(/\s+/g, ' ').trim().slice(0, 90);
				return label || 'EMPTY';
			});

			return {
				engine: 'paged',
				pageCount: pages.length,
				breakCount: Math.max(0, pages.length - 1),
				breaks,
				paddingTop: 0,
				gapHeights: []
			};
		};

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
			if (snapshot.kind === 'paged') return collectPagedMetrics(snapshot.paper);

			const metrics = collectPaperMetrics(snapshot.paper);
			const paddingTop = Number.parseFloat(getComputedStyle(snapshot.paper).paddingTop) || 0;
			const gapHeights = Array.from(snapshot.paper.querySelectorAll(':scope > .page-gap')).map((gap) => {
				const gapRect = gap.getBoundingClientRect();
				return gapRect.height;
			});

			return {
				engine: 'paper',
				...metrics,
				paddingTop,
				gapHeights
			};
		} finally {
			snapshot.cleanup();
		}
	}, mode);
}

function countPdfPages(pdfBuffer) {
	const text = pdfBuffer.toString('latin1');
	return (text.match(/\/Type\s*\/Page\b/g) || []).length;
}

async function collectBrowserPrintPageCount(page) {
	const pdf = await page.pdf({
		printBackground: true,
		width: '210mm',
		height: '297mm',
		margin: { top: '0', right: '0', bottom: '0', left: '0' }
	});
	return countPdfPages(Buffer.from(pdf));
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
			const pdfPages = await collectBrowserPrintPageCount(page);

			const previewBreaks = formatBreaks(preview.breaks);
			const printBreaks = formatBreaks(printSnapshot.breaks);
			const pdfBreaks = formatBreaks(pdfSnapshot.breaks);

			const previewMatchesPrint = sameBreaks(previewBreaks, printBreaks);
			const printMatchesPdf = sameBreaks(printBreaks, pdfBreaks);
			const pdfPageCountMatches = pdfPages === pdfSnapshot.pageCount;
			const previewPaddingMatches = preview.gapOffsets.every(
				(offset) => Math.abs(offset - preview.paddingTop) < 1.5
			);
			const exportPaddingMatches = printSnapshot.gapHeights.every(
				(height) => Math.abs(height - printSnapshot.paddingTop) < 1.5
			);

			if (!previewMatchesPrint || !printMatchesPdf || !pdfPageCountMatches || !previewPaddingMatches || !exportPaddingMatches) {
				hasFailures = true;
			}

			console.log(`\n[${testCase.id}] ${testCase.label}`);
			console.log(`  Preview-Seiten: ${preview.pageCount}`);
			console.log(`  Print-Snapshot: ${printSnapshot.pageCount}`);
			console.log(`  PDF-Snapshot:   ${pdfSnapshot.pageCount}`);
			console.log(`  Browser-PDF Seiten: ${pdfPages}`);
			console.log(`  Preview == Print: ${previewMatchesPrint ? 'ja' : 'nein'}`);
			console.log(`  Print == PDF-Snapshot: ${printMatchesPdf ? 'ja' : 'nein'}`);
			console.log(`  PDF-Zahl passt: ${pdfPageCountMatches ? 'ja' : 'nein'}`);
			console.log(`  Preview-Top-Marge passt: ${previewPaddingMatches ? 'ja' : 'nein'}`);
			console.log(`  Export-Top-Marge passt: ${exportPaddingMatches ? 'ja' : 'nein'}`);

			if (!previewMatchesPrint || !printMatchesPdf || !previewPaddingMatches || !exportPaddingMatches) {
				console.log('  Preview-Breaks:', previewBreaks);
				console.log('  Print-Breaks:  ', printBreaks);
				console.log('  PDF-Breaks:    ', pdfBreaks);
				console.log('  Preview-Top-Offsets:', preview.gapOffsets);
				console.log('  Preview-PaddingTop:', preview.paddingTop);
				console.log('  Export-Gap-Heights:', printSnapshot.gapHeights);
				console.log('  Export-PaddingTop:', printSnapshot.paddingTop);
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
