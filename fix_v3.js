const fs = require('fs');
const content = fs.readFileSync('Avance2135.html', 'utf8');
let lines = content.split(/\r?\n/);

// Remove the extra for line
lines.splice(1027, 1);

fs.writeFileSync('Avance2135.html', lines.join('\n'), 'utf8');
console.log('Fixed duplicate line.');
