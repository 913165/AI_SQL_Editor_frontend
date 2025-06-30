import React, { useState } from 'react';

const AIConfigModal = ({
                           isOpen,
                           onClose,
                           onSave,
                           currentConfig
                       }) => {
    const [config, setConfig] = useState({
        provider: 'openai',
        apiKey: '',
        model: 'gpt-4',
        temperature: 0.3,
        maxTokens: 500,
        enabled: false,
        ...currentConfig
    });

    const [testStatus, setTestStatus] = useState({
        status: 'idle', // idle, testing, success, error
        message: '',
        isLoading: false
    });

    if (!isOpen) return null;

    const handleTestConnection = async () => {
        if (!config.apiKey.trim()) {
            setTestStatus({
                status: 'error',
                message: 'Please enter your API key',
                isLoading: false
            });
            return;
        }

        setTestStatus({
            status: 'testing',
            message: 'Testing AI connection...',
            isLoading: true
        });

        try {
            // Test the AI connection
            const response = await fetch('https://api.openai.com/v1/models', {
                headers: {
                    'Authorization': `Bearer ${config.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setTestStatus({
                    status: 'success',
                    message: '✅ Connection successful! AI assistant is ready.',
                    isLoading: false
                });
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'API connection failed');
            }
        } catch (error) {
            setTestStatus({
                status: 'error',
                message: `❌ Connection failed: ${error.message}`,
                isLoading: false
            });
        }
    };

    const handleSave = () => {
        if (testStatus.status !== 'success') {
            alert('Please test the connection successfully first');
            return;
        }

        onSave(config);
        onClose();
    };

    const modelOptions = {
        openai: [
            { value: 'gpt-4', label: 'GPT-4 (Recommended)', description: 'Most capable model' },
            { value: 'gpt-4-turbo', label: 'GPT-4 Turbo', description: 'Faster and cheaper' },
            { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', description: 'Fast and cost-effective' }
        ],
        claude: [
            { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet', description: 'Balanced performance' },
            { value: 'claude-3-opus', label: 'Claude 3 Opus', description: 'Most capable' }
        ]
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
                overflow: 'auto',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '24px',
                    paddingBottom: '16px',
                    borderBottom: '2px solid #f0f0f0'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            backgroundColor: '#667eea',
                            color: 'white',
                            fontSize: '20px',
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            🤖
                        </div>
                        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#333', margin: 0 }}>
                            AI Assistant Configuration
                        </h3>
                    </div>
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* AI Provider Selection */}
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#333',
                            marginBottom: '8px'
                        }}>
                            AI Provider
                        </label>
                        <select
                            value={config.provider}
                            onChange={(e) => setConfig({
                                ...config,
                                provider: e.target.value,
                                model: e.target.value === 'openai' ? 'gpt-4' : 'claude-3-sonnet'
                            })}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '2px solid #e9ecef',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}
                        >
                            <option value="openai">OpenAI (GPT-4, GPT-3.5)</option>
                            <option value="claude">Anthropic Claude</option>
                            <option value="custom">Custom API Endpoint</option>
                        </select>
                    </div>

                    {/* API Key */}
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#333',
                            marginBottom: '8px'
                        }}>
                            API Key *
                        </label>
                        <input
                            type="password"
                            value={config.apiKey}
                            onChange={(e) => setConfig({...config, apiKey: e.target.value})}
                            placeholder="sk-..."
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '2px solid #e9ecef',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontFamily: 'monospace'
                            }}
                        />
                        <div style={{
                            fontSize: '12px',
                            color: '#666',
                            marginTop: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            🔒 Your API key is stored locally and never sent to our servers
                        </div>
                    </div>

                    {/* Model Selection */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#333',
                                marginBottom: '8px'
                            }}>
                                Model
                            </label>
                            <select
                                value={config.model}
                                onChange={(e) => setConfig({...config, model: e.target.value})}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '2px solid #e9ecef',
                                    borderRadius: '8px',
                                    fontSize: '14px'
                                }}
                            >
                                {modelOptions[config.provider]?.map(model => (
                                    <option key={model.value} value={model.value}>
                                        {model.label}
                                    </option>
                                ))}
                            </select>
                            <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                                {modelOptions[config.provider]?.find(m => m.value === config.model)?.description}
                            </div>
                        </div>

                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#333',
                                marginBottom: '8px'
                            }}>
                                Temperature
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={config.temperature}
                                onChange={(e) => setConfig({...config, temperature: parseFloat(e.target.value)})}
                                style={{ width: '100%', marginBottom: '4px' }}
                            />
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '11px',
                                color: '#666'
                            }}>
                                <span>Precise</span>
                                <span>{config.temperature}</span>
                                <span>Creative</span>
                            </div>
                        </div>
                    </div>

                    {/* Advanced Settings */}
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#333',
                            marginBottom: '8px'
                        }}>
                            Max Tokens
                        </label>
                        <input
                            type="number"
                            min="50"
                            max="2000"
                            value={config.maxTokens}
                            onChange={(e) => setConfig({...config, maxTokens: parseInt(e.target.value)})}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '2px solid #e9ecef',
                                borderRadius: '8px',
                                fontSize: '14px'
                            }}
                        />
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                            Maximum length of AI responses (50-2000 tokens)
                        </div>
                    </div>

                    {/* Test Status */}
                    <div style={{
                        padding: '16px',
                        borderRadius: '8px',
                        ...(testStatus.status === 'success' ? {
                            backgroundColor: '#d4edda',
                            border: '2px solid #c3e6cb',
                            color: '#155724'
                        } : testStatus.status === 'error' ? {
                            backgroundColor: '#f8d7da',
                            border: '2px solid #f5c6cb',
                            color: '#721c24'
                        } : testStatus.status === 'testing' ? {
                            backgroundColor: '#fff3cd',
                            border: '2px solid #ffeaa7',
                            color: '#856404'
                        } : {
                            backgroundColor: '#f8f9fa',
                            border: '2px solid #dee2e6',
                            color: '#6c757d'
                        })
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {testStatus.isLoading && (
                                <div style={{
                                    width: '16px',
                                    height: '16px',
                                    border: '2px solid #ccc',
                                    borderTop: '2px solid #333',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}></div>
                            )}
                            <span style={{ fontSize: '14px', fontWeight: '500' }}>
                {testStatus.message || 'Ready to test AI connection'}
              </span>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div style={{
                        padding: '16px',
                        backgroundColor: '#e3f2fd',
                        border: '1px solid #bbdefb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        color: '#1565c0'
                    }}>
                        <div style={{ fontWeight: '600', marginBottom: '8px' }}>💡 Getting Your API Key:</div>
                        <div style={{ marginBottom: '4px' }}>
                            <strong>OpenAI:</strong> Visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" style={{ color: '#1565c0' }}>platform.openai.com/api-keys</a>
                        </div>
                        <div>
                            <strong>Claude:</strong> Visit <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#1565c0' }}>console.anthropic.com</a>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '12px',
                    marginTop: '32px',
                    paddingTop: '16px',
                    borderTop: '1px solid #e9ecef'
                }}>
                    <button
                        onClick={handleTestConnection}
                        disabled={testStatus.isLoading || !config.apiKey.trim()}
                        style={{
                            padding: '12px 20px',
                            backgroundColor: testStatus.isLoading || !config.apiKey.trim() ? '#6c757d' : '#667eea',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: testStatus.isLoading || !config.apiKey.trim() ? 'not-allowed' : 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        {testStatus.isLoading ? '⏳' : '🧪'} Test Connection
                    </button>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '12px 20px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={testStatus.status !== 'success'}
                        style={{
                            padding: '12px 20px',
                            backgroundColor: testStatus.status !== 'success' ? '#6c757d' : '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: testStatus.status !== 'success' ? 'not-allowed' : 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            opacity: testStatus.status !== 'success' ? 0.6 : 1
                        }}
                    >
                        Save & Enable AI
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

export default AIConfigModal;