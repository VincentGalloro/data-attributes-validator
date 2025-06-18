import itemAttributeMap from './itemAttributeMap';

export function scrollToElementBySectionAndItem(sectionId, itemId) {
  const attrs = itemAttributeMap[itemId];
  let el = null;
  if (attrs && attrs.length > 0) {
    const selector = `[data-cnstrc-${attrs[0]}]`;
    el = document.querySelector(selector);
  }
  if (!el && itemId) {
    el = document.querySelector(`[data-cnstrc-item-id="${itemId}"]`);
  }
  if (el) {
    const rect = el.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const top = rect.top + scrollTop - 30;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}
