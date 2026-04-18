const fs = require('fs');
const file = 'dashboard.html';
let content = fs.readFileSync(file, 'utf8');

const functionStart = content.indexOf('function MenuPlatosBlock');
const nextBlock = content.indexOf('// --- WIDGET:', functionStart + 1);
const endOfScript = content.indexOf('</script>', functionStart + 1);
const functionEnd = nextBlock !== -1 && nextBlock < endOfScript ? nextBlock : endOfScript;

let block = content.slice(functionStart, functionEnd);

// Define the correct end of the component return
// We want to ensure that before line 1976/1977 (which are the end of the function)
// the main containers are closed.

// Currently at the end of the file/component we have:
// 1974:       )}
// 1975:     </div>
// 1976:   );
// 1977: }

// We need to make sure the middle part (around 1811) has the right closings for the Fragment and Ternary.

const searchPoint = '        )}\n\n      {/* MODAL FORMULARIO DE PLATO */}';
const correctPoint = '          </React.Fragment>\n        )}\n      </div>\n\n      {/* MODAL FORMULARIO DE PLATO */}';

if (block.includes(searchPoint)) {
    let newBlock = block.replace(searchPoint, correctPoint);
    content = content.replace(block, newBlock);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Successfully re-balanced MenuPlatosBlock.');
} else {
    console.error('Could not find the target anchoring point in MenuPlatosBlock.');
}
