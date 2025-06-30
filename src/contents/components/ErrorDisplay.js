import React from 'react';

const ErrorDisplay = ({ error }) => {
  if (!error) return null;
  
  return (
    <div style={{
      padding: '16px',
      backgroundColor: '#f8d7da',
      border: '1px solid #f5c6cb',
      borderRadius: '8px',
      color: '#721c24',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px'
    }}>
      <span style={{ fontSize: '18px' }}>⚠️</span>
      <div>
        <strong>Error:</strong>
        <div style={{ marginTop: '4px' }}>{error}</div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
