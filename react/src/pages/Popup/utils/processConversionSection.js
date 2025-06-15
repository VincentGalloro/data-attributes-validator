// Handles the Conversion section logic for processResponseData
export function processConversionSection(data, checklist) {
  const { conversionButtons } = data.conversion;
  const conversionSection = checklist.find(s => s.id === 'conversion');
  if (conversionButtons && conversionButtons.length > 0) {
    const buttonCount = conversionButtons.length;
    conversionSection.items[0].status = 'SUCCESS';
    conversionSection.items[0].text = `Conversion Button(s) Found (${buttonCount})`;
    conversionSection.status = 'SUCCESS';
    conversionSection.headerText = `Conversion Found (${buttonCount})`;
    // Use generic subList property for sub-child rendering in UI
    conversionSection.items[0].subList = conversionButtons;
  } else {
    conversionSection.items[0].status = 'IGNORE';
    conversionSection.items[0].text = null;
    conversionSection.status = 'IGNORE';
    conversionSection.headerText = null;
    conversionSection.items[0].subList = [];
  }
}
