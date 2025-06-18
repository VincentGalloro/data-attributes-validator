import React, { useState } from 'react';
import './Accordion.css';

const Accordion = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="accordion">
      <div
        className="accordion-header"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <span className="accordion-arrow">{open ? '▾' : '▸'}</span>
      </div>
      {open && (
        <div className="accordion-content">
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;
