// Highlight logic for content script
import { HIGHLIGHT_CLASS, HIGHLIGHT_STYLE_ID } from './highlightConstants';
import itemAttributeMap from './itemAttributeMap';

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
    const attrs = itemAttributeMap[itemId];
    if (attrs && attrs.length > 0) {
        // Only use the first attribute for highlighting (fix for multi-attribute items like Num Results)
        const selector = `[data-cnstrc-${attrs[0]}]`;
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add(HIGHLIGHT_CLASS);
        });
    }
}

export function unhighlightElement() {
    document.querySelectorAll('.' + HIGHLIGHT_CLASS).forEach(el => el.classList.remove(HIGHLIGHT_CLASS));
}
