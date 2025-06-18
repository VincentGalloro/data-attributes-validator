import React from 'react';
import ChecklistItem from './ChecklistItem';
import NoOfItemsExistsInTheCatalogue from '../customComponents/NoOfItemsExistsInTheCatalogue';

const customComponents = {
  NoOfItemsExistsInTheCatalogue,
};

const ChecklistSection = ({ section, onHighlight, onLogElement, checklist }) => (
  <ul id={`${section.id}List`} className="checklistContainer">
    {section.items.map(item => {
      if (item.customComponent && customComponents[item.customComponent]) {
        const CustomComp = customComponents[item.customComponent];
        return (
          <li key={item.id}>
            <CustomComp checklist={checklist} onHighlight={onHighlight} onLogElement={onLogElement} />
          </li>
        );
      }
      return (
        <ChecklistItem
          key={item.id}
          sectionId={section.id}
          item={item}
          onHighlight={onHighlight}
          onLogElement={onLogElement}
        />
      );
    })}
  </ul>
);

export default ChecklistSection;
