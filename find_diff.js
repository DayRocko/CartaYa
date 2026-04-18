const fs = require('fs');

const base = fs.readFileSync('Avance12Abril2026.html', 'utf8').split('\n');
const modified = fs.readFileSync('Avance2135.html', 'utf8').split('\n');

// Find the first line that differs
let firstDiff = -1;
const minLen = Math.min(base.length, modified.length);
for (let i = 0; i < minLen; i++) {
  if (base[i] !== modified[i]) {
    firstDiff = i;
    break;
  }
}

console.log(`Base: ${base.length} lines`);
console.log(`Modified: ${modified.length} lines`);

if (firstDiff === -1) {
  console.log('Files are identical up to the shorter length');
} else {
  console.log(`\nFirst difference at line ${firstDiff + 1}:`);
  console.log('BASE:    ', JSON.stringify(base[firstDiff]?.substring(0, 100)));
  console.log('MODIFIED:', JSON.stringify(modified[firstDiff]?.substring(0, 100)));
  
  // Show more context around diffs
  for (let i = firstDiff; i < Math.min(firstDiff + 50, modified.length); i++) {
    if (i < base.length && base[i] !== modified[i]) {
      console.log(`\nLine ${i+1} diff:`);
      console.log('  BASE:    ', base[i]?.substring(0, 120));
      console.log('  MODIFIED:', modified[i]?.substring(0, 120));
    }
  }
}

// Also look for lines that are completely new in modified vs base
// by finding blocks of lines in modified not present in base
console.log('\n=== LOOKING FOR NEW BLOCKS (first 20 chars check) ===');
let inNewBlock = false;
for (let i = 0; i < modified.length; i++) {
  const line = modified[i];
  // Check for potential JSX syntax issues
  if (line.includes('`') && (line.includes('{') || line.includes('}'))) {
    console.log(`Line ${i+1} - template literal with JSX:`, line.trim().substring(0, 80));
  }
  if (line.includes('\\u') && line.includes('replace')) {
    console.log(`Line ${i+1} - unicode replace:`, line.trim().substring(0, 80));
  }
}
