const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'Avance2135.html');
const lines = fs.readFileSync(file, 'utf8').split('\n');

const start = 4807; 
const end = 5746;   

let depth = 0;
let stack = [];

for (let i = start - 1; i < end; i++) {
    const line = lines[i];
    const cleanLine = line.replace(/"[^"]*"/g, '""').replace(/'[^']*'/g, "''");
    
    const divRegex = /<div[^/]|<\/div>/g;
    let match;
    while ((match = divRegex.exec(cleanLine)) !== null) {
        if (match[0].startsWith('<div')) {
            depth++;
            stack.push(i + 1);
        } else {
            depth--;
            stack.pop();
            if (depth < 0) {
                console.log(`EXTRA close div at line ${i + 1}`);
                depth = 0;
            }
        }
    }
    if (i + 1 >= 5720) console.log(`Line ${i+1}: depth ${depth}, stack: ${stack.slice(-3)}`);
}
