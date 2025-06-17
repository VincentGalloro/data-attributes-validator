// Highlight logic for content script
import { HIGHLIGHT_CLASS, HIGHLIGHT_STYLE_ID } from './highlightConstants';

export function ensureHighlightStyle() {
    if (!document.getElementById(HIGHLIGHT_STYLE_ID)) {
        const style = document.createElement('style');
        style.id = HIGHLIGHT_STYLE_ID;
        style.innerHTML = `
            .${HIGHLIGHT_CLASS} {
                outline: 3px solid #a07cff !important;
                outline-offset: 2px !important;
                background: rgba(160,124,255,0.08) !important;
                transition: outline 0.2s;
                z-index: 2147483647 !important;
            }
        `;
        document.head.appendChild(style);
    }
}

export function highlightElement(sectionId, itemId) {
    ensureHighlightStyle();
    const itemAttributeMap = {
        searchContainer: ['search'],
        searchNumResults: ['search', 'search-num-results'],
        browseContainer: ['browse'],
        browseNumResults: ['browse', 'num-results'],
        filterName: ['browse', 'filter-name'],
        filterValue: ['browse', 'filter-value'],
        itemId: ['item-id'],
        itemName: ['item-id', 'item-name'],
        itemVariationId: ['item-id', 'item-variation-id'],
        itemPrice: ['item-id', 'item-price'],
        productDetailContainer: ['product-detail'],
        conversionButton: ['btn'],
        recommendationContainer: ['recommendations'],
        podId: ['recommendations', 'pod-id'],
        resultId: ['recommendations', 'result-id'],
        recommendationNumResults: ['recommendations', 'num-results'],
        recommendationItems: ['item'],
        // Auto Complete section
        searchForm: ['search-form'],
        searchInput: ['search-input'],
        searchSubmitBtn: ['search-submit-btn'],
        autosuggest: ['autosuggest'],
        resultItems: ['item-section'],
    };
    const attrs = itemAttributeMap[itemId];
    if (attrs && attrs.length > 0) {
        const selector = `[data-cnstrc-${attrs[0]}]`;
        document.querySelectorAll(selector).forEach(el => {
            const allExist = attrs.every(attr => el.hasAttribute(`data-cnstrc-${attr}`));
            if (allExist) {
                el.classList.add(HIGHLIGHT_CLASS);
            }
        });
    }
}

export function unhighlightElement() {
    document.querySelectorAll('.' + HIGHLIGHT_CLASS).forEach(el => el.classList.remove(HIGHLIGHT_CLASS));
}
