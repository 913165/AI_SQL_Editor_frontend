// hooks/useQueryHistory.js
import { useState } from 'react';

export const useQueryHistory = () => {
    const [queryHistory, setQueryHistory] = useState([]);

    const addToHistory = (query) => {
        const timestamp = new Date().toLocaleTimeString();
        setQueryHistory(prev => [
            {
                query: query.substring(0, 100) + (query.length > 100 ? '...' : ''),
                timestamp,
                fullQuery: query
            },
            ...prev.slice(0, 9) // Keep last 10 queries
        ]);
    };

    return {
        queryHistory,
        addToHistory
    };
};