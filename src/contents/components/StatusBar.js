import React from 'react';

const StatusBar = ({ status, query }) => (
  <div style={{
    padding: '12px 16px',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
    color: '#6c757d',
    borderRadius: '8px'
  }}>
    <span>{status}</span>
    <span>
      Lines: {query.split('\n').length} | Characters: {query.length}
    </span>
  </div>
);

export default StatusBar;
