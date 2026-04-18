const fs = require('fs');
const content = fs.readFileSync('Avance2135.html', 'utf8');
const lines = content.split('\n');

let divDepth = 0;
let braceDepth = 0;
let parenDepth = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const cleanLine = line.replace(/"[^"]*"/g, '""').replace(/'[^']*'/g, "''");
    
    // Check divs
    const divRegex = /<div[^/]|<\/div>/g;
    let match;
    while ((match = divRegex.exec(cleanLine)) !== null) {
        if (match[0].startsWith('<div')) divDepth++;
        else divDepth--;
    }
    
    // Check braces (outside of strings)
    for (let char of cleanLine) {
        if (char === '{') braceDepth++;
        else if (char === '}') braceDepth--;
        else if (char === '(') parenDepth++;
        else if (char === ')') parenDepth--;
    }

    if (divDepth < 0 || braceDepth < 0 || parenDepth < 0) {
        console.log(`IMBALANCE at line ${i + 1}: div=${divDepth}, brace=${braceDepth}, paren=${parenDepth}`);
        break;
    }
}
console.log(`FINAL: div=${divDepth}, brace=${braceDepth}, paren=${parenDepth}`);
