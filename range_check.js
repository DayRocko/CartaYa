const fs = require('fs');
const file = 'dashboard.html';
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

let bCount = 0;
let pCount = 0;

for (let i = 1548; i < 1981; i++) {
    const line = lines[i];
    bCount += (line.match(/\{/g) || []).length;
    bCount -= (line.match(/\}/g) || []).length;
    pCount += (line.match(/\(/g) || []).length;
    pCount -= (line.match(/\)/g) || []).length;
}

console.log('Result for MenuPlatosBlock (Lines 1549-1981):');
console.log(`Braces net: ${bCount}`);
console.log(`Parens net: ${pCount}`);
