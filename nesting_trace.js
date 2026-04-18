const fs = require('fs');
const file = 'dashboard.html';
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

let braceLevel = 0;
let parenLevel = 0;

console.log('--- NESTING TRACE ---');

for (let i = 1548; i < lines.length; i++) {
    const line = lines[i];
    const openBraces = (line.match(/\{/g) || []).length;
    const closeBraces = (line.match(/\}/g) || []).length;
    const openParens = (line.match(/\(/g) || []).length;
    const closeParens = (line.match(/\)/g) || []).length;

    braceLevel += openBraces - closeBraces;
    parenLevel += openParens - closeParens;

    // Report only when levels change or at interesting points
    if (openBraces || closeBraces || openParens || closeParens) {
        if (i + 1 > 1970 || i + 1 < 1600 || (i + 1 > 1800 && i + 1 < 1830)) {
             console.log(`${i + 1} [B:${braceLevel} P:${parenLevel}] | ${line.trim()}`);
        }
    }
}
