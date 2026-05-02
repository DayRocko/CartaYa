const fs = require('fs');
const content = fs.readFileSync('Avance2135.html', 'utf8');
let lines = content.split(/\r?\n/);

// Fix line 1026 (index 1025)
lines[1025] = "    const ems = { pizza:'🍕', pasta:'🍝', spaghetti:'🍝', fettuccine:'🍝', lasagna:'🍝', ensalada:'🥗', sopa:'🍲', crema:'🍲', pollo:'🍗', carne:'🥩', lomo:'🥩', burger:'🍔', postre:'🍰', vino:'🍷', cerveza:'🍺', cafe:'☕', jugo:'🥤', agua:'💧', salmon:'🐟' };";

// Fix line 1028 (index 1027)
lines[1027] = "    for (const [k, v] of Object.entries(ems)) { if (n.includes(k)) return v; }";
lines[1028] = "    return '🍽';";

// Global replacement of any remaining corrupted regex ranges
const newContent = lines.join('\n').replace(/\.replace\(\/\[\\u0300-\\u036f\]\/g/g, ".replace(/[\\u0300-\\u036f]/g");

fs.writeFileSync('Avance2135.html', newContent, 'utf8');
console.log('Fixed line 1026 and verified regexes.');
