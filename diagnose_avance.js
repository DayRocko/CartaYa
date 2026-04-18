const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Avance2135.html');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

console.log('--- SCANNING Avance2135.html FOR IMBALANCES ---');

let divDepth = 0;
let braceDepth = 0;
let parenDepth = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip strings for rough balance check
    const cleanLine = line.replace(/"[^"]*"/g, '""').replace(/'[^']*'/g, "''");

    const opens = (cleanLine.match(/<div[^/]/g) || []).length;
    const closes = (cleanLine.match(/<\/div>/g) || []).length;
    divDepth += opens - closes;

    const bOpens = (cleanLine.match(/\{/g) || []).length;
    const bCloses = (cleanLine.match(/\}/g) || []).length;
    braceDepth += bOpens - bCloses;

    const pOpens = (cleanLine.match(/\(/g) || []).length;
    const pCloses = (cleanLine.match(/\)/g) || []).length;
    parenDepth += pOpens - pCloses;

    if (divDepth < 0) {
        console.log(`EXTRA </div> at line ${i + 1}: depth reset`);
        divDepth = 0;
    }
}

console.log(`Final divDepth: ${divDepth}`);
console.log(`Final braceDepth: ${braceDepth}`);
console.log(`Final parenDepth: ${parenDepth}`);
