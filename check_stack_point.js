const fs = require('fs');
const file = 'dashboard.html';
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

const braceStack = [];
const parenStack = [];

for (let i = 1548; i < lines.length; i++) {
    const line = lines[i];
    for (let charIdx = 0; charIdx < line.length; charIdx++) {
        const char = line[charIdx];
        if (char === '{') braceStack.push({ line: i + 1, col: charIdx + 1 });
        else if (char === '}') braceStack.pop();
        else if (char === '(') parenStack.push({ line: i + 1, col: charIdx + 1 });
        else if (char === ')') parenStack.pop();
    }
    
    if (i + 1 === 1812) {
        console.log(`--- STACK AT LINE 1812 ---`);
        console.log('Braces:', braceStack.length);
        console.log('Parens:', parenStack.length);
    }
}
