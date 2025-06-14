export const STATUS_ICONS = {
  SUCCESS: 'check.png',
  FAIL: 'x.png',
  MAYBE: 'maybe.png',
  IGNORE: 'ignore.png',
  LOAD: 'load.png'
};

export const STATUS_CHARS = {
  SUCCESS: '✔', // All required data found and valid
  FAIL: '✖',    // Required data missing or invalid
  MAYBE: '?',   // Some optional data missing or uncertain
  IGNORE: '-',  // Not applicable or not checked
  LOAD: '...'   // Still loading or checking
};

const sections = [
  {
    id: 'search',
    name: "Search",
    items: [
      { id: "searchContainer", name: "Search Container" },
      { id: "searchNumResults", name: "Num Results" },
    ]
  },
  {
    id: 'browse',
    name: "Browse",
    items: [
      { id: "browseContainer", name: "Browse Container" },
      { id: "browseNumResults", name: "Num Results" },
      { id: "filterName", name: "Filter Name" },
      { id: "filterValue", name: "Filter Value" },
    ]
  },
  {
    id: 'itemResults',
    name: "Item Results",
    items: [
      { id: "itemId", name: "Item ID" },
      { id: "itemName", name: "Item Name" },
      { id: "itemVariationId", name: "Item Vatiation ID" },
      { id: "itemPrice", name: "Item Price" },
    ]
  },
  {
    id: 'productDetail',
    name: "Product Detail",
    items: [
      { id: 'productDetailContainer', name: 'Product Detail Container' }
    ]
  },
  {
    id: 'conversion',
    name: 'Conversion',
    items: [
      { id: 'conversionButton', name: 'Conversion Button' }
    ]
  },
  {
    id: 'recommendations',
    name: 'Recommendations',
    items: [
      { id: 'recommendationContainer', name: 'Recommendation Container' },
      { id: 'podId', name: 'Pod ID' },
      { id: 'resultId', name: 'Result ID' },
      { id: 'recommendationNumResults', name: 'Num Results' },
      { id: 'recommendationItems', name: 'Recommendation Items' },
    ]
  }
];

export function generateInitialChecklist() {
  return sections.map(section => ({
    ...section,
    status: null,
    headerText: null,
    items: section.items.map(item => ({
      ...item,
      status: 'LOAD',
      text: null
    }))
  }));
}

// Helper functions for status logic
function markDataAttribute(value, name, isPage, required) {
  if (value !== null && value !== undefined) {
    return { status: 'SUCCESS', text: `${name}: ${value}` };
  } else {
    if (isPage) {
      return { status: required ? 'FAIL' : 'MAYBE', text: `${name} Not Found` };
    } else {
      return { status: 'IGNORE', text: `${name} Not Found` };
    }
  }
}

function countHasAttribute(results, attr) {
  return results.filter(i => i[attr] !== null && i[attr] !== undefined).length;
}

// Main function to process response and return checklist state
export function processResponseData(data) {
  const checklist = generateInitialChecklist();

  // --- Search Section ---
  {
    const { isSearchPage, numResults } = data.search;
    const isPartialSearchPage = isSearchPage || numResults !== null;
    const searchSection = checklist.find(s => s.id === 'search');
    // Container
    searchSection.items[0].status = isSearchPage ? 'SUCCESS' : (isPartialSearchPage ? 'FAIL' : 'IGNORE');
    // Num Results
    Object.assign(
      searchSection.items[1],
      markDataAttribute(numResults, 'Num Results', isPartialSearchPage, true)
    );
    // Header
    if (isSearchPage && numResults !== null) {
      searchSection.status = 'SUCCESS';
      searchSection.headerText = 'Search Page Detected';
    } else if (isPartialSearchPage) {
      searchSection.status = 'MAYBE';
      searchSection.headerText = 'Search Page is Missing Data';
    } else {
      searchSection.status = 'IGNORE';
      searchSection.headerText = null;
    }
  }

  // --- Browse Section ---
  {
    const { isBrowsePage, numResults, filterName, filterValue } = data.browse;
    const isPartialBrowsePage = isBrowsePage || numResults !== null || filterName !== null || filterValue !== null;
    const browseSection = checklist.find(s => s.id === 'browse');
    browseSection.items[0].status = isBrowsePage ? 'SUCCESS' : (isPartialBrowsePage ? 'FAIL' : 'IGNORE');
    Object.assign(
      browseSection.items[1],
      markDataAttribute(numResults, 'Num Results', isPartialBrowsePage, true)
    );
    Object.assign(
      browseSection.items[2],
      markDataAttribute(filterName, 'Filter Name', isPartialBrowsePage, false)
    );
    Object.assign(
      browseSection.items[3],
      markDataAttribute(filterValue, 'Filter Value', isPartialBrowsePage, false)
    );
    const browsePageWorking = isBrowsePage && numResults !== null && filterName !== null && filterValue !== null;
    if (browsePageWorking) {
      browseSection.status = 'SUCCESS';
      browseSection.headerText = 'Browse Page is Detected';
    } else if (isPartialBrowsePage) {
      browseSection.status = 'MAYBE';
      browseSection.headerText = 'Browse Page is Missing Data';
    } else {
      browseSection.status = 'IGNORE';
      browseSection.headerText = null;
    }
  }

  // --- Item Results Section ---
  {
    const results = data.results || [];
    const anyResults = results.length > 0;
    const itemsWithName = countHasAttribute(results, 'itemName');
    const itemsWithVariationId = countHasAttribute(results, 'itemVariationId');
    const itemsWithPrice = countHasAttribute(results, 'itemPrice');
    const itemResultsSection = checklist.find(s => s.id === 'itemResults');
    // Item ID
    itemResultsSection.items[0].status = anyResults ? 'SUCCESS' : 'IGNORE';
    itemResultsSection.items[0].text = anyResults ? `${results.length} Items with ID` : 'No Item IDs Found';
    // Item Name
    itemResultsSection.items[1].status = itemsWithName === results.length ? 'SUCCESS' : (anyResults ? 'FAIL' : 'IGNORE');
    itemResultsSection.items[1].text = anyResults ? `${itemsWithName} Items with Name` : 'No Item Names Found';
    // Item Variation ID
    itemResultsSection.items[2].status = itemsWithVariationId === results.length ? 'SUCCESS' : (anyResults ? 'MAYBE' : 'IGNORE');
    itemResultsSection.items[2].text = anyResults ? `${itemsWithVariationId} Items with Variation ID` : 'No Item Variation IDs Found';
    // Item Price
    itemResultsSection.items[3].status = itemsWithPrice === results.length ? 'SUCCESS' : (anyResults ? 'MAYBE' : 'IGNORE');
    itemResultsSection.items[3].text = anyResults ? `${itemsWithPrice} Items with Price` : 'No Item Prices Found';
    // Header
    if (anyResults && itemsWithName === results.length) {
      itemResultsSection.status = 'SUCCESS';
      itemResultsSection.headerText = `${results.length} Item Results Found`;
    } else if (anyResults) {
      itemResultsSection.status = 'FAIL';
      itemResultsSection.headerText = `${results.length} Item Results Found, Some Incomplete`;
    } else {
      itemResultsSection.status = null;
      itemResultsSection.headerText = null;
    }
  }

  // --- Product Detail Section ---
  {
    const { isProductDetail } = data.productDetail;
    const productDetailSection = checklist.find(s => s.id === 'productDetail');
    productDetailSection.items[0].status = isProductDetail ? 'SUCCESS' : 'IGNORE';
    productDetailSection.items[0].text = isProductDetail ? 'Product Detail Container Found' : null;
    productDetailSection.status = isProductDetail ? 'SUCCESS' : 'IGNORE';
    productDetailSection.headerText = isProductDetail ? 'Product Detail Page Detected' : null;
  }

  // --- Conversion Section ---
  {
    const { conversionButtons } = data.conversion;
    const conversionSection = checklist.find(s => s.id === 'conversion');
    if (conversionButtons && conversionButtons.length > 0) {
      conversionSection.items[0].status = 'SUCCESS';
      conversionSection.items[0].text = 'Conversion Button(s) Found';
      // Optionally, could add sub-list of buttons if needed
      conversionSection.status = 'SUCCESS';
      conversionSection.headerText = 'Conversion Found';
    } else {
      conversionSection.items[0].status = 'IGNORE';
      conversionSection.items[0].text = null;
      conversionSection.status = 'IGNORE';
      conversionSection.headerText = null;
    }
  }

  // --- Recommendations Section ---
  {
    const { isRecommendations, podId, resultId, numResults, recommendationItems } = data.recommendations;
    const recSection = checklist.find(s => s.id === 'recommendations');
    recSection.items[0].status = isRecommendations ? 'SUCCESS' : 'IGNORE';
    Object.assign(
      recSection.items[1],
      markDataAttribute(podId, 'Pod ID', isRecommendations, true)
    );
    Object.assign(
      recSection.items[2],
      markDataAttribute(resultId, 'Result ID', isRecommendations, false)
    );
    Object.assign(
      recSection.items[3],
      markDataAttribute(numResults, 'Num Results', isRecommendations, true)
    );
    recSection.items[4].status = recommendationItems > 0 ? 'SUCCESS' : (isRecommendations ? 'MAYBE' : 'IGNORE');
    recSection.items[4].text = recommendationItems > 0
      ? `${recommendationItems} Recommendation Items Found`
      : (isRecommendations ? 'No Recommendation Items Found' : null);
    const recsWorking = isRecommendations && podId !== null && numResults !== null && recommendationItems > 0;
    if (recsWorking) {
      recSection.status = 'SUCCESS';
      recSection.headerText = 'Recommendations Detected';
    } else if (isRecommendations) {
      recSection.status = 'MAYBE';
      recSection.headerText = 'Recommendations are Missing Data';
    } else {
      recSection.status = 'IGNORE';
      recSection.headerText = null;
    }
  }

  return checklist;
}
