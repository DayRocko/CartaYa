
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Avance2135.html');
let lines = fs.readFileSync(filePath, 'utf8').split('\n');

// Lines 1445–1481 (1-indexed) = indices 1444–1480 (0-indexed)
// Verify what's on those lines
console.log("Line 1445:", JSON.stringify(lines[1444]));
console.log("Line 1481:", JSON.stringify(lines[1480]));
console.log("Line 1482:", JSON.stringify(lines[1481]));
