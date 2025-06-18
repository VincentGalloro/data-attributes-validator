import React from 'react';
import Tooltip from './Tooltip';

const ConsoleIcon = ({ onClick }) => (
  <Tooltip content="Log this element to the browser console" position="left">
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        marginLeft: 'auto',
        position: 'relative',
        cursor: 'pointer',
        height: 32,
        width: 32,
        justifyContent: 'flex-end',
      }}
      tabIndex={0}
    >
      <svg
        onClick={onClick}
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        style={{ display: 'block' }}
        aria-label="Log element to console"
      >
        <rect x="3" y="4" width="18" height="14" rx="2" fill="#888"/>
        <rect x="5" y="6" width="14" height="10" rx="1" fill="#fff"/>
        <path d="M8 13l-2-2 2-2" stroke="#888" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="12" y="12" width="4" height="1.5" rx="0.75" fill="#888"/>
      </svg>
    </span>
  </Tooltip>
);

export default ConsoleIcon;
