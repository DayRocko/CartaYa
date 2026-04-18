const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'Avance2135.html');
const lines = fs.readFileSync(file, 'utf8').split('\n');

const start = 5740; 
const end = 5750;   

let depth = 0;
for (let i = start - 1; i < end; i++) {
    const line = lines[i];
    console.log(`Line ${i+1}: "${line}"`);
    const cleanLine = line.replace(/"[^"]*"/g, '""').replace(/'[^']*'/g, "''");
    
    const divRegex = /<div[^/]|<\/div>/g;
    let match;
    while ((match = divRegex.exec(cleanLine)) !== null) {
        console.log(`  Match: ${match[0]}`);
    }
}
