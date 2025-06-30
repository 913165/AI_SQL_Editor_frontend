import React, { useState, useRef, useEffect } from 'react';

const IntelliSenseSQLEditor = ({ query, setQuery, schemas, connection }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [suggestionPosition, setSuggestionPosition] = useState({ top: 0, left: 0 });
  const textareaRef = useRef(null);
  const suggestionsRef = useRef(null);

  // SQL Keywords for IntelliSense
  const sqlKeywords = [
    'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN',
    'GROUP BY', 'ORDER BY', 'HAVING', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER',
    'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN', 'IS NULL', 'IS NOT NULL', 'DISTINCT',
    'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'UPPER', 'LOWER', 'SUBSTRING', 'CONCAT',
    'AS', 'ON', 'LIMIT', 'OFFSET', 'UNION', 'UNION ALL', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END'
  ];

  // MySQL specific functions
  const mysqlFunctions = [
    'NOW()', 'CURDATE()', 'CURTIME()', 'DATE_FORMAT()', 'STR_TO_DATE()', 'YEAR()', 'MONTH()', 'DAY()',
    'CONCAT()', 'SUBSTRING()', 'LENGTH()', 'TRIM()', 'LTRIM()', 'RTRIM()', 'REPLACE()',
    'ROUND()', 'FLOOR()', 'CEIL()', 'ABS()', 'RAND()', 'MD5()', 'SHA1()', 'UUID()'
  ];

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
          const columnName = column.split(' ')[0]; // Get column name without type
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
        ...mysqlFunctions.map(func => ({
          text: func,
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

  // Update suggestion dropdown position
  const updateSuggestionPosition = (textarea, position) => {
    const textLines = textarea.value.substring(0, position).split('\n');
    const currentLine = textLines.length;
    const currentColumn = textLines[textLines.length - 1].length;

    const lineHeight = 20; // Approximate line height
    const charWidth = 8; // Approximate character width

    setSuggestionPosition({
      top: currentLine * lineHeight + 40, // Offset for textarea padding
      left: currentColumn * charWidth + 16
    });
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

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

    // Set cursor position after suggestion
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  };

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

  // Syntax highlighting (basic)
  const highlightSQL = (text) => {
    return text
      .replace(/\b(SELECT|FROM|WHERE|JOIN|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)\b/gi,
        '<span style="color: #0066cc; font-weight: bold;">$1</span>')
      .replace(/\b(AND|OR|NOT|IN|LIKE|BETWEEN)\b/gi,
        '<span style="color: #cc0066;">$1</span>')
      .replace(/('[^']*')/g,
        '<span style="color: #009900;">$1</span>')
      .replace(/(\d+)/g,
        '<span style="color: #ff6600;">$1</span>');
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <textarea
        ref={textareaRef}
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onSelect={(e) => setCursorPosition(e.target.selectionStart)}
        placeholder="-- Enter your SQL query here (use Ctrl+Space for suggestions)&#10;-- Example: SELECT * FROM users WHERE active = 1;"
        style={{
          width: '100%',
          height: '250px',
          padding: '16px',
          backgroundColor: '#1e1e1e',
          color: '#00ff00',
          fontFamily: 'Courier New, monospace',
          fontSize: '14px',
          borderRadius: '8px',
          border: '2px solid #e9ecef',
          resize: 'vertical',
          outline: 'none',
          lineHeight: '20px'
        }}
      />

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

          {suggestions.length > 10 && (
            <div style={{
              padding: '8px 12px',
              fontSize: '11px',
              color: '#666',
              backgroundColor: '#f9f9f9',
              textAlign: 'center'
            }}>
              ... and {suggestions.length - 10} more suggestions
            </div>
          )}
        </div>
      )}

      {/* IntelliSense Status */}
      <div style={{
        position: 'absolute',
        bottom: '8px',
        right: '12px',
        fontSize: '11px',
        color: '#666',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '4px 8px',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        <span>💡</span>
        <span>IntelliSense: {connection ? 'Active' : 'Connect DB for suggestions'}</span>
      </div>
    </div>
  );
};

export default IntelliSenseSQLEditor;