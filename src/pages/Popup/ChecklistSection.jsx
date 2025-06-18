import React from 'react';
import ChecklistItem from './ChecklistItem';

const ChecklistSection = ({ section, onHighlight, onLogElement }) => (
  <ul id={`${section.id}List`} className="checklistContainer">
    {section.items.map(item => (
      <ChecklistItem
        key={item.id}
        sectionId={section.id}
        item={item}
        onHighlight={onHighlight}
        onLogElement={onLogElement}
      />
    ))}
  </ul>
);

export default ChecklistSection;
