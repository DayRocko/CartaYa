
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Avance2135.html');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// ViewMenu return starts at line 5107 (index 5106)
// ViewMenu closes at line 5745 (index 5744) - BUT brace went negative here
// That means the closing } on 5745 is one too many.
// Let's find exactly where the return's JSX closes vs where the function closes

// Track balance from line 5107
let depth = 0;
for (let i = 5106; i < 5745; i++) {
  const line = lines[i];
  for (let c of line) {
    if (c === '{') depth++;
    if (c === '}') depth--;
  }
  // Log when depth becomes 0 (could be end of return)
  if (depth === 0 && i > 5107) {
    console.log(`Depth hits 0 at L${i+1}: ${lines[i].trim().substring(0, 80)}`);
  }
  if (depth < 0) {
    console.log(`Depth goes NEGATIVE at L${i+1}: ${lines[i].trim().substring(0, 80)}`);
    break;
  }
}
console.log(`Final depth at end: ${depth}`);

// Also: let's check lines 5147 and 5498 specifically - the two menuTab conditions
// 5147: {menuTab === 'configuracion' && (
// 5498: {menuTab === 'laboratorio' && (
// They should both close with )}
// Let's look for their matching closes
console.log('\n--- menuTab=configuracion block ---');
console.log('L5147:', lines[5146].trim());

// Find the close for the configuracion block
let bdepth = 0;
let inBlock = false;
for (let i = 5146; i < 5600; i++) {
  for (let c of lines[i]) {
    if (c === '{') { bdepth++; inBlock = true; }
    if (c === '}') bdepth--;
  }
  if (inBlock && bdepth === 0) {
    console.log(`configuracion block closes at L${i+1}: ${lines[i].trim().substring(0, 80)}`);
    break;
  }
}

console.log('\n--- menuTab=laboratorio block ---');
console.log('L5498:', lines[5497].trim());
bdepth = 0; inBlock = false;
for (let i = 5497; i < 5750; i++) {
  for (let c of lines[i]) {
    if (c === '{') { bdepth++; inBlock = true; }
    if (c === '}') bdepth--;
  }
  if (inBlock && bdepth === 0) {
    console.log(`laboratorio block closes at L${i+1}: ${lines[i].trim().substring(0, 80)}`);
    break;
  }
}
