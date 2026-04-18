const fs = require('fs');
const file = 'dashboard.html';
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

const braceStack = [];
const parenStack = [];

console.log('--- SCANNING FOR FIRST NEGATIVE POP ---');

for (let i = 1548; i < lines.length; i++) {
    const line = lines[i];
    for (let charIdx = 0; charIdx < line.length; charIdx++) {
        const char = line[charIdx];
        if (char === '{') braceStack.push({ line: i + 1, col: charIdx + 1 });
        else if (char === '}') {
            if (braceStack.length === 0) {
                console.log(`EXTRA } at line ${i + 1}, col ${charIdx + 1}: ${line.trim()}`);
            } else {
                braceStack.pop();
            }
        }
        else if (char === '(') parenStack.push({ line: i + 1, col: charIdx + 1 });
        else if (char === ')') {
            if (parenStack.length === 0) {
                console.log(`EXTRA ) at line ${i + 1}, col ${charIdx + 1}: ${line.trim()}`);
            } else {
                parenStack.pop();
            }
        }
    }
}

console.log('\n--- FINAL UNCLOSED STACK ---');
braceStack.forEach(b => console.log(`UNCLOSED { at line ${b.line}`));
parenStack.forEach(p => console.log(`UNCLOSED ( at line ${p.line}`));
