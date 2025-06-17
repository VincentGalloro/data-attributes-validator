import { markDataAttribute } from '.';

// Handles the Browse section logic for processResponseData
export function processBrowseSection(data, checklist) {
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
