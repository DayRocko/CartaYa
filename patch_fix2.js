const fs = require('fs');
const file = 'dashboard.html';
let lines = fs.readFileSync(file, 'utf8').split('\n');

// Fix line 1878 (0-indexed: 1877) - incomplete JSX comment
lines[1877] = '      {/* MODAL FORMULARIO DE PLATO */}';

fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('Fixed JSX comment. Line 1878 is now:', lines[1877]);
