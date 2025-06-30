import React from 'react';

const AIAssistant = ({
                         aiInput,
                         setAiInput,
                         onGenerateSQL,
                         schemas,
                         queryHistory,
                         onSelectQuery,
                         isAIConfigured,
                         onAIConfig,
                         aiConfig
                     }) => (
    <div style={{
        width: '400px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '15px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    }}>
        {/* Header with AI Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#667eea',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                🤖 AI Assistant
            </h3>

            {/* AI Status Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: isAIConfigured ? '#28a745' : '#dc3545'
                }}></div>
                <span style={{
                    fontSize: '11px',
                    color: isAIConfigured ? '#28a745' : '#dc3545',
                    fontWeight: '500'
                }}>
          {isAIConfigured ? 'Ready' : 'Not Configured'}
        </span>
            </div>
        </div>

        {/* AI Configuration Info */}
        {isAIConfigured && aiConfig && (
            <div style={{
                padding: '12px',
                backgroundColor: '#e8f5e8',
                border: '1px solid #c3e6cb',
                borderRadius: '8px',
                fontSize: '12px'
            }}>
                <div style={{ fontWeight: '600', color: '#155724', marginBottom: '4px' }}>
                    ✅ AI Configured
                </div>
                <div style={{ color: '#155724' }}>
                    Provider: {aiConfig.provider} | Model: {aiConfig.model}
                </div>
            </div>
        )}

        {/* Configuration Required Message */}
        {!isAIConfigured && (
            <div style={{
                padding: '16px',
                backgroundColor: '#fff3cd',
                border: '1px solid #ffeaa7',
                borderRadius: '8px',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#856404', marginBottom: '8px' }}>
                    🔧 AI Setup Required
                </div>
                <div style={{ fontSize: '12px', color: '#856404', marginBottom: '12px' }}>
                    Configure your AI provider to generate SQL queries
                </div>
                <button
                    onClick={onAIConfig}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#ffc107',
                        color: '#212529',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#e0a800'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#ffc107'}
                >
                    Configure AI Settings
                </button>
            </div>
        )}

        {/* SQL Generation Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>
                Describe your query:
            </label>
            <textarea
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder={isAIConfigured ? "e.g., Find all active users with their order counts" : "Configure AI first to generate SQL"}
                disabled={!isAIConfigured}
                style={{
                    padding: '12px',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.3s ease',
                    height: '80px',
                    resize: 'vertical',
                    backgroundColor: isAIConfigured ? 'white' : '#f8f9fa',
                    color: isAIConfigured ? '#333' : '#6c757d',
                    cursor: isAIConfigured ? 'text' : 'not-allowed'
                }}
            />
            <button
                onClick={onGenerateSQL}
                disabled={!isAIConfigured || !aiInput.trim()}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: (!isAIConfigured || !aiInput.trim()) ? 'not-allowed' : 'pointer',
                    fontWeight: '500',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    backgroundColor: (!isAIConfigured || !aiInput.trim()) ? '#6c757d' : '#667eea',
                    color: 'white',
                    opacity: (!isAIConfigured || !aiInput.trim()) ? 0.6 : 1
                }}
            >
                {isAIConfigured ? '✨ Generate SQL' : '🔧 Configure AI First'}
            </button>
        </div>

        {/* Database Schema */}
        <div>
            <h4 style={{ fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '8px' }}>
                Database Schema
            </h4>
            <div style={{
                maxHeight: '250px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
            }}>
                {schemas.length > 0 ? (
                    schemas.map((table, index) => (
                        <div key={index} style={{
                            padding: '12px',
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #e9ecef',
                            borderRadius: '6px'
                        }}>
                            <div style={{
                                fontWeight: '500',
                                color: '#667eea',
                                marginBottom: '4px'
                            }}>
                                {table.tableName}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6c757d' }}>
                                {table.columns}
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ color: '#999', fontSize: '14px' }}>
                        Connect to database to see schema
                    </p>
                )}
            </div>
        </div>

        {/* Query History */}
        <div>
            <h4 style={{ fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '8px' }}>
                Recent Queries
            </h4>
            <div style={{
                maxHeight: '200px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
            }}>
                {queryHistory.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => onSelectQuery(item.fullQuery || item.query)}
                        style={{
                            padding: '8px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            transition: 'background-color 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#e9ecef'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                    >
                        <div style={{
                            fontFamily: 'monospace',
                            color: '#333',
                            marginBottom: '2px'
                        }}>
                            {item.query}
                        </div>
                        <div style={{ color: '#999' }}>{item.timestamp}</div>
                    </div>
                ))}
                {queryHistory.length === 0 && (
                    <p style={{ color: '#999', fontSize: '12px', textAlign: 'center', padding: '20px' }}>
                        No recent queries
                    </p>
                )}
            </div>
        </div>

        {/* Quick Settings Access */}
        {isAIConfigured && (
            <div style={{ borderTop: '1px solid #e9ecef', paddingTop: '16px' }}>
                <button
                    onClick={onAIConfig}
                    style={{
                        width: '100%',
                        padding: '8px 12px',
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #dee2e6',
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: '#6c757d',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#e9ecef';
                        e.target.style.color = '#495057';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#f8f9fa';
                        e.target.style.color = '#6c757d';
                    }}
                >
                    ⚙️ Modify AI Settings
                </button>
            </div>
        )}
    </div>
);

export default AIAssistant;