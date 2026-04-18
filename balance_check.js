const fs = require('fs');
const file = 'dashboard.html';
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

let braceLevel = 0;
let parenLevel = 0;

console.log('--- SCANNING FOR UNBALANCED BLOCKS ---');

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Simple scan ignoring comments and strings for now (rough)
    const openBraces = (line.match(/\{/g) || []).length;
    const closeBraces = (line.match(/\}/g) || []).length;
    const openParens = (line.match(/\(/g) || []).length;
    const closeParens = (line.match(/\)/g) || []).length;

    braceLevel += openBraces - closeBraces;
    parenLevel += openParens - closeParens;

    if (braceLevel < 0) {
        console.log(`EXTRA } at line ${i + 1}: ${line.trim()}`);
        braceLevel = 0; // reset
    }
    if (parenLevel < 0) {
        console.log(`EXTRA ) at line ${i + 1}: ${line.trim()}`);
        parenLevel = 0;
    }
}

if (braceLevel > 0) console.log(`UNCLOSED { : count ${braceLevel}`);
if (parenLevel > 0) console.log(`UNCLOSED ( : count ${parenLevel}`);
