// index.js
import React, { useState, useEffect } from 'react';
import NoOfItemsExistsInTheCatalogueMain from './NoOfItemsExistsInTheCatalogueMain';
import { getIndexKey } from '../../utils/settings';

const NoOfItemsExistsInTheCatalogue = ({ checklist }) => {
  const [indexKey, setIndexKey] = useState('');

  // Helper to reload the key
  const reloadIndexKey = () => {
    getIndexKey().then(key => setIndexKey(key || ''));
  };

  useEffect(() => {
    reloadIndexKey();
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: 80, flex: 1 }}>
      <NoOfItemsExistsInTheCatalogueMain checklist={checklist} indexKey={indexKey} />
    </div>
  );
};

export default NoOfItemsExistsInTheCatalogue;
