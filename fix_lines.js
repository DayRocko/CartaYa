
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Avance2135.html');
let lines = fs.readFileSync(filePath, 'utf8').split('\n');

// Remove the old static popover block (lines 1445-1481 inclusive, 0-indexed: 1444-1480)
// Replace with empty string to keep line structure
lines.splice(1444, 37); // 37 lines from index 1444 to 1480

console.log("Removed 37 lines. Verifying new line at 1444:", JSON.stringify(lines[1444]));

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log("Saved.");
