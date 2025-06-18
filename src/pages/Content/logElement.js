// Handles logging the matched element to the console for a checklist item
import { ensureHighlightStyle } from './highlight';
import itemAttributeMap from './itemAttributeMap';

export function logElement(sectionId, itemId) {
    ensureHighlightStyle();
    const attrs = itemAttributeMap[itemId];
    if (attrs && attrs.length > 0) {
        // Only use the first attribute for logging (fix for multi-attribute items like Num Results)
        const selector = `[data-cnstrc-${attrs[0]}]`;
        document.querySelectorAll(selector).forEach(el => {
            // eslint-disable-next-line no-console
            console.log('Constructor Data Attribute Element:', el);
        });
    }
}
