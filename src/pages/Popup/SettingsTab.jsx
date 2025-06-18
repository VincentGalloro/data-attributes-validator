import React, { useState, useEffect } from 'react';
import { getIndexKey, setIndexKey } from '../../customComponents/NoOfItemsExistsInTheCatalogue/settings';

const SettingsTab = () => {
  const [indexKey, setIndexKeyState] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getIndexKey().then(key => setIndexKeyState(key || ''));
  }, []);

  const handleChange = (e) => {
    setIndexKeyState(e.target.value);
    setSaved(false);
  };

  const handleSave = async () => {
    await setIndexKey(indexKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  return (
    <div style={{ color: '#b3baff', marginTop: 8, fontSize: '0.95em', minWidth: 260 }}>
      <b>Extension Settings</b>
      <div style={{ margin: '16px 0 8px 0' }}>
        <label htmlFor="index-key-input" style={{ fontWeight: 500 }}>Index Key:</label>
        <input
          id="index-key-input"
          type="text"
          value={indexKey}
          onChange={handleChange}
          style={{ width: '100%', marginTop: 6, padding: 6, borderRadius: 4, border: '1px solid #444', background: '#23243a', color: '#fff' }}
          placeholder="Enter your index key"
        />
      </div>
      <button onClick={handleSave} style={{ marginRight: 8 }}>Save</button>
      {saved && <span style={{ color: '#6fcf97', marginLeft: 10 }}>Saved!</span>}
    </div>
  );
};

export default SettingsTab;
