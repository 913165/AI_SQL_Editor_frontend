// Production Backend API for Real SQL Editor
// File: server.js

const express = require('express');
const mysql = require('mysql2/promise');
const { Pool } = require('pg'); // PostgreSQL
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection
app.post('/api/test-connection', async (req, res) => {
  const { type, host, port, username, password, database } = req.body;

  try {
    let connection;
    let schemas = [];

    if (type === 'mysql') {
      // Test MySQL connection
      connection = await mysql.createConnection({
        host,
        port: parseInt(port),
        user: username,
        password,
        database,
        connectTimeout: 10000
      });

      // Test with simple query
      await connection.execute('SELECT 1');

      // Get database schemas
      const [tables] = await connection.execute(`
                SELECT TABLE_NAME, TABLE_COMMENT 
                FROM INFORMATION_SCHEMA.TABLES 
                WHERE TABLE_SCHEMA = ?
            `, [database || 'information_schema']);

      for (const table of tables) {
        const [columns] = await connection.execute(`
                    SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
                    FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
                    ORDER BY ORDINAL_POSITION
                `, [database, table.TABLE_NAME]);

        schemas.push({
          tableName: table.TABLE_NAME,
          columns: columns.map(col => `${col.COLUMN_NAME} (${col.DATA_TYPE})`).join(', ')
        });
      }

      await connection.end();

    } else if (type === 'postgresql') {
      // Test PostgreSQL connection
      const pool = new Pool({
        host,
        port: parseInt(port),
        user: username,
        password,
        database,
        connectionTimeoutMillis: 10000
      });

      const client = await pool.connect();

      // Test with simple query
      await client.query('SELECT 1');

      // Get PostgreSQL schemas
      const tablesResult = await client.query(`
                SELECT table_name, table_type 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            `);

      for (const table of tablesResult.rows) {
        const columnsResult = await client.query(`
                    SELECT column_name, data_type, is_nullable, column_default
                    FROM information_schema.columns 
                    WHERE table_schema = 'public' AND table_name = $1
                    ORDER BY ordinal_position
                `, [table.table_name]);

        schemas.push({
          tableName: `public.${table.table_name}`,
          columns: columnsResult.rows.map(col => `${col.column_name} (${col.data_type})`).join(', ')
        });
      }

      client.release();
      await pool.end();
    }

    res.json({
      success: true,
      message: 'Connection successful',
      schemas
    });

  } catch (error) {
    console.error('Connection test failed:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Execute SQL query
app.post('/api/execute-query', async (req, res) => {
  const { connection: connConfig, query } = req.body;
  const startTime = Date.now();

  try {
    let connection;
    let result;

    if (connConfig.type === 'mysql') {
      // Execute MySQL query
      connection = await mysql.createConnection({
        host: connConfig.host,
        port: parseInt(connConfig.port),
        user: connConfig.username,
        password: connConfig.password,
        database: connConfig.database
      });

      const [rows, fields] = await connection.execute(query);
      await connection.end();

      const queryType = query.trim().toLowerCase().split(' ')[0];
      const executionTime = Date.now() - startTime;

      if (queryType === 'select') {
        result = {
          success: true,
          type: 'select',
          data: rows,
          rowCount: rows.length,
          executionTime: `${executionTime}ms`
        };
      } else {
        result = {
          success: true,
          type: queryType,
          message: `${rows.affectedRows || 0} row(s) affected`,
          rowCount: rows.affectedRows || 0,
          executionTime: `${executionTime}ms`
        };
      }

    } else if (connConfig.type === 'postgresql') {
      // Execute PostgreSQL query
      const pool = new Pool({
        host: connConfig.host,
        port: parseInt(connConfig.port),
        user: connConfig.username,
        password: connConfig.password,
        database: connConfig.database
      });

      const client = await pool.connect();
      const queryResult = await client.query(query);
      client.release();
      await pool.end();

      const queryType = query.trim().toLowerCase().split(' ')[0];
      const executionTime = Date.now() - startTime;

      if (queryType === 'select') {
        result = {
          success: true,
          type: 'select',
          data: queryResult.rows,
          rowCount: queryResult.rows.length,
          executionTime: `${executionTime}ms`
        };
      } else {
        result = {
          success: true,
          type: queryType,
          message: `${queryResult.rowCount || 0} row(s) affected`,
          rowCount: queryResult.rowCount || 0,
          executionTime: `${executionTime}ms`
        };
      }
    }

    res.json(result);

  } catch (error) {
    const executionTime = Date.now() - startTime;
    console.error('Query execution failed:', error);
    res.status(400).json({
      success: false,
      error: error.message,
      executionTime: `${executionTime}ms`
    });
  }
});

// Get database schemas
app.post('/api/get-schemas', async (req, res) => {
  const { type, host, port, username, password, database } = req.body;

  try {
    let schemas = [];

    if (type === 'mysql') {
      const connection = await mysql.createConnection({
        host,
        port: parseInt(port),
        user: username,
        password,
        database
      });

      const [tables] = await connection.execute(`
                SELECT TABLE_NAME, TABLE_COMMENT 
                FROM INFORMATION_SCHEMA.TABLES 
                WHERE TABLE_SCHEMA = ?
            `, [database]);

      for (const table of tables) {
        const [columns] = await connection.execute(`
                    SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
                    FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
                    ORDER BY ORDINAL_POSITION
                `, [database, table.TABLE_NAME]);

        schemas.push({
          tableName: table.TABLE_NAME,
          columns: columns.map(col =>
              `${col.COLUMN_NAME} (${col.DATA_TYPE}${col.IS_NULLABLE === 'NO' ? ' NOT NULL' : ''})`
          ).join(', ')
        });
      }

      await connection.end();
    }

    res.json({
      success: true,
      schemas
    });

  } catch (error) {
    console.error('Schema fetch failed:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// AI SQL Generation (optional - integrate with OpenAI, Claude, etc.)
app.post('/api/generate-sql', async (req, res) => {
  const { description, schema, database_type } = req.body;

  try {
    // This is where you'd integrate with real AI services
    // Example with OpenAI (requires openai package and API key):

    /*
    const { Configuration, OpenAIApi } = require('openai');
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const prompt = `Generate a ${database_type} SQL query for: ${description}

    Available tables and columns:
    ${schema.map(table => `${table.tableName}: ${table.columns}`).join('\n')}

    Return only the SQL query without explanation:`;

    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 200,
        temperature: 0.3,
    });

    const generatedSQL = completion.data.choices[0].text.trim();
    */

    // For now, return a message that AI integration is needed
    res.status(501).json({
      success: false,
      error: 'AI SQL generation requires integration with AI service (OpenAI, Claude, etc.)'
    });

  } catch (error) {
    console.error('AI generation failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'SQL Editor API is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 SQL Editor API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 Database connections ready for testing`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT. Shutting down gracefully...');
  process.exit(0);
});