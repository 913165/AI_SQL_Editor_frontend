import React from 'react';

const SQLEditor = ({ query, setQuery }) => (
  <textarea
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    placeholder="-- Enter your SQL query here&#10;-- Example: SELECT * FROM users WHERE active = 1;"
    style={{
      width: '100%',
      height: '250px',
      padding: '16px',
      backgroundColor: '#1e1e1e',
      color: '#00ff00',
      fontFamily: 'Courier New, monospace',
      fontSize: '14px',
      borderRadius: '8px',
      border: '2px solid #e9ecef',
      resize: 'vertical',
      outline: 'none'
    }}
  />
);

export default SQLEditor;
