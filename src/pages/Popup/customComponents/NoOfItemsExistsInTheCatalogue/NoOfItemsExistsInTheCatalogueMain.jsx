// File: src/customComponents/NoOfItemsExistsInTheCatalogue/NoOfItemsExistsInTheCatalogueMain.jsx

import React, { useEffect, useState, useMemo } from 'react';
import './NoOfItemsExistsInTheCatalogueMain.css';
import ConsoleIcon from '../../components/ConsoleIcon';
import Accordion from '../../components/Accordion';

const API_BASE = 'https://ac.cnstrc.com/browse/items';

const NoOfItemsExistsInTheCatalogueMain = ({ checklist, indexKey }) => {
  const [result, setResult] = useState({ loading: true, error: null, missing: [], found: [] });

  const itemIds = useMemo(() => {
    const itemResultsSection = checklist.find(s => s.id === 'itemResults');
    const results = itemResultsSection && Array.isArray(itemResultsSection.results) ? itemResultsSection.results : [];
    return results.map(item => item.itemId).filter(Boolean);
  }, [checklist]);

  useEffect(() => {
    const fetchIndexKey = async () => {
      if (!indexKey) {
        setResult({ loading: false, error: 'Index key not found. Please go to the extension settings and add your index key to proceed.', missing: [], found: [] });
        return;
      }
      if (!itemIds.length) {
        setResult({ loading: false, error: 'No item IDs found on page.', missing: [], found: [] });
        return;
      }
      setResult(r => ({ ...r, loading: true }));
      const params = new URLSearchParams({ key: indexKey, c: 'CIOExtension', num_results_per_page: 200 });
      itemIds.forEach(id => params.append('ids', id));
      fetch(`${API_BASE}?${params.toString()}`)
        .then(res => res.json())
        .then(data => {
          if (!data || !Array.isArray(data.response?.results)) {
            setResult({ loading: false, error: 'Invalid API response', missing: [], found: [] });
            return;
          }
          const foundIds = data.response.results.map(item => String(item.data?.id));
          const missing = itemIds.filter(id => !foundIds.includes(String(id)));
          setResult({ loading: false, error: null, missing, found: foundIds });
        })
        .catch(e => setResult({ loading: false, error: e.message, missing: [], found: [] }));
    };
    fetchIndexKey();
    // eslint-disable-next-line
  }, [itemIds.join(','), indexKey]);

  // Highlight/unhighlight missing itemId on hover
  const handleHighlight = (itemId, action) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: action === 'highlight' ? 'highlightElementsByAttribute' : 'unhighlightElementsByAttribute',
        attribute: 'item-id',
        value: itemId
      });
    });
  };

  // Log element to console (generic by attribute/value)
  const handleLogElement = (itemId) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'logElementsByAttribute',
        attribute: 'item-id',
        value: itemId
      });
    });
  };

  return (
    <div className="catalogue-check">
      <span className="catalogue-check-title">Catalogue Check:</span><br />
      {result.loading && (
        <span className="catalogue-check-loading">Checking catalogue...</span>
      )}
      {!result.loading && result.error && (
        <span className="catalogue-check-error">{result.error}</span>
      )}
      {!result.loading && !result.error && (
        <>
          <div className="catalogue-check-status">
            <span className="catalogue-check-matched">
              Matched: {result.found.length}
            </span>
            <span className={`catalogue-check-missing ${result.missing.length ? 'red' : 'green'}`}> 
              Missing: {result.missing.length}
            </span>
          </div>
          {result.missing.length === 0 ? (
            <span className="catalogue-check-success">All item IDs found in catalogue.</span>
          ) : (
            <Accordion title={`Show missing item IDs (${result.missing.length})`} defaultOpen={false}>
              <ul className="catalogue-missing-list">
                {result.missing.map((id) => (
                  <li
                    key={id}
                    className="catalogue-missing-list-item"
                    onMouseEnter={() => handleHighlight(id, 'highlight')}
                    onMouseLeave={() => handleHighlight(id, 'unhighlight')}
                  >
                    <span>{id}</span>
                    <span>
                      <ConsoleIcon onClick={e => { e.stopPropagation(); handleLogElement(id); }} />
                    </span>
                  </li>
                ))}
              </ul>
            </Accordion>
          )}
        </>
      )}
    </div>
  );
};

export default NoOfItemsExistsInTheCatalogueMain;
