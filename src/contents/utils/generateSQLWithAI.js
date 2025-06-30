// utils/generateSQLWithAI.js
export const generateSQLWithAI = async (API_BASE, description, schemas, databaseType) => {
    const response = await fetch(`${API_BASE}/api/generate-sql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            description,
            schema: schemas,
            database_type: databaseType
        })
    });

    const result = await response.json();

    if (!result.success) {
        throw new Error(result.error || 'AI generation failed');
    }

    return result.sql;
};