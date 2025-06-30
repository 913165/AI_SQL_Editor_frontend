// ConnectionModal.js
import React from 'react';

const ConnectionModal = ({
                             isOpen,
                             onClose,
                             connectionForm,
                             setConnectionForm,
                             connectionStatus,
                             onTestConnection,
                             onSaveConnection,
                             API_BASE
                         }) => {
    if (!isOpen) return null;

    const handleConnectionTypeChange = (type) => {
        const defaultPorts = {
            mysql: '3306',
            postgresql: '5432',
            oracle: '1521',
            sqlserver: '1433'
        };

        setConnectionForm(prev => ({
            ...prev,
            type,
            port: defaultPorts[type] || '3306'
        }));
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                padding: '24px',
                width: '90%',
                maxWidth: '600px',
                maxHeight: '80vh',
                overflow: 'auto'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                }}>
                    <h3 style={{fontSize: '20px', fontWeight: '600', color: '#333', margin: 0}}>
                        Database Connection
                    </h3>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            color: '#999',
                            padding: '0',
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        ×
                    </button>
                </div>

                <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#333',
                            marginBottom: '4px'
                        }}>
                            Connection Name
                        </label>
                        <input
                            type="text"
                            value={connectionForm.name}
                            onChange={(e) => setConnectionForm({...connectionForm, name: e.target.value})}
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}
                        />
                    </div>

                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#333',
                                marginBottom: '4px'
                            }}>
                                Database Type
                            </label>
                            <select
                                value={connectionForm.type}
                                onChange={(e) => handleConnectionTypeChange(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                }}
                            >
                                <option value="mysql">MySQL</option>
                                <option value="postgresql">PostgreSQL</option>
                                <option value="oracle">Oracle</option>
                                <option value="sqlserver">SQL Server</option>
                            </select>
                        </div>
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#333',
                                marginBottom: '4px'
                            }}>
                                Port
                            </label>
                            <input
                                type="text"
                                value={connectionForm.port}
                                onChange={(e) => setConnectionForm({...connectionForm, port: e.target.value})}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#333',
                            marginBottom: '4px'
                        }}>
                            Host
                        </label>
                        <input
                            type="text"
                            value={connectionForm.host}
                            onChange={(e) => setConnectionForm({...connectionForm, host: e.target.value})}
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}
                        />
                    </div>

                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#333',
                                marginBottom: '4px'
                            }}>
                                Username
                            </label>
                            <input
                                type="text"
                                value={connectionForm.username}
                                onChange={(e) => setConnectionForm({...connectionForm, username: e.target.value})}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#333',
                                marginBottom: '4px'
                            }}>
                                Password
                            </label>
                            <input
                                type="password"
                                value={connectionForm.password}
                                onChange={(e) => setConnectionForm({...connectionForm, password: e.target.value})}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#333',
                            marginBottom: '4px'
                        }}>
                            Database Name (optional)
                        </label>
                        <input
                            type="text"
                            value={connectionForm.database}
                            onChange={(e) => setConnectionForm({...connectionForm, database: e.target.value})}
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}
                        />
                    </div>

                    {/* Connection Status */}
                    <div style={{
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        ...(connectionStatus.status === 'connected' ? {
                            backgroundColor: '#d4edda',
                            border: '1px solid #c3e6cb',
                            color: '#155724'
                        } : connectionStatus.status === 'error' ? {
                            backgroundColor: '#f8d7da',
                            border: '1px solid #f5c6cb',
                            color: '#721c24'
                        } : connectionStatus.status === 'testing' ? {
                            backgroundColor: '#fff3cd',
                            border: '1px solid #ffeaa7',
                            color: '#856404'
                        } : {
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #dee2e6',
                            color: '#6c757d'
                        })
                    }}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                            {connectionStatus.isLoading && (
                                <div style={{
                                    width: '16px',
                                    height: '16px',
                                    border: '2px solid #ccc',
                                    borderTop: '2px solid #333',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}></div>
                            )}
                            <span style={{fontSize: '14px', fontWeight: '500'}}>
                {connectionStatus.message}
              </span>
                        </div>
                    </div>

                    {/* API Setup Notice */}
                    <div style={{
                        padding: '12px',
                        backgroundColor: '#cce7ff',
                        border: '1px solid #99d6ff',
                        borderRadius: '6px',
                        fontSize: '14px',
                        color: '#004085'
                    }}>
                        <strong>Backend API Required:</strong> This editor connects to real databases via API endpoints
                        at {API_BASE}
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '12px',
                    marginTop: '24px'
                }}>
                    <button
                        onClick={onTestConnection}
                        disabled={connectionStatus.isLoading}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: connectionStatus.isLoading ? '#6c757d' : '#667eea',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: connectionStatus.isLoading ? 'not-allowed' : 'pointer',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}
                    >
                        {connectionStatus.isLoading ? 'Testing...' : 'Test Connection'}
                    </button>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSaveConnection}
                        disabled={connectionStatus.status !== 'connected'}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: connectionStatus.status !== 'connected' ? '#6c757d' : '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: connectionStatus.status !== 'connected' ? 'not-allowed' : 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            opacity: connectionStatus.status !== 'connected' ? 0.6 : 1
                        }}
                    >
                        Save & Connect
                    </button>
                </div>
            </div>

            <style>
                {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
            </style>
        </div>
    );
};

export default ConnectionModal;