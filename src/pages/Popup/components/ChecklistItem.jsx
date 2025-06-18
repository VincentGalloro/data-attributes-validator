import React from 'react';
import StatusIndicator from './StatusIndicator';
import ConsoleIcon from './ConsoleIcon';

const ChecklistItem = ({ sectionId, item, onHighlight, onLogElement }) => {
  // Enable highlight and console icon only if status is 'success'
  const enableActions = item.status === 'SUCCESS';

  return (
    <li
      key={item.id}
      id={item.id}
      className={item.status ? `checklist${item.status}` : ''}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
      onMouseEnter={enableActions ? () => onHighlight(sectionId, item.id, 'highlight') : undefined}
      onMouseLeave={enableActions ? () => onHighlight(sectionId, item.id, 'unhighlight') : undefined}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <StatusIndicator status={item.status} />
          {item.text || ` ${item.name}`}
        </span>
        {enableActions && (
          <span style={{ marginLeft: 'auto' }}>
            <ConsoleIcon onClick={e => { e.stopPropagation(); onLogElement(sectionId, item.id); }} />
          </span>
        )}
      </div>
      {Array.isArray(item.subList) && item.subList.length > 0 && (
        <ol className="checklistContainer small" >
          {item.subList.map((sub, idx) => (
            <li key={idx} className="checklistSuccess">
              {sub}
            </li>
          ))}
        </ol>
      )}
    </li>
  );
};

export default ChecklistItem;
