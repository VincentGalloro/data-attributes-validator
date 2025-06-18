import React, { useState } from 'react';

const getPositionStyle = (position) => {
  switch (position) {
    case 'right':
      return {
        left: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        right: 'auto',
      };
    case 'left':
      return {
        right: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        left: 'auto',
      };
    case 'bottom':
      return {
        top: '110%',
        left: '50%',
        transform: 'translateX(-50%)',
        right: 'auto',
      };
    case 'top':
    default:
      return {
        bottom: '110%',
        left: '50%',
        transform: 'translateX(-50%)',
        right: 'auto',
      };
  }
};

const Tooltip = ({ children, content, style = {}, position = 'bottom', ...props }) => {
  const [show, setShow] = useState(false);
  return (
    <span
      style={{ position: 'relative', ...style }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
      tabIndex={0}
      {...props}
    >
      {children}
      {show && (
        <span
          className="custom-tooltip"
          style={{
            visibility: 'visible',
            opacity: 1,
            background: '#222',
            color: '#fff',
            textAlign: 'center',
            borderRadius: 4,
            padding: '4px 10px',
            position: 'absolute',
            zIndex: 10,
            fontSize: 13,
            whiteSpace: 'nowrap',
            width: 'max-content',
            minWidth: 0,
            transition: 'opacity 0.2s',
            pointerEvents: 'none',
            ...getPositionStyle(position),
            ...props.tooltipStyle,
          }}
        >
          {content}
        </span>
      )}
    </span>
  );
};

export default Tooltip;
