import { markDataAttribute } from '.';

// Handles the Recommendations section logic for processResponseData
export function processRecommendationsSection(data, checklist) {
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
    ? `Recommendation Items Found (${recommendationItems})`
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
