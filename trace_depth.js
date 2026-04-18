const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'Avance2135.html');
const lines = fs.readFileSync(file, 'utf8').split('\n');
let depth = 0;
for (let i = 0; i < lines.length; i++) {
    const cleanLine = lines[i].replace(/"[^"]*"/g, '""').replace(/'[^']*'/g, "''");
    const opens = (cleanLine.match(/<div[^/]/g) || []).length;
    const closes = (cleanLine.match(/<\/div>/g) || []).length;
    depth += opens - closes;
    if (i % 500 === 0) console.log(`Line ${i}: depth ${depth}`);
}
console.log(`Final depth: ${depth}`);
