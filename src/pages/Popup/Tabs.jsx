import React from 'react';
import './Tabs.css';
import StatusIndicator from './StatusIndicator';

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="tabs-container">
      <div className="tabs-header">
        {tabs.map((tab, idx) => (
          <button
            key={tab.label}
            className={`tab-btn${activeTab === idx ? ' active' : ''}`}
            onClick={() => setActiveTab(idx)}
          >
            {/* Show indicator only for SUCCESS, FAIL, MAYBE */}
            {['SUCCESS', 'FAIL', 'MAYBE','IGNORE'].includes(tab.status) && (
              <StatusIndicator status={tab.status} />
            )}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tabs-content">
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

export default Tabs;
