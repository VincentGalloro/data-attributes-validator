// DOM query helpers for content script
export function cqs(name) {
    return document.querySelector(`[data-cnstrc-${name}]`);
}

export function cqsa(name) {
    return Array.from(document.querySelectorAll(`[data-cnstrc-${name}]`));
}

export function cqsd(elem, name) {
    return elem && elem.dataset && elem.dataset[`cnstrc${name}`];
}
