const fs = require('fs');
const file = 'dashboard.html';
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

const stack = [];

for (let i = 1548; i < 1981; i++) {
    const line = lines[i];
    for (let charIdx = 0; charIdx < line.length; charIdx++) {
        const char = line[charIdx];
        if (char === '{' || char === '(') {
            stack.push({ char, line: i + 1, col: charIdx + 1 });
        } else if (char === '}') {
            const top = stack.pop();
            if (top && top.char !== '{') {
                // console.log(`MISMATCH: } closes ${top.char} at line ${i+1}`);
                stack.push(top); // put back
            }
        } else if (char === ')') {
            const top = stack.pop();
            if (top && top.char !== '(') {
                // console.log(`MISMATCH: ) closes ${top.char} at line ${i+1}`);
                stack.push(top); // put back
            }
        }
    }
}

console.log('--- FINAL UNCLOSED STACK FOR COMPONENT ---');
stack.forEach(s => console.log(`OPEN ${s.char} at line ${s.line}`));
