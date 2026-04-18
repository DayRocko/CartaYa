const fs = require('fs');
const lines = fs.readFileSync('dashboard_2.html', 'utf8').split('\n');
const results = [];
lines.forEach((l, i) => {
  const match = l.includes('fetch(') || 
                l.includes('new WebSocket') || 
                l.includes('FormData') || 
                l.includes('addEventListener') || 
                l.includes('getTabTitle') || 
                l.includes('createRoot') || 
                l.includes('handleFileUpload') ||
                l.includes('{/*') ||
                l.includes('fetch');
  
  if (match) {
    results.push('--- Line ' + (i+1) + ' ---');
    for (let j = Math.max(0, i - 2); j <= Math.min(lines.length - 1, i + 5); j++) {
      results.push(`${j+1}: ${lines[j]}`);
    }
  }
});
fs.writeFileSync('inspect.txt', results.join('\n'));
