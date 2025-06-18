import React from 'react';

const CopyIcon = ({ onClick }) => (
  <span
    onClick={onClick}
    title="Copy to clipboard"
    style={{ cursor: 'pointer', marginLeft: 8, display: 'inline-flex', alignItems: 'center' }}
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ background: '#444', borderRadius: 3, padding: 2 }}>
      <rect x="9" y="9" width="13" height="13" rx="2"/>
      <path d="M5 15V5a2 2 0 0 1 2-2h10"/>
    </svg>
  </span>
);

export default CopyIcon;
