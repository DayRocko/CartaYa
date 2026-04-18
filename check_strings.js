const fs = require('fs');
const file = 'dashboard.html';
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

let inString = false;
let quoteChar = '';

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if ((char === "'" || char === '"' || char === '`') && line[j-1] !== '\\') {
            if (!inString) {
                inString = true;
                quoteChar = char;
            } else if (char === quoteChar) {
                inString = false;
            }
        }
    }
    if (inString && quoteChar !== '`') {
        // Multi-line strings are only allowed with backticks in JS
        console.log(`POTENTIAL UNTERMINATED STRING AT LINE ${i + 1}`);
        inString = false;
    }
}
