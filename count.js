const fs = require('fs');
const c = fs.readFileSync('dashboard_2.html', 'utf8');
const keys = ['fetchModificadores','handleFileUpload','FileReader','XLSX.read','ReactDOM.createRoot','function getTabTitle','fetch(','new WebSocket'];
keys.forEach(k => {
  const escaped = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const matches = c.match(new RegExp(escaped, 'g')) || [];
  console.log(k + ' -> ' + matches.length);
});
