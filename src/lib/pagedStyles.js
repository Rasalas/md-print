import { PAGE_MARGINS } from './config.js';

export function createPagedStyles({ pageSize, showPageNumbers }) {
	const margin = PAGE_MARGINS.map((value) => `${value}mm`).join(' ');
	const pageNumberRule = showPageNumbers
		? '@bottom-center { content: counter(page); font-size: 10pt; color: #555; }'
		: '';

	return `
@page {
	size: ${pageSize};
	margin: ${margin};
	${pageNumberRule}
}

.paper {
	break-before: auto;
}

.paper .frontmatter-header,
.paper .toc,
.paper figure,
.paper table,
.paper pre,
.paper blockquote,
.paper .katex-display {
	break-inside: avoid;
	page-break-inside: avoid;
}

.paper h1,
.paper h2,
.paper h3,
.paper h4,
.paper h5,
.paper h6 {
	break-after: avoid;
	page-break-after: avoid;
}

.paper h1 + *,
.paper h2 + *,
.paper h3 + * {
	break-before: avoid;
	page-break-before: avoid;
}

.paper .pagebreak {
	break-before: page;
	page-break-before: always;
	border: 0;
	height: 0;
	margin: 0;
}

.paper .pagebreak::after {
	display: none;
}

.paper table {
	break-inside: auto;
}

.paper tr {
	break-inside: avoid;
	break-after: auto;
}

.paper thead {
	display: table-header-group;
}

.paper tfoot {
	display: table-footer-group;
}
`;
}
