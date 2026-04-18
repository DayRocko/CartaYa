
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Avance2135.html');
let lines = fs.readFileSync(filePath, 'utf8').split('\n');

// The issue: line 5215 is the last action button (Descargar Base de Datos)
// Line 5216 starts the first accordion button for 'categorias', STILL inside the banner
// We need to close:
//   - </button> is already there at end of 5215 line? No, button is self-closed
//   - </div>  (closes the flexWrap div at line 5182)
//   - </div>  (closes the inner flex div at line 5174)
//   - </div>  (closes the banner div at line 5172)
// Then the accordion buttons should start fresh

// 0-indexed: line 5215 is index 5214
console.log("Line 5215:", JSON.stringify(lines[5214]));  // Descargar DB button
console.log("Line 5216:", JSON.stringify(lines[5215]));  // First accordion button start

// We'll insert the closing divs AFTER line 5215 (after index 5214)
// The accordion button starts at index 5215
// Before it we need to close the flex div and banner div

// Insert 2 closing divs between line 5215 and 5216
lines.splice(5215, 0, 
  '                  </div>',  // close flexWrap buttons div (line 5182)
  '              </div>',      // close inner flex row div (line 5174)
  '           </div>',         // close banner div (line 5172)
  '            <div className="w-full space-y-4">'  // wrapper for accordions
);

// Now check: accordions need to be in their own wrapper
// Find where ViewMenu return closes to add the closing div
// The ViewMenu return's outer div closes with </div> right before );\n}
// We need to find the last line before '  );\n};' in ViewMenu
// Actually, we'll just verify the structure looks right

console.log("After splice:");
console.log("5213:", JSON.stringify(lines[5212]));
console.log("5214:", JSON.stringify(lines[5213]));
console.log("5215:", JSON.stringify(lines[5214]));
console.log("5216:", JSON.stringify(lines[5215]));
console.log("5217:", JSON.stringify(lines[5216]));
console.log("5218:", JSON.stringify(lines[5217]));
console.log("5219:", JSON.stringify(lines[5218]));
console.log("5220:", JSON.stringify(lines[5219]));

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log("\nSaved.");
