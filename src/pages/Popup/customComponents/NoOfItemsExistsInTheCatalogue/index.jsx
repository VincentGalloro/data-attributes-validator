// index.js
import React, { useState, useEffect } from 'react';
import NoOfItemsExistsInTheCatalogueMain from './NoOfItemsExistsInTheCatalogueMain';
import { getIndexKey } from '../../utils/settings';
import './NoOfItemsExistsInTheCatalogueMain.css';

const NoOfItemsExistsInTheCatalogue = ({ checklist }) => {
  const [loading, setLoading] = useState(true);
  const [indexKey, setIndexKey] = useState('');

  // Helper to reload the key
  const reloadIndexKey = () => {
    setLoading(true);
    getIndexKey().then(key => {
      setIndexKey(key || '');
      setLoading(false);
    });
  };

  useEffect(() => {
    reloadIndexKey();
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: 40, flex: 1 }}>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <NoOfItemsExistsInTheCatalogueMain checklist={checklist} indexKey={indexKey} />
      )}
    </div>
  );
};

export default NoOfItemsExistsInTheCatalogue;
