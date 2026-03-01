const samples = {
de: `---
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

Viel Freude beim Schreiben und Drucken!`,

en: `---
title: Welcome to md·print
author: The md·print Team
date: March 2026
---

# Introduction

**md·print** is an elegant tool for transforming Markdown into print-ready documents with typography that rivals LaTeX. Write your text in the editor on the left and see in real time how your document will look on paper.

This sample document showcases the key features. Notice how the text is fully justified with automatic hyphenation, creating a harmonious appearance --- all without any extra effort on your part.

## Typographic Foundations

Good typography is invisible. It doesn't distract from the content but supports the reading experience. md·print relies on proven typographic principles: justified text with automatic hyphenation, widow and orphan control, and carefully tuned line spacing.

### Three Design Themes

Choose between three carefully crafted themes:

1. **Classic** --- Inspired by LaTeX, using paragraph indentation instead of spacing, with the elegant Spectral typeface
2. **Modern** --- Source Serif 4 for body text, paired with the geometric Outfit for headings
3. **Editorial** --- The decorative Fraunces for headings gives your document a magazine-like character

## Mathematical Formulas

md·print supports mathematical formulas via KaTeX. Inline formulas like $E = mc^2$ or $\\alpha + \\beta = \\gamma$ blend seamlessly into the text.

Display formulas are centered:

$$\\int_0^\\infty e^{-x^2} \\, dx = \\frac{\\sqrt{\\pi}}{2}$$

More complex expressions work too:

$$\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}$$

## Source Code

Syntax highlighting is applied automatically:

\`\`\`python
def fibonacci(n: int) -> list[int]:
    """Compute the first n Fibonacci numbers."""
    if n <= 0:
        return []

    numbers = [0, 1]
    while len(numbers) < n:
        numbers.append(numbers[-1] + numbers[-2])

    return numbers[:n]

# The first 10 Fibonacci numbers
result = fibonacci(10)
print(f"Fibonacci: {result}")
\`\`\`

Inline code like \`print("Hello World")\` is also supported.

## Tables

| Feature | Description | Status |
|---|---|---|
| Markdown rendering | Full GFM support | Available |
| Mathematics | KaTeX integration | Available |
| Syntax highlighting | highlight.js | Available |
| Three print themes | Classic, Modern, Editorial | Available |
| Paper sizes | A4, Letter, Legal | Available |
| Table of contents | Automatically generated | Available |

## Quotes and Highlights

> *Typography is the voice of the printed word.*
> --- Beatrice Warde

Good typography requires attention to detail. Notice the typographic niceties: em dashes --- like this one --- are automatically created from three hyphens, en dashes -- from two, and ellipses ... from three dots.

---

## Printing

Click the print button in the header to print your document or save it as a PDF. The entire user interface is hidden during printing --- only your beautifully typeset document appears on paper.

Happy writing and printing!`,

fr: `---
title: Bienvenue sur md·print
author: L'équipe md·print
date: Mars 2026
---

# Introduction

**md·print** est un outil élégant pour transformer vos documents Markdown en pages prêtes à imprimer, avec une typographie qui rivalise avec LaTeX. Écrivez votre texte dans l'éditeur à gauche et voyez en temps réel comment votre document apparaîtra sur papier.

Ce document d'exemple présente les principales fonctionnalités. Remarquez comment le texte est justifié avec une césure automatique, créant une apparence harmonieuse --- sans aucun effort supplémentaire.

## Fondements typographiques

La bonne typographie est invisible. Elle ne distrait pas du contenu, mais soutient la lecture. md·print s'appuie sur des principes typographiques éprouvés : texte justifié avec césure automatique, contrôle des veuves et des orphelines, et interlignage soigneusement ajusté.

### Trois thèmes de mise en page

Choisissez parmi trois thèmes soigneusement conçus :

1. **Classique** --- Inspiré de LaTeX, avec indentation au lieu d'espacement entre paragraphes et l'élégante police Spectral
2. **Moderne** --- Source Serif 4 pour le corps du texte, associée à la géométrique Outfit pour les titres
3. **Éditorial** --- La décorative Fraunces pour les titres donne à votre document un caractère de magazine

## Formules mathématiques

md·print prend en charge les formules mathématiques via KaTeX. Les formules en ligne comme $E = mc^2$ ou $\\alpha + \\beta = \\gamma$ s'intègrent parfaitement au texte.

Les formules en bloc sont centrées :

$$\\int_0^\\infty e^{-x^2} \\, dx = \\frac{\\sqrt{\\pi}}{2}$$

Des expressions plus complexes sont également possibles :

$$\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}$$

## Code source

La coloration syntaxique est appliquée automatiquement :

\`\`\`python
def fibonacci(n: int) -> list[int]:
    """Calcule les n premiers nombres de Fibonacci."""
    if n <= 0:
        return []

    nombres = [0, 1]
    while len(nombres) < n:
        nombres.append(nombres[-1] + nombres[-2])

    return nombres[:n]

# Les 10 premiers nombres de Fibonacci
resultat = fibonacci(10)
print(f"Fibonacci : {resultat}")
\`\`\`

Le code en ligne comme \`print("Bonjour le monde")\` est également pris en charge.

## Tableaux

| Fonctionnalité | Description | Statut |
|---|---|---|
| Rendu Markdown | Support GFM complet | Disponible |
| Mathématiques | Intégration KaTeX | Disponible |
| Coloration syntaxique | highlight.js | Disponible |
| Trois thèmes | Classique, Moderne, Éditorial | Disponible |
| Formats de papier | A4, Letter, Legal | Disponible |
| Table des matières | Générée automatiquement | Disponible |

## Citations

> *La typographie est la voix du mot imprimé.*
> --- Beatrice Warde

La bonne typographie exige une attention au détail. Remarquez les subtilités typographiques : les tirets cadratins --- comme celui-ci --- sont créés automatiquement à partir de trois traits d'union, les tirets demi-cadratins -- à partir de deux, et les points de suspension ... à partir de trois points.

---

## Impression

Cliquez sur le bouton d'impression dans l'en-tête pour imprimer votre document ou l'enregistrer en PDF. Toute l'interface utilisateur est masquée lors de l'impression --- seul votre document magnifiquement composé apparaît sur le papier.

Bonne écriture et bonne impression !`,

es: `---
title: Bienvenido a md·print
author: El equipo de md·print
date: Marzo 2026
---

# Introducción

**md·print** es una herramienta elegante para transformar documentos Markdown en páginas listas para imprimir, con una tipografía que rivaliza con LaTeX. Escriba su texto en el editor de la izquierda y vea en tiempo real cómo se verá su documento en papel.

Este documento de ejemplo muestra las funciones principales. Observe cómo el texto se justifica automáticamente con separación silábica, creando una apariencia armoniosa --- sin ningún esfuerzo adicional.

## Fundamentos tipográficos

La buena tipografía es invisible. No distrae del contenido, sino que apoya la lectura. md·print se basa en principios tipográficos probados: texto justificado con separación silábica automática, control de viudas y huérfanas, y un interlineado cuidadosamente ajustado.

### Tres temas de diseño

Elija entre tres temas cuidadosamente elaborados:

1. **Clásico** --- Inspirado en LaTeX, con sangría en lugar de espaciado entre párrafos y la elegante tipografía Spectral
2. **Moderno** --- Source Serif 4 para el cuerpo del texto, combinada con la geométrica Outfit para los títulos
3. **Editorial** --- La decorativa Fraunces para los títulos le da a su documento un carácter de revista

## Fórmulas matemáticas

md·print soporta fórmulas matemáticas mediante KaTeX. Las fórmulas en línea como $E = mc^2$ o $\\alpha + \\beta = \\gamma$ se integran perfectamente en el texto.

Las fórmulas en bloque se muestran centradas:

$$\\int_0^\\infty e^{-x^2} \\, dx = \\frac{\\sqrt{\\pi}}{2}$$

También son posibles expresiones más complejas:

$$\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}$$

## Código fuente

El resaltado de sintaxis se aplica automáticamente:

\`\`\`python
def fibonacci(n: int) -> list[int]:
    """Calcula los primeros n números de Fibonacci."""
    if n <= 0:
        return []

    numeros = [0, 1]
    while len(numeros) < n:
        numeros.append(numeros[-1] + numeros[-2])

    return numeros[:n]

# Los primeros 10 números de Fibonacci
resultado = fibonacci(10)
print(f"Fibonacci: {resultado}")
\`\`\`

El código en línea como \`print("Hola Mundo")\` también es compatible.

## Tablas

| Función | Descripción | Estado |
|---|---|---|
| Renderizado Markdown | Soporte completo de GFM | Disponible |
| Matemáticas | Integración de KaTeX | Disponible |
| Resaltado de sintaxis | highlight.js | Disponible |
| Tres temas de impresión | Clásico, Moderno, Editorial | Disponible |
| Tamaños de papel | A4, Letter, Legal | Disponible |
| Tabla de contenidos | Generada automáticamente | Disponible |

## Citas

> *La tipografía es la voz de la palabra impresa.*
> --- Beatrice Warde

La buena tipografía requiere atención al detalle. Observe las sutilezas tipográficas: los guiones largos --- como este --- se crean automáticamente a partir de tres guiones, los guiones medianos -- a partir de dos, y los puntos suspensivos ... a partir de tres puntos.

---

## Imprimir

Haga clic en el botón de impresión en la barra superior para imprimir su documento o guardarlo como PDF. Toda la interfaz de usuario se oculta durante la impresión --- solo su documento bellamente compuesto aparece en el papel.

¡Feliz escritura e impresión!`,

it: `---
title: Benvenuto su md·print
author: Il team di md·print
date: Marzo 2026
---

# Introduzione

**md·print** è uno strumento elegante per trasformare documenti Markdown in pagine pronte per la stampa, con una tipografia che rivaleggia con LaTeX. Scrivete il vostro testo nell'editor a sinistra e vedete in tempo reale come apparirà il vostro documento su carta.

Questo documento di esempio mostra le funzionalità principali. Notate come il testo è giustificato automaticamente con sillabazione, creando un aspetto armonioso --- senza alcuno sforzo aggiuntivo.

## Fondamenti tipografici

La buona tipografia è invisibile. Non distrae dal contenuto, ma supporta la lettura. md·print si basa su principi tipografici collaudati: testo giustificato con sillabazione automatica, controllo di vedove e orfane, e interlinea accuratamente regolata.

### Tre temi di design

Scegliete tra tre temi accuratamente realizzati:

1. **Classico** --- Ispirato a LaTeX, con rientro invece di spaziatura tra paragrafi e l'elegante carattere Spectral
2. **Moderno** --- Source Serif 4 per il corpo del testo, abbinato al geometrico Outfit per i titoli
3. **Editoriale** --- Il decorativo Fraunces per i titoli conferisce al documento un carattere da rivista

## Formule matematiche

md·print supporta formule matematiche tramite KaTeX. Le formule in linea come $E = mc^2$ o $\\alpha + \\beta = \\gamma$ si integrano perfettamente nel testo.

Le formule in blocco sono centrate:

$$\\int_0^\\infty e^{-x^2} \\, dx = \\frac{\\sqrt{\\pi}}{2}$$

Anche espressioni più complesse sono possibili:

$$\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}$$

## Codice sorgente

L'evidenziazione della sintassi viene applicata automaticamente:

\`\`\`python
def fibonacci(n: int) -> list[int]:
    """Calcola i primi n numeri di Fibonacci."""
    if n <= 0:
        return []

    numeri = [0, 1]
    while len(numeri) < n:
        numeri.append(numeri[-1] + numeri[-2])

    return numeri[:n]

# I primi 10 numeri di Fibonacci
risultato = fibonacci(10)
print(f"Fibonacci: {risultato}")
\`\`\`

Anche il codice in linea come \`print("Ciao Mondo")\` è supportato.

## Tabelle

| Funzionalità | Descrizione | Stato |
|---|---|---|
| Rendering Markdown | Supporto GFM completo | Disponibile |
| Matematica | Integrazione KaTeX | Disponibile |
| Evidenziazione sintassi | highlight.js | Disponibile |
| Tre temi di stampa | Classico, Moderno, Editoriale | Disponibile |
| Formati carta | A4, Letter, Legal | Disponibile |
| Indice | Generato automaticamente | Disponibile |

## Citazioni

> *La tipografia è la voce della parola stampata.*
> --- Beatrice Warde

La buona tipografia richiede attenzione ai dettagli. Notate le finezze tipografiche: i trattini lunghi --- come questo --- vengono creati automaticamente da tre trattini, i trattini medi -- da due, e i puntini di sospensione ... da tre punti.

---

## Stampa

Fate clic sul pulsante di stampa nell'intestazione per stampare il documento o salvarlo come PDF. L'intera interfaccia utente viene nascosta durante la stampa --- solo il vostro documento splendidamente composto appare sulla carta.

Buona scrittura e buona stampa!`
};

export function getSampleContent(lang) {
	return samples[lang] || samples.en;
}
