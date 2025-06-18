// Handles chrome.runtime.onMessage and dispatches to checks and highlight modules
import {
  checkSearch,
  checkBrowse,
  checkResults,
  checkProductDetail,
  checkConversion,
  checkRecommendations,
  checkAutoComplete
} from './checks';
import { highlightElement, unhighlightElement } from './highlight';
import { logElement } from './logElement';

export function setupMessageHandler() {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'dataAttributesRunCheck') {
      const data = {
        search: checkSearch(),
        browse: checkBrowse(),
        results: checkResults(),
        productDetail: checkProductDetail(),
        conversion: checkConversion(),
        recommendations: checkRecommendations(),
        autoComplete: checkAutoComplete(),
      };
      sendResponse(data);
      return true;
    }
    if (request.type === 'highlightElement') {
      highlightElement(request.sectionId, request.itemId);
    }
    if (request.type === 'unhighlightElement') {
      unhighlightElement();
    }
    if (request.type === 'logElement') {
      logElement(request.sectionId, request.itemId);
    }
  });
}
