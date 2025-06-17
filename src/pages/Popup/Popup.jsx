import React, { useEffect, useState } from 'react';
import './Popup.css';
import Tabs from './Tabs';
import ChecklistSection from './ChecklistSection';
import { generateInitialChecklist, processResponseData } from './utils';

const Popup = () => {
  const [checklist, setChecklist] = useState(generateInitialChecklist());

  useEffect(() => {
    function pingAttributes(retry) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { type: "dataAttributesRunCheck" },
          function (response) {
            try {
              if (response === undefined) throw Error('Did not receive response');
              setChecklist(processResponseData(response));
            } catch (e) {
              if (retry > 0) {
                setTimeout(() => pingAttributes(retry - 1), 750);
              }
            }
          }
        );
      });
    }
    pingAttributes(15);
  }, []);

  const handleHighlight = (sectionId, itemId, action) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: action === 'highlight' ? 'highlightElement' : 'unhighlightElement',
        sectionId,
        itemId
      });
    });
  };

  const tabs = checklist.map(section => ({
    label: section.headerText || section.name,
    content: (
      <ChecklistSection section={section} onHighlight={handleHighlight} />
    ),
    status: section.status // Pass status for tab indicator
  }));

  return (
    <div className="popup-dark-theme" style={{ position: 'relative' }}>
      <h2 className="popup-heading">Analyzing Page</h2>
      <Tabs tabs={tabs} />
      <a
        href="https://docs.constructor.com/docs/integrating-with-constructor-behavioral-tracking-data-driven-event-tracking"
        target="_blank"
        rel="noopener noreferrer"
        className="logo-fixed-bottom-right"
      >
        <img
          src="https://constructor.com/hubfs/Website%20-%202024/Logos/Logo-white.svg"
          alt="Constructor Logo"
          style={{ width: 80, height: 'auto', opacity: 0.85 }}
        />
      </a>
    </div>
  );
};

export default Popup;
