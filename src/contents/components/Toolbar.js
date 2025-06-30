import React from 'react';

const Toolbar = ({ onConnect, onExecute, onFormat, onClear, isExecuting, isConnected }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
    <button
      onClick={onConnect}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 20px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '500',
        fontSize: '14px',
        transition: 'all 0.3s ease',
        backgroundColor: '#667eea',
        color: 'white'
      }}
    >
      🔗 Connect Database
    </button>
    
    <button
      onClick={onExecute}
      disabled={isExecuting || !isConnected}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 20px',
        border: 'none',
        borderRadius: '8px',
        cursor: isExecuting || !isConnected ? 'not-allowed' : 'pointer',
        fontWeight: '500',
        fontSize: '14px',
        transition: 'all 0.3s ease',
        backgroundColor: isExecuting || !isConnected ? '#6c757d' : '#28a745',
        color: 'white',
        opacity: isExecuting || !isConnected ? 0.6 : 1
      }}
    >
      {isExecuting ? '⏳' : '▶️'} Execute Query
    </button>

    <button
      onClick={onFormat}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 20px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '500',
        fontSize: '14px',
        transition: 'all 0.3s ease',
        backgroundColor: '#6f42c1',
        color: 'white'
      }}
    >
      🎨 Format SQL
    </button>

    <button
      onClick={onClear}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 20px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '500',
        fontSize: '14px',
        transition: 'all 0.3s ease',
        backgroundColor: '#dc3545',
        color: 'white'
      }}
    >
      🗑️ Clear
    </button>
  </div>
);

export default Toolbar;
