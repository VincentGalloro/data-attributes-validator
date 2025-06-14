import React, { useEffect, useState } from 'react';
import './Popup.css';
import Tabs from './Tabs';
import { 
  generateInitialChecklist, 
  processResponseData, 
  STATUS_CHARS 
} from './utils';

const STATUS_TOOLTIPS = {
  SUCCESS: 'All required data found and valid',
  FAIL: 'Required data missing or invalid',
  MAYBE: 'Some optional data missing or uncertain',
  IGNORE: 'Not applicable or not checked',
  LOAD: 'Still loading or checking'
};

const StatusIndicator = ({ status, children }) => {
  const [show, setShow] = useState(false);
  return (
    <span
      className={`checklistIndicator checklist${status || 'Load'}`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      style={{ position: 'relative' }}
    >
      {children}
      {show && (
        <span className="custom-tooltip">
          {STATUS_TOOLTIPS[status] || ''}
        </span>
      )}
    </span>
  );
};

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

  // Prepare tabs for each checklist section
  const tabs = checklist.map(section => ({
    label: section.headerText || section.name,
    content: (
      <ul id={`${section.id}List`} className="checklistContainer">
        {section.items.map(item => (
          <li
            key={item.id}
            id={item.id}
            className={item.status ? `checklist${item.status}` : ''}
          >
            <StatusIndicator status={item.status}>
              {STATUS_CHARS[item.status] || STATUS_CHARS['LOAD']}
            </StatusIndicator>
            {item.text || ` ${item.name}`}
          </li>
        ))}
      </ul>
    )
  }));

  return (
    <div className="main">
      <Tabs tabs={tabs} />
    </div>
  );
};

export default Popup;
