// Handles the Request Object and Result ID section logic for processResponseData
export function processRequestObjectSection(data, checklist) {
  const section = checklist.find(s => s.id === 'requestObject');
  if (!section) return;
  const req = data.requestObject || {};
  // 1. Tag present
  section.items[0].status = req.present ? 'SUCCESS' : 'FAIL';
  section.items[0].text = req.present ? 'Script tag found' : 'Script tag not found';
  // 2. Request object present
  section.items[1].status = req.present && req.validJson && req.hasRequest ? 'SUCCESS' : (req.present ? 'FAIL' : 'IGNORE');
  section.items[1].text = req.hasRequest ? 'Request object found' : (req.present ? 'Request object missing' : null);
  // 3. Result ID present
  section.items[2].status = req.present && req.validJson && req.hasResultId ? 'SUCCESS' : (req.present ? 'FAIL' : 'IGNORE');
  section.items[2].text = req.hasResultId ? `Result ID: ${req.result_id}` : (req.present ? 'Result ID missing' : null);
  // 4. Request Object JSON
  section.items[3].status = req.requestObjectJson ? 'SUCCESS' : 'FAIL';
  section.items[3].text = req.requestObjectJson ? 'Request Object JSON found' : 'Request Object JSON missing or invalid';
  section.items[3].json = req.requestObjectJson || null;
  // Section status
  if (req.requestObjectJson) {
    section.status = 'SUCCESS';
    section.headerText = 'Request Object and Result ID Found';
  } else if (req.present) {
    section.status = 'FAIL';
    section.headerText = 'Request Object or Result ID Missing';
  } else {
    section.status = 'IGNORE';
    section.headerText = null;
  }
}
