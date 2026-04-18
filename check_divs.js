
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Avance2135.html');
const lines = fs.readFileSync(filePath, 'utf8').split('\n');

// Count divs from line 5219 (index 5218) to line 5722 (index 5721)
let depth = 0;
let openings = [], closings = [];

for (let i = 5218; i <= 5721; i++) {
  const line = lines[i];
  const opens = (line.match(/<div[^/]/g) || []).length;
  const closes = (line.match(/<\/div>/g) || []).length;
  depth += opens - closes;
  if (opens > 0) openings.push(`L${i+1}: ${opens} open (depth=${depth})`);
  if (closes > 0) closings.push(`L${i+1}: ${closes} close (depth=${depth})`);
}

console.log(`Net div balance from L5219 to L5722: ${depth}`);
if (depth > 0) console.log(`NEEDS ${depth} more closing </div> tags!`);
if (depth < 0) console.log(`Has ${Math.abs(depth)} EXTRA closing </div> tags!`);
console.log("\nLast 10 openings:", openings.slice(-10).join('\n'));
console.log("Last 10 closings:", closings.slice(-10).join('\n'));
