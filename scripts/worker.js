importScripts("./xlsx.full.min.js")

self.onmessage = function (e) {
    const data = e.data;
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    self.postMessage({workbook: workbook, range: range, worksheet: worksheet});
};