import React, { useState, useRef, useEffect } from 'react';

const SyntaxHighlightedSQLEditor = ({ query, setQuery, schemas, connection }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedSuggestion, setSelectedSuggestion] = useState(0);
    const [cursorPosition, setCursorPosition] = useState(0);
    const [suggestionPosition, setSuggestionPosition] = useState({ top: 0, left: 0 });
    const textareaRef = useRef(null);
    const highlightRef = useRef(null);
    const suggestionsRef = useRef(null);

    // SQL Keywords for highlighting and IntelliSense
    const sqlKeywords = [
        'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN',
        'GROUP BY', 'ORDER BY', 'HAVING', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER',
        'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN', 'IS NULL', 'IS NOT NULL', 'DISTINCT',
        'AS', 'ON', 'LIMIT', 'OFFSET', 'UNION', 'UNION ALL', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
        'INTO', 'VALUES', 'SET', 'TABLE', 'DATABASE', 'INDEX', 'VIEW', 'PROCEDURE', 'FUNCTION',
        'PRIMARY KEY', 'FOREIGN KEY', 'UNIQUE', 'CHECK', 'DEFAULT', 'AUTO_INCREMENT'
    ];

    const sqlFunctions = [
        'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'UPPER', 'LOWER', 'SUBSTRING', 'CONCAT',
        'NOW', 'CURDATE', 'CURTIME', 'DATE_FORMAT', 'STR_TO_DATE', 'YEAR', 'MONTH', 'DAY',
        'TRIM', 'LTRIM', 'RTRIM', 'REPLACE', 'LENGTH', 'ROUND', 'FLOOR', 'CEIL', 'ABS',
        'RAND', 'MD5', 'SHA1', 'UUID', 'COALESCE', 'ISNULL', 'NULLIF'
    ];

    const sqlOperators = ['=', '!=', '<>', '<', '>', '<=', '>=', '+', '-', '*', '/', '%'];
    const sqlDataTypes = [
        'INT', 'INTEGER', 'VARCHAR', 'CHAR', 'TEXT', 'DATE', 'DATETIME', 'TIMESTAMP',
        'DECIMAL', 'FLOAT', 'DOUBLE', 'BOOLEAN', 'BLOB', 'JSON', 'ENUM'
    ];

    // Syntax highlighting function
    const highlightSQL = (code) => {
        if (!code) return '';

        let highlighted = code;

        // Comments (-- and /* */)
        highlighted = highlighted.replace(
            /(--[^\r\n]*|\/\*[\s\S]*?\*\/)/g,
            '<span style="color: #6a9955; font-style: italic;">$1</span>'
        );

        // Strings (single and double quotes)
        highlighted = highlighted.replace(
            /('[^']*'|"[^"]*")/g,
            '<span style="color: #ce9178;">$1</span>'
        );

        // Numbers
        highlighted = highlighted.replace(
            /\b(\d+\.?\d*)\b/g,
            '<span style="color: #b5cea8;">$1</span>'
        );

        // SQL Keywords
        const keywordPattern = new RegExp(`\\b(${sqlKeywords.join('|')})\\b`, 'gi');
        highlighted = highlighted.replace(
            keywordPattern,
            '<span style="color: #569cd6; font-weight: bold;">$1</span>'
        );

        // SQL Functions
        const functionPattern = new RegExp(`\\b(${sqlFunctions.join('|')})\\b`, 'gi');
        highlighted = highlighted.replace(
            functionPattern,
            '<span style="color: #dcdcaa;">$1</span>'
        );

        // SQL Data Types
        const dataTypePattern = new RegExp(`\\b(${sqlDataTypes.join('|')})\\b`, 'gi');
        highlighted = highlighted.replace(
            dataTypePattern,
            '<span style="color: #4ec9b0;">$1</span>'
        );

        // SQL Operators
        sqlOperators.forEach(op => {
            const escapedOp = op.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            highlighted = highlighted.replace(
                new RegExp(`\\s(${escapedOp})\\s`, 'g'),
                ' <span style="color: #d4d4d4; font-weight: bold;">$1</span> '
            );
        });

        // Table names from schema (if connected)
        if (schemas && schemas.length > 0) {
            const tableNames = schemas.map(table => table.tableName);
            const tablePattern = new RegExp(`\\b(${tableNames.join('|')})\\b`, 'gi');
            highlighted = highlighted.replace(
                tablePattern,
                '<span style="color: #9cdcfe; font-weight: 500;">$1</span>'
            );
        }

        // Parentheses and brackets
        highlighted = highlighted.replace(
            /([()[\]{}])/g,
            '<span style="color: #ffd700;">$1</span>'
        );

        // Semicolons
        highlighted = highlighted.replace(
            /(;)/g,
            '<span style="color: #d4d4d4; font-weight: bold;">$1</span>'
        );

        return highlighted;
    };

    // Parse schemas to get table and column information
    const getTableSuggestions = () => {
        if (!schemas || schemas.length === 0) return [];
        return schemas.map(table => ({
            text: table.tableName,
            type: 'table',
            icon: '📊',
            description: `Table with ${table.columns.split(',').length} columns`
        }));
    };

    const getColumnSuggestions = (tableName = null) => {
        if (!schemas || schemas.length === 0) return [];

        let allColumns = [];
        schemas.forEach(table => {
            if (!tableName || table.tableName === tableName) {
                const columns = table.columns.split(',').map(col => col.trim());
                columns.forEach(column => {
                    const columnName = column.split(' ')[0];
                    allColumns.push({
                        text: columnName,
                        type: 'column',
                        icon: '📋',
                        description: `Column from ${table.tableName}`,
                        table: table.tableName
                    });
                });
            }
        });
        return allColumns;
    };

    // Get current word being typed
    const getCurrentWord = (text, position) => {
        const beforeCursor = text.substring(0, position);
        const afterCursor = text.substring(position);

        const wordStart = beforeCursor.search(/\w+$/);
        const wordEnd = afterCursor.search(/\W/);

        const start = wordStart === -1 ? position : wordStart;
        const end = wordEnd === -1 ? text.length : position + wordEnd;

        return {
            word: text.substring(start, end),
            start,
            end
        };
    };

    // Analyze context to provide smart suggestions
    const getContextualSuggestions = (text, position) => {
        const beforeCursor = text.substring(0, position).toUpperCase();
        const currentWord = getCurrentWord(text, position);

        let suggestions = [];

        // After FROM keyword - suggest tables
        if (/\bFROM\s+\w*$/i.test(beforeCursor)) {
            suggestions = getTableSuggestions();
        }
        // After SELECT - suggest columns and functions
        else if (/\bSELECT\s+(?:\w+\s*,\s*)*\w*$/i.test(beforeCursor)) {
            suggestions = [
                ...getColumnSuggestions(),
                ...sqlFunctions.map(func => ({
                    text: func + '()',
                    type: 'function',
                    icon: '⚡',
                    description: 'SQL Function'
                }))
            ];
        }
        // After WHERE, ON, HAVING - suggest columns
        else if (/\b(WHERE|ON|HAVING)\s+(?:\w+\s*(?:AND|OR)\s+)*\w*$/i.test(beforeCursor)) {
            suggestions = getColumnSuggestions();
        }
        // After JOIN - suggest tables
        else if (/\bJOIN\s+\w*$/i.test(beforeCursor)) {
            suggestions = getTableSuggestions();
        }
        // General suggestions
        else {
            suggestions = [
                ...sqlKeywords.map(keyword => ({
                    text: keyword,
                    type: 'keyword',
                    icon: '🔤',
                    description: 'SQL Keyword'
                })),
                ...getTableSuggestions(),
                ...getColumnSuggestions()
            ];
        }

        // Filter by current word
        if (currentWord.word) {
            suggestions = suggestions.filter(suggestion =>
                suggestion.text.toLowerCase().startsWith(currentWord.word.toLowerCase())
            );
        }

        return { suggestions, currentWord };
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        const newPosition = e.target.selectionStart;

        setQuery(newValue);
        setCursorPosition(newPosition);

        // Update highlighting
        updateHighlighting(newValue);

        // Get suggestions based on context
        const { suggestions: newSuggestions } = getContextualSuggestions(newValue, newPosition);

        if (newSuggestions.length > 0) {
            setSuggestions(newSuggestions);
            setShowSuggestions(true);
            setSelectedSuggestion(0);
            updateSuggestionPosition(e.target, newPosition);
        } else {
            setShowSuggestions(false);
        }
    };

    // Update syntax highlighting
    const updateHighlighting = (code) => {
        if (highlightRef.current) {
            highlightRef.current.innerHTML = highlightSQL(code) + '<br>';
        }
    };

    // Sync scroll between textarea and highlight div
    const handleScroll = (e) => {
        if (highlightRef.current) {
            highlightRef.current.scrollTop = e.target.scrollTop;
            highlightRef.current.scrollLeft = e.target.scrollLeft;
        }
    };

    // Update suggestion dropdown position
    const updateSuggestionPosition = (textarea, position) => {
        const textLines = textarea.value.substring(0, position).split('\n');
        const currentLine = textLines.length;
        const currentColumn = textLines[textLines.length - 1].length;

        const lineHeight = 20;
        const charWidth = 8;

        setSuggestionPosition({
            top: currentLine * lineHeight + 40,
            left: currentColumn * charWidth + 16
        });
    };

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (!showSuggestions) {
            // Handle Tab for indentation
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = e.target.selectionStart;
                const end = e.target.selectionEnd;
                const newValue = query.substring(0, start) + '  ' + query.substring(end);
                setQuery(newValue);
                setTimeout(() => {
                    e.target.setSelectionRange(start + 2, start + 2);
                }, 0);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedSuggestion(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : 0
                );
                break;

            case 'ArrowUp':
                e.preventDefault();
                setSelectedSuggestion(prev =>
                    prev > 0 ? prev - 1 : suggestions.length - 1
                );
                break;

            case 'Tab':
            case 'Enter':
                e.preventDefault();
                applySuggestion(suggestions[selectedSuggestion]);
                break;

            case 'Escape':
                setShowSuggestions(false);
                break;
        }
    };

    // Apply selected suggestion
    const applySuggestion = (suggestion) => {
        const textarea = textareaRef.current;
        const { currentWord } = getContextualSuggestions(query, cursorPosition);

        const beforeWord = query.substring(0, currentWord.start);
        const afterWord = query.substring(currentWord.end);

        const newQuery = beforeWord + suggestion.text + afterWord;
        const newCursorPosition = currentWord.start + suggestion.text.length;

        setQuery(newQuery);
        setShowSuggestions(false);

        // Update highlighting
        updateHighlighting(newQuery);

        // Set cursor position after suggestion
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(newCursorPosition, newCursorPosition);
        }, 0);
    };

    // Initialize highlighting
    useEffect(() => {
        updateHighlighting(query);
    }, [query]);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            {/* Container for layered editor */}
            <div style={{ position: 'relative', width: '100%', height: '250px' }}>
                {/* Syntax highlighting layer */}
                <div
                    ref={highlightRef}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        padding: '16px',
                        backgroundColor: '#1e1e1e',
                        fontFamily: 'Courier New, monospace',
                        fontSize: '14px',
                        lineHeight: '20px',
                        color: 'transparent',
                        overflow: 'auto',
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                        borderRadius: '8px',
                        border: '2px solid #e9ecef',
                        pointerEvents: 'none',
                        zIndex: 1
                    }}
                />

                {/* Actual textarea */}
                <textarea
                    ref={textareaRef}
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onSelect={(e) => setCursorPosition(e.target.selectionStart)}
                    onScroll={handleScroll}
                    placeholder="-- Enter your SQL query here (IntelliSense enabled)&#10;-- Example: SELECT * FROM users WHERE active = 1;"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        padding: '16px',
                        backgroundColor: 'transparent',
                        color: 'transparent',
                        fontFamily: 'Courier New, monospace',
                        fontSize: '14px',
                        lineHeight: '20px',
                        borderRadius: '8px',
                        border: '2px solid #e9ecef',
                        resize: 'vertical',
                        outline: 'none',
                        overflow: 'auto',
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                        caretColor: '#00ff00',
                        zIndex: 2
                    }}
                />

                {/* Placeholder overlay when empty */}
                {!query && (
                    <div style={{
                        position: 'absolute',
                        top: '18px',
                        left: '18px',
                        color: '#666',
                        fontFamily: 'Courier New, monospace',
                        fontSize: '14px',
                        pointerEvents: 'none',
                        zIndex: 0
                    }}>
                        -- Enter your SQL query here (IntelliSense enabled)<br/>
                        -- Example: SELECT * FROM users WHERE active = 1;
                    </div>
                )}
            </div>

            {/* IntelliSense Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div
                    ref={suggestionsRef}
                    style={{
                        position: 'absolute',
                        top: suggestionPosition.top,
                        left: suggestionPosition.left,
                        backgroundColor: '#ffffff',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        zIndex: 1000,
                        minWidth: '250px'
                    }}
                >
                    {suggestions.slice(0, 10).map((suggestion, index) => (
                        <div
                            key={index}
                            onClick={() => applySuggestion(suggestion)}
                            style={{
                                padding: '8px 12px',
                                cursor: 'pointer',
                                backgroundColor: index === selectedSuggestion ? '#e3f2fd' : 'transparent',
                                borderBottom: index < suggestions.length - 1 ? '1px solid #f0f0f0' : 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                            onMouseEnter={() => setSelectedSuggestion(index)}
                        >
                            <span style={{ fontSize: '14px' }}>{suggestion.icon}</span>
                            <div style={{ flex: 1 }}>
                                <div style={{
                                    fontWeight: '500',
                                    fontSize: '13px',
                                    color: '#333'
                                }}>
                                    {suggestion.text}
                                </div>
                                <div style={{
                                    fontSize: '11px',
                                    color: '#666',
                                    marginTop: '2px'
                                }}>
                                    {suggestion.description}
                                </div>
                            </div>
                            <div style={{
                                fontSize: '10px',
                                color: '#999',
                                backgroundColor: '#f5f5f5',
                                padding: '2px 6px',
                                borderRadius: '3px',
                                textTransform: 'uppercase'
                            }}>
                                {suggestion.type}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Syntax Highlighting Legend */}
            <div style={{
                position: 'absolute',
                bottom: '8px',
                right: '12px',
                fontSize: '11px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #e0e0e0',
                display: 'flex',
                gap: '12px',
                alignItems: 'center'
            }}>
                <span style={{ color: '#569cd6', fontWeight: 'bold' }}>Keywords</span>
                <span style={{ color: '#dcdcaa' }}>Functions</span>
                <span style={{ color: '#ce9178' }}>Strings</span>
                <span style={{ color: '#6a9955' }}>Comments</span>
                <span style={{ color: '#9cdcfe' }}>Tables</span>
            </div>
        </div>
    );
};

export default SyntaxHighlightedSQLEditor;