const fs = require('fs');
const file = 'dashboard.html';
let content = fs.readFileSync(file, 'utf8');

// Find MenuModificadoresBlock function body
const functionStart = content.indexOf('function MenuModificadoresBlock');
if (functionStart === -1) {
    console.error('MenuModificadoresBlock not found');
    process.exit(1);
}

const functionEnd = content.indexOf('// --- WIDGET:', functionStart + 1); // Next block marker or end of script
const block = content.slice(functionStart, functionEnd === -1 ? undefined : functionEnd);

// Replace hooks in the block
let newBlock = block.replace(/useState\(/g, 'React.useState(');
newBlock = newBlock.replace(/useEffect\(/g, 'React.useEffect(');

content = content.replace(block, newBlock);

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed MenuModificadoresBlock hook scope (Option A).');
