// File: src/customComponents/NoOfItemsExistsInTheCatalogue/NoOfItemsExistsInTheCatalogueMain.jsx

import React, { useEffect, useState, useMemo } from 'react';
import ConsoleIcon from '../../components/ConsoleIcon';

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
        setResult({ loading: false, error: 'Index key not found.', missing: [], found: [] });
        return;
      }
      if (!itemIds.length) {
        setResult({ loading: false, error: 'No item IDs found on page.', missing: [], found: [] });
        return;
      }
      setResult(r => ({ ...r, loading: true }));
      const params = new URLSearchParams({ key: indexKey, c: 'CIOExtension' });
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
    <div style={{ color: '#b3baff', marginTop: 8, fontSize: '0.95em' }}>
      <b>Catalogue Check:</b><br />
      {result.loading && 'Checking catalogue...'}
      {result.error && <span style={{ color: 'red' }}>{result.error}</span>}
      {!result.loading && !result.error && (
        <>
          {result.missing.length === 0 ? (
            <span style={{ color: '#6fcf97' }}>All item IDs found in catalogue.</span>
          ) : (
            <div style={{ marginTop: 6 }}>
              <div style={{ color: 'red', fontWeight: 600, fontSize: '0.98em', marginBottom: 2 }}>Missing Item IDs:</div>
              <ul style={{ color: 'red', fontSize: '0.92em', margin: 0, padding: 0, listStyle: 'none' }}>
                {result.missing.map((id) => (
                  <li
                    key={id}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', padding: '2px 0' }}
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
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NoOfItemsExistsInTheCatalogueMain;
