import React, { useEffect, useState } from 'react';
import './Popup.css';
import Tabs from './Tabs';
import { 
  generateInitialChecklist, 
  processResponseData 
} from './utils';

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
  const [show, setShow] = useState(false);
  const iconSrc = STATUS_ICONS[status] || STATUS_ICONS['LOAD'];
  return (
    <span
      className={`checklistIndicator checklist${status || 'Load'}`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      style={{ position: 'relative' }}
    >
      <img
        src={iconSrc}
        alt={status || 'LOAD'}
        className={`checklistIndicator checklist${status || 'Load'}`}
        style={{ width: 18, height: 18, marginRight: 6 }}
      />
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
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <StatusIndicator status={item.status} />
              {item.text || ` ${item.name}`}
            </div>
            {/* Generic sub-child rendering for any item.subList */}
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
        ))}
      </ul>
    )
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
