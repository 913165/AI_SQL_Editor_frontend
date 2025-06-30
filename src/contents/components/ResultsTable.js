import React from 'react';

const ResultsTable = ({ results, onExportCSV, onExportJSON }) => {
  if (!results) return null;

  return (
    <div style={{
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: 'white'
    }}>
      <div style={{
        padding: '12px 16px',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontWeight: '500'
      }}>
        <span>Query Results ({results.rowCount} rows)</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={onExportCSV} 
            style={{
              padding: '6px 12px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Export CSV
          </button>
          <button 
            onClick={onExportJSON} 
            style={{
              padding: '6px 12px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Export JSON
          </button>
        </div>
      </div>
      
      {results.type === 'select' && results.data && results.data.length > 0 ? (
        <div style={{ overflow: 'auto', maxHeight: '400px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr>
                {Object.keys(results.data[0]).map((column) => (
                  <th key={column} style={{
                    padding: '12px',
                    textAlign: 'left',
                    fontWeight: '600',
                    backgroundColor: '#f8f9fa',
                    color: '#495057',
                    borderBottom: '2px solid #dee2e6',
                    position: 'sticky',
                    top: 0
                  }}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.data.map((row, index) => (
                <tr key={index} style={{
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa'
                }}>
                  {Object.values(row).map((value, colIndex) => (
                    <td key={colIndex} style={{
                      padding: '10px 12px',
                      borderBottom: '1px solid #dee2e6',
                      color: '#333'
                    }}>
                      {value === null ? (
                        <span style={{ color: '#999', fontStyle: 'italic' }}>NULL</span>
                      ) : typeof value === 'boolean' ? (
                        <span style={{ color: value ? '#28a745' : '#dc3545' }}>
                          {value.toString()}
                        </span>
                      ) : (
                        value.toString()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : results.type === 'select' ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#6c757d' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>📊</div>
          <p>Query executed successfully but returned no rows</p>
        </div>
      ) : (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#28a745' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
          <p style={{ fontWeight: '500' }}>{results.message}</p>
        </div>
      )}
      
      <div style={{
        padding: '12px 16px',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '14px',
        color: '#6c757d'
      }}>
        <span style={{ color: '#28a745' }}>✓ Executed in {results.executionTime}</span>
      </div>
    </div>
  );
};

export default ResultsTable;
