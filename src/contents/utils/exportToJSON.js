// utils/exportToJSON.js
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

export const exportToJSON = (data) => {
    if (!data || !data.length) return;

    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, 'query_results.json', 'application/json');
};