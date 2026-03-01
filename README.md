# md-print

Beautiful Markdown printing — a browser-based editor with live, print-optimized preview.

Write or paste Markdown on the left, see a typeset paper preview on the right, and hit **Ctrl+P** to print.

## Features

- **Live preview** with debounced rendering in a realistic paper layout
- **Print-optimized** output — the preview becomes the printed page, headers/editor hidden automatically
- **Multiple themes** — Klassisch, Modern, Editorial
- **Paper sizes** — A4, Letter, Legal (affects both preview and `@page` rules)
- **KaTeX math** — inline `$...$` and display `$$...$$`
- **Syntax highlighting** via highlight.js with auto-detection
- **YAML frontmatter** — `title`, `author`, `date`, `abstract` rendered as a document header
- **Table of contents** — auto-generated from headings, localized labels
- **Typographic enhancements** — smart dashes and ellipses
- **Drag & drop** — drop `.md` / `.txt` files into the editor
- **Keyboard shortcuts** — Bold (`Ctrl+B`), Italic (`Ctrl+I`), Print (`Ctrl+P`), Tab indent
- **Resizable split pane** — drag the divider between editor and preview
- **Responsive** — mobile-friendly with tab navigation
- **Persistent settings** — language, paper size, theme, TOC toggle saved in `localStorage`
- **Multi-language UI** — DE, EN, FR, ES, IT

## Tech stack

- [SvelteKit](https://svelte.dev/docs/kit) with [Svelte 5](https://svelte.dev)
- [marked](https://marked.js.org/) (Markdown parsing, GFM)
- [KaTeX](https://katex.org/) (math rendering)
- [highlight.js](https://highlightjs.org/) (syntax highlighting)
- Static adapter — fully client-side, no server needed

## Getting started

```sh
npm install
npm run dev
```

Open [localhost:5173](http://localhost:5173) to start editing.

## Building

```sh
npm run build
npm run preview   # preview the production build locally
```

The static output lands in `build/` and can be deployed to any static host.
