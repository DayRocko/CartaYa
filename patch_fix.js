const fs = require('fs');
const file = 'dashboard.html';
let lines = fs.readFileSync(file, 'utf8').split('\n');

// Fix lines 1873-1878 (0-indexed: 1872-1877)
// Current state:
// 1873: "        )}\r"        (closes table view conditional)
// 1874: "\r"                   (blank)
// 1875: "      </div>\r"       (closes bg-gray-50 div)
// 1876: "\r"                   (blank)
// 1877: "      )}"             (closes ternary - my injection)
// 1878: "      </div>"         (extra div close - my injection)
// 1879: ""                     (blank)
// 1880: "      {/* MODAL ... */}\r"

// We need the structure to be:
// Close table conditional: )}
// Close ternary else: )}
// Close bg-gray-50 div: </div>
// Then the modal starts

const replacement = [
  '        )}',        // closes the table view conditional (line 1873)
  '',                  // blank
  '        )}',        // closes the ternary (else branch)
  '      </div>',      // closes bg-gray-50/50 div
  '',
  '      {/* MODAL FORMULARIO DE PLATO */'  // keep existing comment
];

// Replace lines 1873-1880 (indices 1872-1879)
lines.splice(1872, 8, ...replacement);

fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('Fixed ternary/div closure. Total lines:', lines.length);
