// Central map for mapping item IDs to data attribute arrays
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

export default itemAttributeMap;
