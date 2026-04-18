
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Avance2135.html');
let lines = fs.readFileSync(filePath, 'utf8').split('\n');

// Line 5720 (index 5719) is the extra </div>.
// Remove it.
console.log("Removing line 5720:", JSON.stringify(lines[5719]));
lines.splice(5719, 1);
console.log("New line 5719:", JSON.stringify(lines[5718]));
console.log("New line 5720:", JSON.stringify(lines[5719]));

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log("Saved.");
