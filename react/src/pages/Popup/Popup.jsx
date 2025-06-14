import React, { useEffect, useState } from 'react';
import './Popup.css';
import { 
  generateInitialChecklist, 
  processResponseData, 
  STATUS_CHARS 
} from './utils';

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
              console.log('response',response)
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
  console.log('checklist',checklist)
  return (
    <div className="main">
      <div>
        <ul className="checklistContainer">
          {checklist.map(section => (
            <React.Fragment key={section.id}>
              <li
                id={section.id}
                className={section.status ? `checklist${section.status}` : ''}
              >
                {section.headerText || section.name}
              </li>
              <ul id={`${section.id}List`} className="checklistContainer">
                {section.items.map(item => (
                  <li
                    key={item.id}
                    id={item.id}
                    className={item.status ? `checklist${item.status}` : ''}
                  >
                    <span className={`checklistIndicator checklist${item.status || 'Load'}`}>{STATUS_CHARS[item.status] || STATUS_CHARS['LOAD']}</span>
                    {item.text || ` ${item.name}`}
                  </li>
                ))}
              </ul>
            </React.Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Popup;
