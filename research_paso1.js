const fs = require('fs');
const file = 'dashboard.html';
const lines = fs.readFileSync(file, 'utf8').split('\n');

console.log('--- RESULTADOS PASO 1 ---');

console.log('\n[1] Búsqueda de "lucide":');
lines.forEach((line, index) => {
    if (line.toLowerCase().includes('lucide')) {
        console.log(`${index + 1}: ${line.trim()}`);
    }
});

console.log('\n[2] Búsqueda de "import.*from":');
const importRegex = /import.*from/;
lines.forEach((line, index) => {
    if (importRegex.test(line)) {
        console.log(`${index + 1}: ${line.trim()}`);
    }
});

console.log('\n[3] Búsqueda de "&& [caracteres especiales]":');
// Pattern: && followed by optional whitespace and then something that isn't word, space, <, {, ", ', or (
const emojiRegex = /&&\s*[^\w\s<\{\'"\(]/;
lines.forEach((line, index) => {
    if (emojiRegex.test(line)) {
        console.log(`${index + 1}: ${line.trim()}`);
    }
});
