import React, { useState, useEffect } from 'react';

const DatabaseExplorer = ({
                              connection,
                              schemas,
                              onTableSelect,
                              onRefresh,
                              isLoading
                          }) => {
    const [expandedNodes, setExpandedNodes] = useState(new Set(['database', 'tables']));
    const [selectedTable, setSelectedTable] = useState(null);
    const [tableDetails, setTableDetails] = useState({});

    // Toggle node expansion
    const toggleExpansion = (nodeId) => {
        const newExpanded = new Set(expandedNodes);
        if (newExpanded.has(nodeId)) {
            newExpanded.delete(nodeId);
        } else {
            newExpanded.add(nodeId);
        }
        setExpandedNodes(newExpanded);
    };

    // Handle table selection
    const handleTableSelect = async (table) => {
        setSelectedTable(table.tableName);
        if (onTableSelect) {
            onTableSelect(table);
        }

        // Fetch table details if not already loaded
        if (!tableDetails[table.tableName]) {
            await fetchTableDetails(table.tableName);
        }
    };

    // Fetch detailed table information
    const fetchTableDetails = async (tableName) => {
        if (!connection) return;

        try {
            const response = await fetch('http://localhost:3001/api/table-details', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    connection,
                    tableName
                })
            });

            if (response.ok) {
                const details = await response.json();
                setTableDetails(prev => ({
                    ...prev,
                    [tableName]: details
                }));
            }
        } catch (error) {
            console.error('Failed to fetch table details:', error);
        }
    };

    // Refresh database structure
    const handleRefresh = () => {
        setTableDetails({});
        if (onRefresh) {
            onRefresh();
        }
    };

    const TreeNode = ({
                          id,
                          label,
                          icon,
                          children,
                          hasChildren = false,
                          onClick,
                          isSelected = false,
                          level = 0
                      }) => {
        const isExpanded = expandedNodes.has(id);
        const hasExpandableChildren = hasChildren || (children && children.length > 0);

        return (
            <div className="tree-node">
                <div
                    className={`tree-node-content ${isSelected ? 'selected' : ''}`}
                    style={{
                        paddingLeft: `${level * 16 + 8}px`,
                        display: 'flex',
                        alignItems: 'center',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        borderRadius: '4px',
                        backgroundColor: isSelected ? '#e3f2fd' : 'transparent',
                        color: isSelected ? '#1976d2' : '#333'
                    }}
                    onClick={() => {
                        if (hasExpandableChildren) {
                            toggleExpansion(id);
                        }
                        if (onClick) {
                            onClick();
                        }
                    }}
                    onMouseEnter={(e) => {
                        if (!isSelected) {
                            e.target.style.backgroundColor = '#f5f5f5';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!isSelected) {
                            e.target.style.backgroundColor = 'transparent';
                        }
                    }}
                >
                    {hasExpandableChildren && (
                        <span
                            style={{
                                marginRight: '4px',
                                fontSize: '10px',
                                transition: 'transform 0.2s ease'
                            }}
                        >
              {isExpanded ? '▼' : '▶'}
            </span>
                    )}
                    <span style={{ marginRight: '6px' }}>{icon}</span>
                    <span style={{ fontWeight: isSelected ? '500' : 'normal' }}>{label}</span>
                </div>

                {isExpanded && children && (
                    <div className="tree-children">
                        {children}
                    </div>
                )}
            </div>
        );
    };

    const ColumnNode = ({ column, level }) => (
        <div
            style={{
                paddingLeft: `${level * 16 + 8}px`,
                display: 'flex',
                alignItems: 'center',
                padding: '2px 8px',
                fontSize: '12px',
                color: '#666'
            }}
        >
            <span style={{ marginRight: '6px' }}>📋</span>
            <span style={{ marginRight: '8px' }}>{column.name}</span>
            <span style={{
                fontSize: '11px',
                color: '#888',
                backgroundColor: '#f0f0f0',
                padding: '1px 4px',
                borderRadius: '3px'
            }}>
        {column.type}
      </span>
            {column.isPrimaryKey && (
                <span style={{
                    marginLeft: '4px',
                    fontSize: '10px',
                    color: '#f39c12',
                    fontWeight: 'bold'
                }}>
          🔑
        </span>
            )}
        </div>
    );

    if (!connection) {
        return (
            <div style={{
                width: '300px',
                backgroundColor: '#f8f9fa',
                borderRight: '1px solid #dee2e6',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6c757d',
                fontSize: '14px'
            }}>
                <div style={{ marginBottom: '12px', fontSize: '48px', opacity: 0.5 }}>🗄️</div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: '500', marginBottom: '4px' }}>No Database Connected</div>
                    <div style={{ fontSize: '12px' }}>Connect to a database to explore its structure</div>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            width: '300px',
            backgroundColor: '#f8f9fa',
            borderRight: '1px solid #dee2e6',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        }}>
            {/* Header */}
            <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid #dee2e6',
                backgroundColor: '#ffffff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: '#333' }}>
                        Database Explorer
                    </div>
                    <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                        {connection.host}:{connection.port}
                    </div>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={isLoading}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        padding: '4px',
                        borderRadius: '4px',
                        fontSize: '14px',
                        opacity: isLoading ? 0.5 : 1
                    }}
                    title="Refresh"
                >
                    {isLoading ? '⏳' : '🔄'}
                </button>
            </div>

            {/* Tree Structure */}
            <div style={{
                flex: 1,
                overflow: 'auto',
                padding: '8px'
            }}>
                {/* Database Node */}
                <TreeNode
                    id="database"
                    label={connection.database || connection.name}
                    icon="🗄️"
                    hasChildren={true}
                    level={0}
                >
                    {/* Connection Info */}
                    <div style={{
                        paddingLeft: '24px',
                        fontSize: '11px',
                        color: '#666',
                        marginBottom: '8px'
                    }}>
                        <div>Type: {connection.type}</div>
                        <div>Host: {connection.host}</div>
                    </div>

                    {/* Tables Node */}
                    <TreeNode
                        id="tables"
                        label={`Tables (${schemas.length})`}
                        icon="📁"
                        hasChildren={true}
                        level={1}
                    >
                        {schemas.map((table, index) => {
                            const tableId = `table-${table.tableName}`;
                            const columns = parseColumns(table.columns);

                            return (
                                <TreeNode
                                    key={index}
                                    id={tableId}
                                    label={table.tableName}
                                    icon="📊"
                                    hasChildren={columns.length > 0}
                                    onClick={() => handleTableSelect(table)}
                                    isSelected={selectedTable === table.tableName}
                                    level={2}
                                >
                                    {/* Table Columns */}
                                    {columns.map((column, colIndex) => (
                                        <ColumnNode
                                            key={colIndex}
                                            column={column}
                                            level={3}
                                        />
                                    ))}

                                    {/* Table Stats */}
                                    <div style={{
                                        paddingLeft: '56px',
                                        fontSize: '11px',
                                        color: '#888',
                                        marginTop: '4px',
                                        fontStyle: 'italic'
                                    }}>
                                        {columns.length} columns
                                    </div>
                                </TreeNode>
                            );
                        })}
                    </TreeNode>

                    {/* Views Node (if any) */}
                    <TreeNode
                        id="views"
                        label="Views (0)"
                        icon="👁️"
                        hasChildren={false}
                        level={1}
                    />

                    {/* Procedures Node (if any) */}
                    <TreeNode
                        id="procedures"
                        label="Stored Procedures (0)"
                        icon="⚙️"
                        hasChildren={false}
                        level={1}
                    />

                    {/* Functions Node (if any) */}
                    <TreeNode
                        id="functions"
                        label="Functions (0)"
                        icon="🔧"
                        hasChildren={false}
                        level={1}
                    />
                </TreeNode>
            </div>

            {/* Footer */}
            <div style={{
                padding: '8px 12px',
                borderTop: '1px solid #dee2e6',
                backgroundColor: '#ffffff',
                fontSize: '11px',
                color: '#666'
            }}>
                {schemas.length} tables • Connected
            </div>
        </div>
    );
};

// Helper function to parse column information
const parseColumns = (columnsString) => {
    if (!columnsString) return [];

    return columnsString.split(',').map(col => {
        const trimmed = col.trim();
        const parts = trimmed.match(/^(\w+)(?:\s*\(([^)]+)\))?/);

        return {
            name: parts ? parts[1] : trimmed,
            type: parts && parts[2] ? parts[2] : 'unknown',
            isPrimaryKey: trimmed.toLowerCase().includes('id') &&
                (trimmed.toLowerCase().includes('primary') || trimmed === trimmed.split(',')[0].trim())
        };
    });
};

export default DatabaseExplorer;