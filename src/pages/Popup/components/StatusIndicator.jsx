import React from 'react';
import Tooltip from './Tooltip';

const STATUS_TOOLTIPS = {
  SUCCESS: 'All required data found and valid',
  FAIL: 'Required data missing or invalid',
  MAYBE: 'Some optional data missing or uncertain',
  IGNORE: 'Not applicable or not checked',
  LOAD: 'Still loading or checking'
};

const STATUS_ICONS = {
  SUCCESS: 'icons/check.png',
  FAIL: 'icons/x.png',
  MAYBE: 'icons/maybe.png',
  IGNORE: 'icons/ignore.png',
  LOAD: 'icons/load.png',
};

const StatusIndicator = ({ status }) => {
  const iconSrc = STATUS_ICONS[status] || STATUS_ICONS['LOAD'];
  return (
    <Tooltip position='right' content={STATUS_TOOLTIPS[status] || ''}>
      <span
        className={`checklistIndicator checklist${status || 'Load'}`}
        style={{ position: 'relative' }}
        tabIndex={0}
      >
        <img
          src={iconSrc}
          alt={status || 'LOAD'}
          className={`checklistIndicator checklist${status || 'Load'}`}
          style={{ width: 18, height: 18, marginRight: 6 }}
        />
      </span>
    </Tooltip>
  );
};

export default StatusIndicator;
