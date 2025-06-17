// All check* functions for content script
import { cqs, cqsa, cqsd } from './selectors';

export function checkSearch() {
    const search = cqs('search');
    const numResults = cqsd(search, 'NumResults');
    return { isSearchPage: !!search, numResults };
}

export function checkBrowse() {
    const browse = cqs('browse');
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
    const conversionButtons = Array.from(new Set(
        cqsa('btn').map(b => cqsd(b, 'Btn'))
    ));
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
