const fs = require('fs');
const file = 'dashboard.html';
const lines = fs.readFileSync(file, 'utf8').split('\n');

console.log('--- RESULTADOS BÚSQUEDA MASIVA (Paso 2) ---');

console.log('\n[1] Patrones ": [carácter especial]":');
// Matches : followed by optional space then NOT (word, space, <, {, ", ', (, -, [)
// Note: [ is for arrays, ( for exprs, - for negative numbers, etc.
const colonRegex = /:\s*[^\w\s<\{\'\"\(]/;
lines.forEach((line, index) => {
    // Basic filter to ignore common CSS or non-JSX colons
    if (colonRegex.test(line) && line.includes('?') && line.includes(':')) {
        console.log(`${index + 1}: ${line.trim()}`);
    }
});

console.log('\n[2] Patrones "&& [carácter especial]":');
const andRegex = /&&\s*[^\w\s<\{\'\"\(]/;
lines.forEach((line, index) => {
    if (andRegex.test(line)) {
        console.log(`${index + 1}: ${line.trim()}`);
    }
});
