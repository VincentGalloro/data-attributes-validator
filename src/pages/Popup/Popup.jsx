import React, { useEffect, useState } from 'react';
import './Popup.css';
import Tabs from './components/Tabs';
import ChecklistSection from './components/ChecklistSection';
import { generateInitialChecklist, processResponseData } from './utils';
import SettingsTab from './tabs/SettingsTab';
import SettingsIcon from './components/SettingsIcon';

const Popup = () => {
  const [checklist, setChecklist] = useState(generateInitialChecklist());
  const [activeTab, setActiveTab] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

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

  const handleLogElement = (sectionId, itemId) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'logElement',
        sectionId,
        itemId
      });
    });
  };

  const handleItemClick = (sectionId, itemId) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'scrollToElement',
        sectionId,
        itemId
      });
    });
  };

  const checklistTabs = checklist.map(section => ({
    label: section.headerText || section.name,
    content: (
      <ChecklistSection section={section} onHighlight={handleHighlight} onLogElement={handleLogElement} onItemClick={handleItemClick} checklist={checklist} />
    ),
    status: section.status // Pass status for tab indicator
  }));

  // Remove Settings from the visible tabs
  const tabs = checklistTabs;

  return (
    <div className="popup-dark-theme" style={{ position: 'relative' }}>
      <h2 className="popup-heading" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Analyzing Page
        <SettingsIcon onClick={() => setShowSettings(s => !s)} isActive={showSettings} />
      </h2>
      {showSettings ? (
        <SettingsTab />
      ) : (
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
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
