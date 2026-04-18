const fs = require('fs');
const file = 'dashboard.html';
let lines = fs.readFileSync(file, 'utf8').split('\n');

// Wrap the 'else' branch of the ternary in MenuPlatosBlock with a Fragment
// Line 1747/1748 is the start of the 'else' branch: ) : (
// Line 1875 is the end of the branch: )}

lines[1747] = '        ) : (';
lines[1748] = '          <React.Fragment>';

// Need to find where to put the closing fragment tag.
// It should be right before the main ternary closing.
// Line 1874 is blank, 1875 is )}.
lines[1873] = '        )}'; // closes table view
lines[1874] = '          </React.Fragment>';
lines[1875] = '        )}'; // closes main ternary

fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('Fixed JSX Fragment wrap in MenuPlatosBlock.');
