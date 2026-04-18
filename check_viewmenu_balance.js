const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'Avance2135.html');
const lines = fs.readFileSync(file, 'utf8').split('\n');

const start = 4807; // ViewMenu start
const end = 5747;   // ViewMenu end (well, ish)

let depth = 0;
for (let i = start - 1; i < end; i++) {
    const cleanLine = lines[i].replace(/"[^"]*"/g, '""').replace(/'[^']*'/g, "''");
    const opens = (cleanLine.match(/<div[^/]/g) || []).length;
    const closes = (cleanLine.match(/<\/div>/g) || []).length;
    depth += opens - closes;
    if (depth < 0) { console.log(`Extra close at line ${i+1}`); depth = 0; }
}
console.log(`ViewMenu balance: ${depth}`);
