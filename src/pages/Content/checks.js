// All check* functions for content script
import { cqs, cqsa, cqsd, cqsaWithin } from './selectors';

export function checkSearch() {
    // Explicitly check for [data-cnstrc-search]:not([data-cnstrc-search="false"])
    const search = document.querySelector('[data-cnstrc-search]:not([data-cnstrc-search="false"])');
    const numResults = cqsd(search, 'NumResults');
    return { isSearchPage: !!search, numResults };
}

export function checkBrowse() {
    // Explicitly check for [data-cnstrc-browse]:not([data-cnstrc-browse="false"])
    const browse = document.querySelector('[data-cnstrc-browse]:not([data-cnstrc-browse="false"])');
    const numResults = cqsd(browse, 'NumResults');
    const filterName = cqsd(browse, 'FilterName');
    const filterValue = cqsd(browse, 'FilterValue');
    return { isBrowsePage: !!browse, numResults, filterName, filterValue };
}

export function checkResult(elem) {
    const itemId = cqsd(elem, 'ItemId');
    const itemName = cqsd(elem, 'ItemName');
    const itemVariationId = cqsd(elem, 'ItemVariationId');
    const itemPrice = cqsd(elem, 'ItemPrice');
    return { itemId, itemName, itemVariationId, itemPrice };
}

export function checkProductDetail() {
    const productDetail = cqs('product-detail');
    return { isProductDetail: !!productDetail };
}

export function checkConversion() {
    // Get all conversion buttons (case-insensitive for attribute)
    const buttons = cqsa('btn');
    const buttonMap = {};
    buttons.forEach(b => {
        // Try both lower and upper case for attribute
        let name = cqsd(b, 'Btn') || cqsd(b, 'btn') || 'Unnamed Button';
        buttonMap[name] = (buttonMap[name] || 0) + 1;
    });
    // Convert to array of {name, count}
    const conversionButtons = Object.entries(buttonMap).map(([name, count]) => ({ name, count }));
    return { conversionButtons };
}

export function checkResults() {
    const items = cqsa('item-id');
    return items.map(checkResult);
}

export function checkRecommendations() {
    const recommendations = cqs('recommendations');
    const podId = cqsd(recommendations, 'RecommendationsPodId');
    const resultId = cqsd(recommendations, 'ResultId');
    const numResults = cqsd(recommendations, 'NumResults');
    const recommendationItems = cqsa('item').map(i => cqsd(i, 'Item')).filter(i => i === "recommendation").length;
    return {
        isRecommendations: !!recommendations,
        podId,
        resultId,
        numResults,
        recommendationItems,
    };
}

export function checkAutoComplete() {
    const form = !!cqs('search-form');
    const input = !!cqs('search-input');
    const submitBtn = !!cqs('search-submit-btn');
    const autosuggestEl = cqs('autosuggest');
    const autosuggest = !!autosuggestEl;

    // Find all item-section elements under autosuggest
    const sectionNodes = autosuggestEl ? cqsa('item-section', autosuggestEl) : [];
    // For each section, get its name and count of items
    const sections = sectionNodes.map(sectionNode => {
        const sectionName = cqsd(sectionNode, 'ItemSection');
        // Use cqsaWithin to get all item-name elements within this section
        const items = cqsaWithin('item-name', sectionNode);
        return {
            section: sectionName,
            itemCount: items.length
        };
    });

    return {
        form,
        input,
        submitBtn,
        autosuggest,
        sections
    };
}

export function checkRequestObject() {
    // Only run on search or browse result pages
    const isSearch = !!document.querySelector('[data-cnstrc-search]:not([data-cnstrc-search="false"])');
    const isBrowse = !!document.querySelector('[data-cnstrc-browse]:not([data-cnstrc-browse="false"])');
    if (!isSearch && !isBrowse) return { present: false };
    const script = document.querySelector('script#cnstrc-data[type="application/json"]');
    if (!script) return { present: false };
    let json = null;
    try {
        json = JSON.parse(script.textContent);
    } catch (e) {
        return { present: true, validJson: false };
    }
    return {
        present: true,
        validJson: true,
        hasRequest: !!json.request,
        hasResultId: !!json.result_id,
        request: json.request,
        result_id: json.result_id,
        requestObjectJson: json // Pass the full JSON for rendering
    };
}