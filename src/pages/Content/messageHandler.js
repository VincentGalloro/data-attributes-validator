// Handles chrome.runtime.onMessage and dispatches to checks and highlight modules
import {
  checkSearch,
  checkBrowse,
  checkResults,
  checkProductDetail,
  checkConversion,
  checkRecommendations,
  checkAutoComplete,
  checkRequestObject
} from './checks';
import { highlightElement, unhighlightElement, highlightElementByItemIdValue, unhighlightElementByItemIdValue, highlightElementsByAttribute, unhighlightElementsByAttribute } from './highlight';
import { logElement, logElementsByAttribute } from './logElement';

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
        requestObject: checkRequestObject(),
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
    if (request.type === 'highlightElementsByAttribute') {
      highlightElementsByAttribute(request.attribute, request.value);
    }
    if (request.type === 'unhighlightElementsByAttribute') {
      unhighlightElementsByAttribute(request.attribute, request.value);
    }
    if (request.type === 'logElementsByAttribute') {
      logElementsByAttribute(request.attribute, request.value);
    }
  });
}
