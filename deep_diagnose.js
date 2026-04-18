
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Avance2135.html');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// Find the start of ViewMenu's return(
const viewMenuReturnLine = lines.findIndex(l => l.includes('function ViewMenu('));
const returnStart = lines.findIndex((l, i) => i > viewMenuReturnLine && l.trim() === 'return (');
const returnEnd = lines.findIndex((l, i) => i > viewMenuReturnLine + 50 && l.trim() === '}' && lines[i-1].trim() === ');');

console.log(`ViewMenu starts at line: ${viewMenuReturnLine + 1}`);
console.log(`return( at line: ${returnStart + 1}`);
console.log(`ViewMenu ends at line: ${returnEnd + 1}`);

// Now parse the JSX: count all tags and braces inside the return
// Strategy: track opening/closing JSX tags and {}
let jsxStack = [];
let braceDepth = 0;
let inString = false;
let stringChar = '';

// Let's just count JSX div tags specifically to find the imbalance
// But that's too coarse. Let's use a different approach:
// Parse line-by-line and track balance of { vs } in a simplified way

// Actually, the error says "expected }" at the top level of the return().
// This means somewhere inside the return(), a {expression} is opened but never closed
// OR a JSX tag is unclosed.

// Let's check inside the ViewMenu return for unclosed { } at the JSX top level
// Key: scan for {menuTab === '...' && ( ... ) } patterns

const vmStart = viewMenuReturnLine;
const vmEnd = returnEnd;

// Check specifically for {menuTab conditions
let menuTabMatches = [];
for (let i = vmStart; i <= vmEnd; i++) {
  if (lines[i].includes('menuTab ===') || lines[i].includes('menuTab===')) {
    menuTabMatches.push({ line: i + 1, content: lines[i].trim().substring(0, 100) });
  }
}
console.log('\nmenuTab expressions:');
menuTabMatches.forEach(m => console.log(`  L${m.line}: ${m.content}`));

// Check the "optimizacion" tab content since that's probably the accordion content
// Let's look at what's between line 5219 and the end of ViewMenu
// Starting at 5219 - the new <div className="w-full space-y-4">

// Check for unclosed conditions
let openConditions = 0;
let closeConditions = 0;
for (let i = vmStart; i <= vmEnd; i++) {
  // Count {condition && (
  const openMatches = lines[i].match(/\{[^}]*&&\s*\(/g) || [];
  openConditions += openMatches.length;
  // Count )}
  const closeMatches = lines[i].match(/\)\}/g) || [];
  closeConditions += closeMatches.length;
}
console.log(`\nOpen conditions {x && (: ${openConditions}`);
console.log(`Close conditions )}: ${closeConditions}`);

// Count { vs } excluding strings in the return block
let depth = 0;
let maxDepth = 0;
let problematicLines = [];
for (let i = returnStart; i <= vmEnd; i++) {
  const line = lines[i];
  for (let c of line) {
    if (c === '{') { depth++; if(depth > maxDepth) maxDepth = depth; }
    if (c === '}') {
      depth--;
      if (depth < 0) {
        problematicLines.push(`L${i+1}: went negative! depth=${depth}`);
      }
    }
  }
  if (depth > 20) problematicLines.push(`L${i+1}: suspicious depth=${depth}`);
}
console.log(`\nFinal JS brace depth in ViewMenu return: ${depth}`);
console.log(`Max depth: ${maxDepth}`);
if (problematicLines.length > 0) {
  console.log('Problematic lines:');
  problematicLines.forEach(p => console.log(' ' + p));
}
