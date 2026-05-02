const fs = require('fs');
const content = fs.readFileSync('Avance2135.html', 'utf8');
let lines = content.split(/\r?\n/);

// Add missing closing brace
lines.splice(1029, 0, "  };");

fs.writeFileSync('Avance2135.html', lines.join('\n'), 'utf8');
console.log('Fixed missing brace.');
