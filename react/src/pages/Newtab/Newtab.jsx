import React from 'react';
import logo from '../../assets/img/constructor.png';
import './Newtab.css';
import './Newtab.scss';

const Newtab = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
        Data Attributes Validator - Constructor
        </p>
        <a
          className="App-link"
          href="https://docs.constructor.com/docs/integrating-with-constructor-behavioral-tracking-direct-to-api-tracking"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://docs.constructor.com/docs/integrating-with-constructor-behavioral-tracking-direct-to-api-tracking
        </a>
      </header>
    </div>
  );
};

export default Newtab;
