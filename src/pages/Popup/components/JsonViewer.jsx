import React, { useState } from 'react';
import CopyIcon from './CopyIcon';

const JsonViewer = ({ data }) => {
  const [copied, setCopied] = useState(false);
  if (!data) return null;
  const jsonString = JSON.stringify(data, null, 2);
  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <div style={{ position: 'relative', display: 'inline-block', width: 235 }}>
      <pre style={{ background: '#222', color: '#fff', padding: 8, borderRadius: 4, fontSize: 12, overflow: 'auto', maxHeight: 200, minHeight: 40, maxWidth: 235, boxSizing: 'border-box', whiteSpace: 'pre', margin: 0 }}>
        {jsonString}
      </pre>
      <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <CopyIcon onClick={handleCopy} />
        {copied && <span style={{ color: '#0f0', fontSize: 10, marginTop: 2, background: '#222', borderRadius: 2, padding: '0 4px' }}>Copied!</span>}
      </div>
    </div>
  );
};

export default JsonViewer;
