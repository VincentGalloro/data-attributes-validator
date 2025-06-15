import React from 'react';
import StatusIndicator from './StatusIndicator';

const ChecklistItem = ({ sectionId, item, onHighlight }) => (
  <li
    key={item.id}
    id={item.id}
    className={item.status ? `checklist${item.status}` : ''}
    style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
    onMouseEnter={() => onHighlight(sectionId, item.id, 'highlight')}
    onMouseLeave={() => onHighlight(sectionId, item.id, 'unhighlight')}
  >
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <StatusIndicator status={item.status} />
      {item.text || ` ${item.name}`}
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

export default ChecklistItem;
