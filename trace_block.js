const fs = require('fs');
const file = 'dashboard.html';
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

let braceLevel = 0;
let parenLevel = 0;

for (let i = 1548; i < lines.length; i++) {
    const line = lines[i];
    const openBraces = (line.match(/\{/g) || []).length;
    const closeBraces = (line.match(/\}/g) || []).length;
    const openParens = (line.match(/\(/g) || []).length;
    const closeParens = (line.match(/\)/g) || []).length;

    braceLevel += openBraces - closeBraces;
    parenLevel += openParens - closeParens;

    if (braceLevel < 0 || parenLevel < 0) {
        console.log(`ERROR AT LINE ${i + 1}: ${line.trim()}`);
        console.log(`Level: Braces=${braceLevel}, Parens=${parenLevel}`);
        break;
    }
    
    if (i > 1990) break;
}
