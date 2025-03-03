import React from 'react';

const Popup = () => {
  return (
    <div style={{ padding: '16px' }}>
      <h1>React Chrome Extension</h1>
      <button onClick={() => alert('Hello from the popup!')}>Click Me</button>
    </div>
  );
};

export default Popup;
