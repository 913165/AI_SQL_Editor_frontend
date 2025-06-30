import React from 'react';

const Header = ({ aiEnabled, setAiEnabled, onAIConfig, isAIConfigured }) => (
    <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '15px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        padding: '24px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
                backgroundColor: '#667eea',
                color: 'white',
                fontSize: '24px',
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                🗄️
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea', margin: 0 }}>
                Real SQL Editor
            </h1>
            <span style={{
                padding: '6px 12px',
                background: '#d4edda',
                color: '#155724',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500'
            }}>
        Production Ready
      </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* AI Configuration Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: isAIConfigured ? '#28a745' : '#dc3545'
                }}></div>
                <span style={{
                    fontSize: '12px',
                    color: isAIConfigured ? '#28a745' : '#dc3545',
                    fontWeight: '500'
                }}>
          AI {isAIConfigured ? 'Ready' : 'Not Configured'}
        </span>
            </div>

            {/* AI Settings Button */}
            <button
                onClick={onAIConfig}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    backgroundColor: isAIConfigured ? '#667eea' : '#ffc107',
                    color: isAIConfigured ? 'white' : '#212529',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                    e.target.style.backgroundColor = isAIConfigured ? '#5a6fd8' : '#e0a800';
                }}
                onMouseLeave={(e) => {
                    e.target.style.backgroundColor = isAIConfigured ? '#667eea' : '#ffc107';
                }}
            >
                ⚙️ AI Settings
            </button>

            {/* AI Assistant Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '14px', color: '#666' }}>AI Assistant</span>
                <button
                    onClick={() => setAiEnabled(!aiEnabled)}
                    disabled={!isAIConfigured}
                    style={{
                        position: 'relative',
                        width: '50px',
                        height: '25px',
                        backgroundColor: aiEnabled && isAIConfigured ? '#667eea' : '#ccc',
                        borderRadius: '25px',
                        cursor: isAIConfigured ? 'pointer' : 'not-allowed',
                        transition: 'all 0.3s ease',
                        border: 'none',
                        opacity: isAIConfigured ? 1 : 0.6
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        width: '21px',
                        height: '21px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        top: '2px',
                        left: aiEnabled && isAIConfigured ? '27px' : '2px',
                        transition: 'all 0.3s ease'
                    }}></div>
                </button>
            </div>
        </div>
    </div>
);

export default Header;