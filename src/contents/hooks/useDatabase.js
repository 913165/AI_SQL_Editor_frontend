// hooks/useDatabase.js
import {useState} from 'react';

export const useDatabase = (API_BASE) => {
    const [connection, setConnection] = useState(null);
    const [schemas, setSchemas] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState({
        status: 'disconnected',
        message: 'Not connected to any database',
        isLoading: false
    });

    const testConnection = async (connectionForm) => {
        if (!connectionForm.host || !connectionForm.username) {
            setConnectionStatus({
                status: 'error',
                message: 'Please fill in Host and Username fields',
                isLoading: false
            });
            return false;
        }

        setConnectionStatus({
            status: 'testing',
            message: 'Testing connection to database...',
            isLoading: true
        });

        try {
            const response = await fetch(`${API_BASE}/api/test-connection`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(connectionForm)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setConnectionStatus({
                    status: 'connected',
                    message: `✅ Successfully connected to ${connectionForm.type} database`,
                    isLoading: false
                });

                if (result.schemas) {
                    setSchemas(result.schemas);
                }
                return true;
            } else {
                setConnectionStatus({
                    status: 'error',
                    message: `❌ Connection failed: ${result.error || 'Unknown error'}`,
                    isLoading: false
                });
                return false;
            }
        } catch (error) {
            setConnectionStatus({
                status: 'error',
                message: `❌ Cannot connect to database: ${error.message}. Make sure your backend API is running on ${API_BASE}`,
                isLoading: false
            });
            return false;
        }
    };

    const executeQuery = async (query) => {
        if (!connection) {
            throw new Error('No database connection');
        }

        const response = await fetch(`${API_BASE}/api/execute-query`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({connection, query: query.trim()})
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.error || 'Query execution failed');
        }

        return result;
    };

    const fetchSchemas = async (connectionForm) => {
        try {
            const response = await fetch(`${API_BASE}/api/get-schemas`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(connectionForm)
            });

            const result = await response.json();
            if (result.success && result.schemas) {
                setSchemas(result.schemas);
            }
        } catch (error) {
            console.error('Failed to fetch schemas:', error);
        }
    };

    const saveConnection = (connectionForm) => {
        setConnection(connectionForm);
        fetchSchemas(connectionForm);
    };

    return {
        connection,
        schemas,
        connectionStatus,
        testConnection,
        executeQuery,
        saveConnection
    };
};