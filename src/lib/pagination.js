import { PAGE_MARGINS } from './config.js';

function clearPaginationArtifacts(paper) {
	for (const node of paper.querySelectorAll('.page-gap, .page-filler, .page-number')) node.remove();
	for (const pagebreak of paper.querySelectorAll('.paginated')) pagebreak.classList.remove('paginated');
}

function measureSlotHeight(paper) {
	const pageHeight =
		paper.style.getPropertyValue('--paper-min-h').trim() ||
		getComputedStyle(paper).getPropertyValue('--paper-min-h').trim();
	if (!pageHeight) return 0;

	const [topMargin, , bottomMargin] = PAGE_MARGINS;
	const probe = document.createElement('div');
	probe.style.cssText = `height: calc(${pageHeight} - ${topMargin}mm - ${bottomMargin}mm); position: absolute; visibility: hidden;`;
	paper.appendChild(probe);
	const slotHeight = probe.offsetHeight;
	probe.remove();
	return slotHeight;
}

function measureChildren(paper) {
	const paperRect = paper.getBoundingClientRect();
	return Array.from(paper.children).map((el) => {
		const rect = el.getBoundingClientRect();
		return {
			el,
			top: rect.top - paperRect.top,
			bottom: rect.bottom - paperRect.top,
			tag: el.tagName,
			isHeading: !!(el.tagName && /^H[1-6]$/.test(el.tagName)),
			isManualBreak: el.classList.contains('pagebreak')
		};
	});
}

function insertBreak(parent, beforeEl, pageNum, usedHeight, slotHeight, showPageNumbers) {
	if (beforeEl.classList.contains('pagebreak')) beforeEl.classList.add('paginated');

	if (showPageNumbers) {
		const pageNumber = document.createElement('div');
		pageNumber.className = 'page-number';
		pageNumber.textContent = String(pageNum);
		pageNumber.style.height = `${Math.max(0, slotHeight - usedHeight)}px`;
		parent.insertBefore(pageNumber, beforeEl);
	}

	const gap = document.createElement('div');
	gap.className = 'page-gap';
	parent.insertBefore(gap, beforeEl);
}

export function resetPagination(paper) {
	if (!paper) return;
	clearPaginationArtifacts(paper);
}

export function paginatePaper(paper, options = {}) {
	if (!paper) return { pageCount: 0, breakCount: 0, slotHeight: 0 };

	const { showPageNumbers = false, skipIfNarrow = false } = options;
	clearPaginationArtifacts(paper);

	if (skipIfNarrow && paper.offsetWidth < 400) {
		return { pageCount: 1, breakCount: 0, slotHeight: 0 };
	}

	const slotHeight = measureSlotHeight(paper);
	if (slotHeight <= 0) {
		return { pageCount: 1, breakCount: 0, slotHeight: 0 };
	}

	const minAfterHeading = slotHeight * 0.2;
	const children = measureChildren(paper);
	if (children.length === 0) {
		return { pageCount: 1, breakCount: 0, slotHeight };
	}

	const breakpoints = [];
	let pageNum = 1;
	let pageStart = 0;
	let lastHeading = null;

	for (const child of children) {
		if (child.isManualBreak) {
			breakpoints.push({
				beforeEl: child.el,
				pageNum,
				usedHeight: Math.max(0, child.top - pageStart)
			});
			pageNum += 1;
			pageStart = child.top;
			lastHeading = null;
			continue;
		}

		while (child.top > pageStart && child.bottom - pageStart > slotHeight) {
			const shouldPullHeading =
				lastHeading &&
				lastHeading.top >= pageStart &&
				lastHeading.contentAfter < minAfterHeading &&
				lastHeading.top > pageStart;

			if (shouldPullHeading) {
				breakpoints.push({
					beforeEl: lastHeading.el,
					pageNum,
					usedHeight: Math.max(0, lastHeading.top - pageStart)
				});
				pageNum += 1;
				pageStart = lastHeading.top;
				lastHeading = null;
				continue;
			}

			breakpoints.push({
				beforeEl: child.el,
				pageNum,
				usedHeight: Math.max(0, child.top - pageStart)
			});
			pageNum += 1;
			pageStart = child.top;
			lastHeading = null;
		}

		if (child.isHeading) {
			lastHeading = {
				el: child.el,
				top: child.top,
				bottom: child.bottom,
				contentAfter: 0
			};
			continue;
		}

		if (lastHeading) {
			lastHeading.contentAfter = child.bottom - lastHeading.bottom;
			if (lastHeading.contentAfter >= minAfterHeading) lastHeading = null;
		}
	}

	for (const breakpoint of breakpoints) {
		insertBreak(
			paper,
			breakpoint.beforeEl,
			breakpoint.pageNum,
			breakpoint.usedHeight,
			slotHeight,
			showPageNumbers
		);
	}

	const lastContent = children.findLast((child) => !child.isManualBreak);
	const lastPageUsed = lastContent ? Math.max(0, lastContent.bottom - pageStart) : 0;

	if (showPageNumbers && pageNum > 1 && lastPageUsed > 0 && lastPageUsed < slotHeight) {
		const filler = document.createElement('div');
		filler.className = 'page-filler page-number';
		filler.textContent = String(pageNum);
		filler.style.height = `${slotHeight - lastPageUsed}px`;
		paper.appendChild(filler);
	}

	return {
		pageCount: Math.max(1, breakpoints.length + 1),
		breakCount: breakpoints.length,
		slotHeight
	};
}
