import { processSearchSection } from './processSearchSection';
import { processBrowseSection } from './processBrowseSection';
import { processItemResultsSection } from './processItemResultsSection';
import { processProductDetailSection } from './processProductDetailSection';
import { processConversionSection } from './processConversionSection';
import { processRecommendationsSection } from './processRecommendationsSection';
import { processAutoCompleteSection } from './processAutoCompleteSection';
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
      { id: "customNoOfItems", customComponent: 'NoOfItemsExistsInTheCatalogue' },
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
  },
  {
    id: 'autoComplete',
    name: 'Auto Complete',
    items: [
      { id: 'searchForm', name: 'Search Form (data-cnstrc-search-form)' },
      { id: 'searchInput', name: 'Search Input (data-cnstrc-search-input)' },
      { id: 'searchSubmitBtn', name: 'Search Submit Button (data-cnstrc-search-submit-btn)' },
      { id: 'autosuggest', name: 'Results List Container (data-cnstrc-autosuggest)' },
      { id: 'resultItems', name: 'Result Items (data-cnstrc-item-section, ...)' }
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
export function markDataAttribute(value, name, isPage, required) {
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

export function countHasAttribute(results, attr) {
  return results.filter(i => i[attr] !== null && i[attr] !== undefined).length;
}

// Main function to process response and return checklist state
export function processResponseData(data) {
  const checklist = generateInitialChecklist();

  processSearchSection(data, checklist);
  processBrowseSection(data, checklist);
  processItemResultsSection(data, checklist);
  processProductDetailSection(data, checklist);
  processConversionSection(data, checklist);
  processRecommendationsSection(data, checklist);
  processAutoCompleteSection(data, checklist);

  return checklist;
}
