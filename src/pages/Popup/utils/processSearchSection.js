import { markDataAttribute } from '.';

// Handles the Search section logic for processResponseData
export function processSearchSection(data, checklist) {
  const { isSearchPage, numResults } = data.search;
  const isPartialSearchPage = isSearchPage || numResults !== null;
  const searchSection = checklist.find(s => s.id === 'search');
  searchSection.items[0].status = isSearchPage ? 'SUCCESS' : (isPartialSearchPage ? 'FAIL' : 'IGNORE');
  Object.assign(
    searchSection.items[1],
    markDataAttribute(numResults, 'Num Results', isPartialSearchPage, true)
  );
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
