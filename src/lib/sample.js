export const SAMPLE_CONTENT = `---
title: Willkommen bei md·print
author: Das md·print Team
date: März 2026
---

# Einführung

**md·print** ist ein elegantes Werkzeug zur Umwandlung von Markdown in druckfertige Dokumente mit Typografie, die an LaTeX heranreicht. Schreiben Sie Ihren Text im Editor auf der linken Seite und sehen Sie in Echtzeit, wie Ihr Dokument auf Papier aussehen wird.

Dieses Beispieldokument zeigt die wichtigsten Funktionen. Beachten Sie, wie der Text im Blocksatz gesetzt wird und automatische Silbentrennung verwendet, um ein harmonisches Schriftbild zu erzeugen --- ganz ohne zusätzlichen Aufwand.

## Typografische Grundlagen

Gute Typografie ist unsichtbar. Sie lenkt nicht vom Inhalt ab, sondern unterstützt das Lesen. md·print setzt auf bewährte typografische Prinzipien: Blocksatz mit automatischer Silbentrennung, Hurenkinder- und Schusterjungenkontrolle sowie sorgfältig abgestimmte Zeilenabstände.

### Drei Gestaltungsthemen

Wählen Sie zwischen drei sorgfältig gestalteten Themen:

1. **Klassisch** --- Inspiriert von LaTeX, mit Einrückung statt Absatzabstand und der eleganten Schriftart Spectral
2. **Modern** --- Source Serif 4 für den Fließtext, kombiniert mit der geometrischen Outfit für Überschriften
3. **Editorial** --- Die dekorative Fraunces für Überschriften verleiht Ihrem Dokument einen redaktionellen Charakter

## Mathematische Formeln

md·print unterstützt mathematische Formeln über KaTeX. Inline-Formeln wie $E = mc^2$ oder $\\alpha + \\beta = \\gamma$ fügen sich nahtlos in den Text ein.

Abgesetzte Formeln werden zentriert dargestellt:

$$\\int_0^\\infty e^{-x^2} \\, dx = \\frac{\\sqrt{\\pi}}{2}$$

Auch komplexere Ausdrücke sind möglich:

$$\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}$$

## Quellcode

Syntaxhervorhebung wird automatisch angewendet:

\`\`\`python
def fibonacci(n: int) -> list[int]:
    """Berechne die ersten n Fibonacci-Zahlen."""
    if n <= 0:
        return []

    zahlen = [0, 1]
    while len(zahlen) < n:
        zahlen.append(zahlen[-1] + zahlen[-2])

    return zahlen[:n]

# Die ersten 10 Fibonacci-Zahlen
ergebnis = fibonacci(10)
print(f"Fibonacci: {ergebnis}")
\`\`\`

Auch Inline-Code wie \`print("Hallo Welt")\` wird unterstützt.

## Tabellen

| Funktion | Beschreibung | Status |
|---|---|---|
| Markdown-Rendering | Vollständige GFM-Unterstützung | Verfügbar |
| Mathematik | KaTeX-Integration | Verfügbar |
| Syntaxhervorhebung | highlight.js | Verfügbar |
| Drei Druckthemen | Klassisch, Modern, Editorial | Verfügbar |
| Papierformate | A4, Letter, Legal | Verfügbar |
| Inhaltsverzeichnis | Automatisch generiert | Verfügbar |

## Zitate und Hervorhebungen

> *Die Typografie ist die Stimme des gedruckten Wortes.*
> --- Beatrice Warde

Gute Typografie braucht Liebe zum Detail. Beachten Sie die typografischen Feinheiten: Gedankenstriche --- wie dieser hier --- werden automatisch aus drei Bindestrichen erzeugt, Halbgeviertstriche -- aus zweien und Auslassungspunkte ... aus drei Punkten.

---

## Drucken

Klicken Sie auf den Druckknopf in der Kopfleiste, um Ihr Dokument zu drucken oder als PDF zu speichern. Die gesamte Benutzeroberfläche wird beim Druck ausgeblendet --- nur Ihr schön gesetztes Dokument erscheint auf dem Papier.

Viel Freude beim Schreiben und Drucken!
`;
