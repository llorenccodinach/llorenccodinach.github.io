importScripts("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js")

self.onmessage = function (e) {
    const data = e.data;
    const workbook = XLSX.read(data, { type: 'array' });
    self.postMessage(workbook);
};