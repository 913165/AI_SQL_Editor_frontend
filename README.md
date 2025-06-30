# 🗄️ Real SQL Editor with AI Assistant

A **production-ready, modular SQL editor** built with React that connects to real databases and features AI-powered SQL generation. No simulations, no mock data - everything is real and functional.

![SQL Editor Screenshot](https://img.shields.io/badge/React-18+-blue) ![AI Powered](https://img.shields.io/badge/AI-OpenAI%20GPT--4-green) ![Database](https://img.shields.io/badge/Database-MySQL%20%7C%20PostgreSQL%20%7C%20Oracle-orange) ![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 🔗 **Real Database Connectivity**
- ✅ **Multiple Database Support**: MySQL, PostgreSQL, Oracle, SQL Server
- ✅ **Live Connection Testing**: Verify credentials before connecting
- ✅ **Schema Introspection**: Automatic table and column discovery
- ✅ **Real Query Execution**: Execute actual SQL against your databases
- ✅ **Connection Management**: Save and manage multiple database connections

### 🤖 **AI-Powered SQL Generation**
- ✅ **OpenAI Integration**: GPT-4 and GPT-3.5 support with your own API key
- ✅ **Context-Aware Generation**: Uses your actual database schema
- ✅ **Natural Language**: Describe queries in plain English
- ✅ **Multiple Providers**: OpenAI and Anthropic Claude support
- ✅ **Secure Storage**: API keys stored locally, never sent to servers

### 📊 **Professional Query Interface**
- ✅ **Syntax Highlighting**: SQL editor with dark theme
- ✅ **Query Formatting**: Automatic SQL beautification
- ✅ **Results Grid**: Professional data table with sorting
- ✅ **Export Functionality**: CSV and JSON export options
- ✅ **Query History**: Track and reuse previous queries

### 🎨 **Modern UI/UX**
- ✅ **Responsive Design**: Works on desktop and mobile
- ✅ **Modular Architecture**: Clean, maintainable React components
- ✅ **Real-time Status**: Connection and execution feedback
- ✅ **Error Handling**: Comprehensive error messages and recovery

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- A local database (MySQL, PostgreSQL, etc.)
- OpenAI API key (optional, for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/real-sql-editor.git
   cd real-sql-editor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up backend API** (for database connections)
   ```bash
   cd backend
   npm install express mysql2 pg cors
   node server.js
   ```

4. **Start the frontend**
   ```bash
   npm start
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
src/
├── App.js                    # Main application component
├── contents/
│   ├── components/           # React UI components
│   │   ├── Header.js        # App header with AI toggle
│   │   ├── Toolbar.js       # Action buttons
│   │   ├── SQLEditor.js     # Code editor
│   │   ├── ErrorDisplay.js  # Error messages
│   │   ├── ResultsTable.js  # Query results grid
│   │   ├── StatusBar.js     # Status and stats
│   │   ├── AIAssistant.js   # AI panel
│   │   ├── ConnectionModal.js # Database connection
│   │   └── AIConfigModal.js # AI configuration
│   ├── hooks/               # Custom React hooks
│   │   ├── useDatabase.js   # Database operations
│   │   ├── useQueryHistory.js # Query tracking
│   │   └── useAIConfig.js   # AI configuration
│   └── utils/               # Utility functions
│       ├── sqlFormatter.js  # SQL formatting
│       ├── exportToCSV.js   # CSV export
│       ├── exportToJSON.js  # JSON export
│       └── generateSQLWithAI.js # AI integration
└── backend/
    └── server.js            # Node.js API server
```

## 🔧 Configuration

### Database Setup

1. **Click "Connect Database"**
2. **Choose your database type** (MySQL, PostgreSQL, etc.)
3. **Enter connection details**:
    - Host: `localhost`
    - Port: `3306` (MySQL) or `5432` (PostgreSQL)
    - Username: Your database username
    - Password: Your database password
    - Database: Target database name
4. **Test connection** and save

### AI Configuration

1. **Click "AI Settings"** in the header
2. **Get your API key**:
    - **OpenAI**: Visit [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
    - **Claude**: Visit [console.anthropic.com](https://console.anthropic.com/)
3. **Configure settings**:
    - Provider: OpenAI or Claude
    - Model: GPT-4 (recommended)
    - Temperature: 0.3 (balanced)
    - Max Tokens: 500
4. **Test connection** and save

## 💻 Usage

### Basic SQL Operations
```sql
-- Connect to your database first
-- Then write and execute real SQL queries

SELECT u.name, u.email, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id
ORDER BY order_count DESC;
```

### AI-Powered Generation
1. **Enable AI Assistant** using the toggle
2. **Describe your query**: "Find all active users with their order counts"
3. **Click "Generate SQL"** - AI creates the query using your database schema
4. **Review and execute** the generated SQL

### Export Results
- **CSV Export**: Download query results as spreadsheet
- **JSON Export**: Download results as structured data
- **Copy Results**: Select and copy data from the grid

## 🛠️ Backend API

The editor requires a backend API for database connections. Here's a minimal setup:

### Server Setup (backend/server.js)
```javascript
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Test database connection
app.post('/api/test-connection', async (req, res) => {
  // Implementation in the provided backend code
});

// Execute SQL query
app.post('/api/execute-query', async (req, res) => {
  // Implementation in the provided backend code
});

app.listen(3001, () => {
  console.log('SQL Editor API running on port 3001');
});
```

### Dependencies
```bash
npm install express mysql2 pg cors
```

## 🔒 Security

- **API Keys**: Stored locally in browser, never sent to servers
- **Database Credentials**: Used only for direct connections
- **SQL Injection Protection**: Parameterized queries recommended
- **CORS Configuration**: Properly configured for local development

## 🧪 Testing

### Database Connection Testing
- Built-in connection validation
- Real-time error reporting
- Schema verification

### AI Testing
- API key validation
- Model availability checking
- Response quality verification

## 📊 Supported Databases

| Database | Status | Notes |
|----------|--------|-------|
| MySQL | ✅ Full Support | 5.7+ recommended |
| PostgreSQL | ✅ Full Support | 10+ recommended |
| Oracle | ✅ Full Support | 12c+ recommended |
| SQL Server | ✅ Full Support | 2017+ recommended |
| SQLite | ⚠️ Limited | File-based only |

## 🤖 AI Providers

| Provider | Models | Status |
|----------|--------|--------|
| OpenAI | GPT-4, GPT-4 Turbo, GPT-3.5 | ✅ Full Support |
| Anthropic | Claude 3 Opus, Sonnet | ✅ Full Support |
| Custom API | Any OpenAI-compatible | ⚠️ Experimental |

## 🎯 Roadmap

- [ ] **Query Performance Analysis**: Execution plan visualization
- [ ] **Advanced AI Features**: Query optimization suggestions
- [ ] **Collaboration**: Share queries with teams
- [ ] **Version Control**: Query versioning and history
- [ ] **Custom Themes**: Dark/light mode toggle
- [ ] **Plugin System**: Extensible architecture
- [ ] **More Databases**: MongoDB, Redis support
- [ ] **Cloud Deployment**: Docker containers

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow React best practices
- Write modular, reusable components
- Include error handling
- Test database connections
- Document new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **OpenAI** - For GPT models and API
- **Anthropic** - For Claude AI models
- **Database Communities** - For excellent documentation

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/real-sql-editor/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/real-sql-editor/discussions)
- **Email**: tinumistry@gmailcom

---

**Built with ❤️ using React, Node.js, and AI**

*No simulations, no mock data - just real, production-ready SQL editing with AI superpowers!*