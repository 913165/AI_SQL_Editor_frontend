// utils/exportToCSV.js
export const exportToCSV = (data) => {
    if (!data || !data.length) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row =>
            headers.map(header => `"${row[header] || ''}"`).join(',')
        )
    ].join('\n');

    downloadFile(csvContent, 'query_results.csv', 'text/csv');
};

export const exportToJSON = (data) => {
    if (!data || !data.length) return;

    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, 'query_results.json', 'application/json');
};

const downloadFile = (content, filename, contentType) => {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
};