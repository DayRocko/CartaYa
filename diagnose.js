
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Avance2135.html');
let content = fs.readFileSync(filePath, 'utf8');

let issues = [];

// 1. Check for unclosed braces/parens in the popover IIFE
const popoverStart = content.indexOf('{(() => {');
if (popoverStart !== -1) {
  // Find the matching end
  let depth = 0;
  let foundEnd = -1;
  for (let i = popoverStart; i < content.length; i++) {
    if (content[i] === '{') depth++;
    if (content[i] === '}') {
      depth--;
      if (depth === 0) {
        foundEnd = i;
        break;
      }
    }
  }
  issues.push(`Popover IIFE starts at ${popoverStart}, ${foundEnd !== -1 ? 'closes at ' + foundEnd : 'NEVER CLOSES'}`);
}

// 2. Check for specific known issues
const checks = [
  { name: 'opciones duplicate', pattern: /const \[opciones, setOpciones\] = React\.useState\(/ },
  { name: 'vinculos duplicate', pattern: /const \[vinculos, setVinculos\] = React\.useState\(/ },
  { name: 'grupos duplicate', pattern: /const \[grupos, setGrupos\] = React\.useState\(/ },
  { name: 'MODIFIER_GROUPS static', pattern: /const MODIFIER_GROUPS = \{/ },
  { name: 'getGroupsForType', pattern: /getGroupsForType\(/ },
];

checks.forEach(c => {
  const matches = content.match(new RegExp(c.pattern, 'g'));
  issues.push(`${c.name}: ${matches ? matches.length : 0} occurrences`);
});

// 3. Look for unclosed JSX/JS around where Babel breaks
// Find the line approximately
const lines = content.split('\n');
let braceDepth = 0;
let parenDepth = 0;
let inJSX = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (let c of line) {
    if (c === '{') braceDepth++;
    if (c === '}') braceDepth--;
    if (c === '(') parenDepth++;
    if (c === ')') parenDepth--;
  }
}
issues.push(`Final brace depth: ${braceDepth}, paren depth: ${parenDepth}`);

// 4. Find the problematic area around popover
const badClose = content.indexOf('} || [];\n }) })()}');
if (badClose !== -1) {
  issues.push(`Found bad close sequence at ${badClose}`);
}

// 5. Check for handleToggleNoteOption
const toggleDef = content.indexOf('const handleToggleNoteOption =');
issues.push(`handleToggleNoteOption defined: ${toggleDef !== -1}`);

fs.writeFileSync(path.join(__dirname, 'diagnostic.txt'), issues.join('\n'));
console.log(issues.join('\n'));
