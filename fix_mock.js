const fs = require('fs');
let content = fs.readFileSync('Avance2135.html', 'utf8');
content = content.replace(/MOCK_LINEAS\[plato\.nombre\]/g, "(typeof MOCK_LINEAS !== 'undefined' ? MOCK_LINEAS[plato.nombre] : null)");
fs.writeFileSync('Avance2135.html', content, 'utf8');
