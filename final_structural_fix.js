const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'Avance2135.html');
let lines = fs.readFileSync(file, 'utf8').split('\n');

// Task 1: Close space-y-4 wrapper (unclosed from 5218)
// After Categorias, Platos, Modificadores, Recetas accordions.
// Recetas ends at 5492, close-div at 5493. 
// We insert another closer at 5494.
console.log('Inserting closer at 5494. Current 5493 is:', JSON.stringify(lines[5492]));
lines.splice(5494, 0, '         </div>' + (lines[5493].endsWith('\r') ? '\r' : ''));

// Task 2: Fix Laboratorio balance
// Remove premature closer at 5640 (which became 5641 due to Task 1)
console.log('Removing line 5641. Content:', JSON.stringify(lines[5640]));
lines.splice(5640, 1);

// Task 3: Close Laboratorio wrapper at the end
// )} is at 5721 (index 5720).
console.log('Inserting closer before )} at 5721. Content:', JSON.stringify(lines[5720]));
lines.splice(5720, 0, '           </div>' + (lines[5719].endsWith('\r') ? '\r' : ''));

fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('Done.');
