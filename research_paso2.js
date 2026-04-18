const fs = require('fs');
const file = 'dashboard.html';
const lines = fs.readFileSync(file, 'utf8').split('\n');

console.log('--- RESULTADOS PASO 2 (Búsqueda de icon={} inválido) ---');

const iconRegex = /icon=\{([^<\{\'\"\(][^}]*)\}/;
lines.forEach((line, index) => {
    if (iconRegex.test(line)) {
        console.log(`${index + 1}: ${line.trim()}`);
    }
});
