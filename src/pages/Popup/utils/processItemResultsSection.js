import { countHasAttribute } from ".";

// Handles the Item Results section logic for processResponseData
export function processItemResultsSection(data, checklist) {
  const results = data.results || [];
  const anyResults = results.length > 0;
  const itemsWithName = countHasAttribute(results, 'itemName');
  const itemsWithVariationId = countHasAttribute(results, 'itemVariationId');
  const itemsWithPrice = countHasAttribute(results, 'itemPrice');
  const itemResultsSection = checklist.find(s => s.id === 'itemResults');
  itemResultsSection.items[1].status = anyResults ? 'SUCCESS' : 'IGNORE';
  itemResultsSection.items[1].text = anyResults ? `Items with ID (${results.length})` : 'No Item IDs Found';
  itemResultsSection.items[2].status = anyResults && itemsWithName === results.length ? 'SUCCESS' : (anyResults ? 'FAIL' : 'IGNORE');
  itemResultsSection.items[2].text = anyResults ? `Items with Name (${itemsWithName})` : 'No Item Names Found';
  itemResultsSection.items[3].status = anyResults && itemsWithVariationId === results.length ? 'SUCCESS' : (anyResults ? 'MAYBE' : 'IGNORE');
  itemResultsSection.items[3].text = anyResults ? `Items with Variation ID (${itemsWithVariationId})` : 'No Item Variation IDs Found';
  itemResultsSection.items[4].status = anyResults && itemsWithPrice === results.length ? 'SUCCESS' : (anyResults ? 'MAYBE' : 'IGNORE');
  itemResultsSection.items[4].text = anyResults ? `Items with Price (${itemsWithPrice})` : 'No Item Prices Found';

  // Attach raw results array for use in custom components
  itemResultsSection.results = results;

  if (anyResults && itemsWithName === results.length) {
    itemResultsSection.status = 'SUCCESS';
    itemResultsSection.headerText = `Item Results Found (${results.length})`;
  } else if (anyResults) {
    itemResultsSection.status = 'FAIL';
    itemResultsSection.headerText = `Item Results Found (${results.length}), Some Incomplete`;
  } else {
    itemResultsSection.status = 'IGNORE';
    itemResultsSection.headerText = null;
  }
}
