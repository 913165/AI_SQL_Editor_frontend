// App.js - Main Application File with Database Explorer
import React, { useState } from 'react';
import Header from './contents/components/Header';
import Toolbar from './contents/components/Toolbar';
import SQLEditor from './contents/components/SQLEditor';
import ErrorDisplay from './contents/components/ErrorDisplay';
import ResultsTable from './contents/components/ResultsTable';
import StatusBar from './contents/components/StatusBar';
import AIAssistant from './contents/components/AIAssistant';
import ConnectionModal from './contents/components/ConnectionModal';
import AIConfigModal from './contents/components/AIConfigModal';
import DatabaseExplorer from './contents/components/DatabaseExplorer';
import { useDatabase } from './contents/hooks/useDatabase';
import { useQueryHistory } from './contents/hooks/useQueryHistory';
import { useAIConfig } from './contents/hooks/useAIConfig';
import { formatSQL } from './contents/utils/sqlFormatter';
import { exportToCSV } from './contents/utils/exportToCSV';
import { exportToJSON } from './contents/utils/exportToJSON';
import { generateSQLWithAI } from './contents/utils/generateSQLWithAI';
import IntelliSenseSQLEditor from './contents/components/IntelliSenseSQLEditor';
import SyntaxHighlightedSQLEditor from './contents/components/SyntaxHighlightedSQLEditor';


const App = () => {
  // UI State
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [connectionModal, setConnectionModal] = useState(false);
  const [aiConfigModal, setAiConfigModal] = useState(false);
  const [status, setStatus] = useState('Ready - No database connected');
  const [error, setError] = useState(null);
  const [isRefreshingSchema, setIsRefreshingSchema] = useState(false);

  // Connection Form State
  const [connectionForm, setConnectionForm] = useState({
    name: 'Local Database',
    type: 'mysql',
    host: 'localhost',
    port: '3306',
    username: '',
    password: '',
    database: ''
  });

  // Custom Hooks
  const API_BASE = 'http://localhost:3001';
  const {
    connection,
    schemas,
    connectionStatus,
    testConnection,
    executeQuery,
    saveConnection,
    refreshSchemas
  } = useDatabase(API_BASE);

  const { queryHistory, addToHistory } = useQueryHistory();

  // AI Configuration Hook
  const {
    config: aiConfig,
    saveConfig: saveAIConfig,
    generateSQL: generateSQLWithAI_AI,
    isConfigured: isAIConfigured
  } = useAIConfig();

  // Event Handlers
  const handleExecuteQuery = async () => {
    if (!query.trim()) {
      setError('Please enter a SQL query');
      return;
    }

    if (!connection) {
      setError('Please connect to a database first');
      setConnectionModal(true);
      return;
    }

    setIsExecuting(true);
    setStatus('Executing query against database...');
    setError(null);
    setResults(null);

    try {
      const result = await executeQuery(query);
      setResults(result);
      addToHistory(query);

      if (result.type === 'select') {
        setStatus(`✅ Query executed successfully - ${result.rowCount} rows returned in ${result.executionTime}`);
      } else {
        setStatus(`✅ Query executed successfully - ${result.rowCount} rows affected in ${result.executionTime}`);
      }
    } catch (error) {
      setError(`Query execution failed: ${error.message}`);
      setStatus('Query execution failed');
    }

    setIsExecuting(false);
  };

  const handleTestConnection = async () => {
    await testConnection(connectionForm);
  };

  const handleSaveConnection = () => {
    if (connectionStatus.status !== 'connected') {
      alert('Please test the connection successfully first');
      return;
    }

    saveConnection(connectionForm);
    setConnectionModal(false);
    setStatus(`Connected to ${connectionForm.name} (${connectionForm.host}:${connectionForm.port})`);
  };

  const handleFormatQuery = () => {
    if (!query.trim()) return;
    setQuery(formatSQL(query));
    setStatus('Query formatted');
  };

  const handleClearEditor = () => {
    if (window.confirm('Are you sure you want to clear the editor?')) {
      setQuery('');
      setResults(null);
      setError(null);
      setStatus('Editor cleared');
    }
  };

  const handleGenerateSQL = async () => {
    if (!aiInput.trim()) {
      setError('Please describe what you want to query');
      return;
    }

    // Check if AI is configured
    if (!isAIConfigured) {
      setError('Please configure AI settings first');
      setAiConfigModal(true);
      return;
    }

    setStatus('Generating SQL with AI...');

    try {
      // Use the AI config hook's generateSQL method instead of the old one
      const generatedSQL = await generateSQLWithAI_AI(
          aiInput,
          schemas,
          connection?.type
      );

      setQuery(generatedSQL);
      setAiInput('');
      setStatus('SQL generated by AI');
    } catch (error) {
      setError(`AI generation failed: ${error.message}`);
      setStatus('AI generation failed');
    }
  };

  const handleExportCSV = () => {
    if (results?.data) {
      exportToCSV(results.data);
    }
  };

  const handleExportJSON = () => {
    if (results?.data) {
      exportToJSON(results.data);
    }
  };

  const handleSaveAIConfig = (newConfig) => {
    saveAIConfig(newConfig);
    setStatus(`AI configured with ${newConfig.provider} (${newConfig.model})`);
  };

  // Database Explorer Event Handlers
  const handleTableSelect = (table) => {
    // Generate a SELECT query for the selected table
    const selectQuery = `SELECT * FROM ${table.tableName} LIMIT 100;`;
    setQuery(selectQuery);
    setStatus(`Selected table: ${table.tableName}`);
  };

  const handleRefreshSchema = async () => {
    if (!connection) return;

    setIsRefreshingSchema(true);
    setStatus('Refreshing database schema...');

    try {
      await refreshSchemas();
      setStatus('Database schema refreshed');
    } catch (error) {
      setError(`Failed to refresh schema: ${error.message}`);
      setStatus('Schema refresh failed');
    }

    setIsRefreshingSchema(false);
  };

  return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          <Header
              aiEnabled={aiEnabled}
              setAiEnabled={setAiEnabled}
              onAIConfig={() => setAiConfigModal(true)}
              isAIConfigured={isAIConfigured}
          />

          <div style={{
            display: 'flex',
            gap: '20px',
            minHeight: 'calc(100vh - 200px)',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '15px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}>
            {/* Database Explorer Sidebar */}
            <DatabaseExplorer
                connection={connection}
                schemas={schemas}
                onTableSelect={handleTableSelect}
                onRefresh={handleRefreshSchema}
                isLoading={isRefreshingSchema}
            />

            {/* Main Editor Panel */}
            <div style={{
              flex: 1,
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              minWidth: 0 // Prevents flex item from overflowing
            }}>
              <Toolbar
                  onConnect={() => setConnectionModal(true)}
                  onExecute={handleExecuteQuery}
                  onFormat={handleFormatQuery}
                  onClear={handleClearEditor}
                  onAIConfig={() => setAiConfigModal(true)}
                  isExecuting={isExecuting}
                  isConnected={!!connection}
                  isAIConfigured={isAIConfigured}
              />

              <IntelliSenseSQLEditor
                  query={query}
                  setQuery={setQuery}
                  schemas={schemas}
                  connection={connection}
              />

              <ErrorDisplay error={error} />

              <ResultsTable
                  results={results}
                  onExportCSV={handleExportCSV}
                  onExportJSON={handleExportJSON}
              />

              <StatusBar status={status} query={query} />
            </div>

            {/* AI Assistant Panel */}
            {aiEnabled && (
                <div style={{ width: '400px', borderLeft: '1px solid #dee2e6' }}>
                  <AIAssistant
                      aiInput={aiInput}
                      setAiInput={setAiInput}
                      onGenerateSQL={handleGenerateSQL}
                      schemas={schemas}
                      queryHistory={queryHistory}
                      onSelectQuery={setQuery}
                      isAIConfigured={isAIConfigured}
                      onAIConfig={() => setAiConfigModal(true)}
                      aiConfig={aiConfig}
                  />
                </div>
            )}
          </div>

          {/* Connection Modal */}
          <ConnectionModal
              isOpen={connectionModal}
              onClose={() => setConnectionModal(false)}
              connectionForm={connectionForm}
              setConnectionForm={setConnectionForm}
              connectionStatus={connectionStatus}
              onTestConnection={handleTestConnection}
              onSaveConnection={handleSaveConnection}
              API_BASE={API_BASE}
          />

          {/* AI Configuration Modal */}
          <AIConfigModal
              isOpen={aiConfigModal}
              onClose={() => setAiConfigModal(false)}
              onSave={handleSaveAIConfig}
              currentConfig={aiConfig}
          />
        </div>
      </div>
  );
};

export default App;