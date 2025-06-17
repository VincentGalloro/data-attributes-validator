import { markDataAttribute } from '.';

// Handles the Auto Complete section logic for processResponseData
export function processAutoCompleteSection(data, checklist) {
  const auto = data.autoComplete || {};
  const section = checklist.find(s => s.id === 'autoComplete');

  // 1. Search Form
  section.items[0].status = auto.form ? 'SUCCESS' : 'FAIL';
  section.items[0].text = auto.form ? 'Search Form Found' : 'Search Form Not Found';

  // 2. Search Input
  section.items[1].status = auto.input ? 'SUCCESS' : 'FAIL';
  section.items[1].text = auto.input ? 'Search Input Found' : 'Search Input Not Found';

  // 3. Search Submit Button
  section.items[2].status = auto.submitBtn ? 'SUCCESS' : 'FAIL';
  section.items[2].text = auto.submitBtn ? 'Search Submit Button Found' : 'Search Submit Button Not Found';

  // 4. Results List Container
  section.items[3].status = auto.autosuggest ? 'SUCCESS' : 'FAIL';
  section.items[3].text = auto.autosuggest ? 'Results List Container Found' : 'Results List Container Not Found';

  // 5. Result Items (sections)
  const numSections = Array.isArray(auto.sections) ? auto.sections.length : 0;
  section.items[4].status = numSections > 0 ? 'SUCCESS' : (auto.autosuggest ? 'MAYBE' : 'IGNORE');
  section.items[4].text = numSections > 0
    ? `Sections Found (${numSections})`
    : (auto.autosuggest ? 'No Sections Found' : null);
  section.items[4].subList = (auto.sections || []).map(
    s => `${s.section || 'Unnamed Section'} (${s.itemCount} item${s.itemCount === 1 ? '' : 's'})`
  );

  // Section status
  if (auto.form && auto.input && auto.submitBtn && auto.autosuggest && numSections > 0) {
    section.status = 'SUCCESS';
    section.headerText = 'Auto Complete Detected';
  } else if (auto.form || auto.input || auto.submitBtn || auto.autosuggest) {
    section.status = 'MAYBE';
    section.headerText = 'Auto Complete is Missing Data';
  } else {
    section.status = 'IGNORE';
    section.headerText = null;
  }
}
