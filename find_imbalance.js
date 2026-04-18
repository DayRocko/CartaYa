
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Avance2135.html');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// Track brace depth from the ViewMenu return( 
// returnLine is 5107 (index 5106)
// Just show lines where depth changes significantly or goes to key values

let depth = 0;
let log = [];

for (let i = 5106; i < 5745; i++) {
  const line = lines[i];
  let open = 0, close = 0;
  for (let c of line) {
    if (c === '{') { depth++; open++; }
    if (c === '}') { depth--; close++; }
  }
  // Log lines where there's a net imbalance OR depth hits key values
  if (open !== close) {
    log.push(`L${i+1} [net=${open-close}, depth=${depth}]: ${line.trim().substring(0, 80)}`);
  }
}

// Show all where net != 0 that haven't resolved yet
// Group consecutive and just show those where final depth != the expected
console.log("Lines with net brace imbalance:");
// Only show where depth != 0 after each section
// Let's just dump the last 30
console.log(log.slice(-30).join('\n'));
console.log(`\nFinal depth: ${depth}`);
