const fs = require('fs');
const file = 'dashboard.html';
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

const braceStack = [];
const parenStack = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let charIdx = 0; charIdx < line.length; charIdx++) {
        const char = line[charIdx];
        if (char === '{') braceStack.push({ line: i + 1, col: charIdx + 1 });
        else if (char === '}') braceStack.pop();
        else if (char === '(') parenStack.push({ line: i + 1, col: charIdx + 1 });
        else if (char === ')') parenStack.pop();
    }
}

console.log('--- UNCLOSED BRACES (STACK) ---');
braceStack.forEach(b => console.log(`UNCLOSED { at line ${b.line}, col ${b.col}`));

console.log('\n--- UNCLOSED PARENS (STACK) ---');
parenStack.forEach(p => console.log(`UNCLOSED ( at line ${p.line}, col ${p.col}`));
