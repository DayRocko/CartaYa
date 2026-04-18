const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'Avance2135.html');
const lines = fs.readFileSync(file, 'utf8').split('\n');
console.log(JSON.stringify(lines[5490]));
console.log(JSON.stringify(lines[5491]));
console.log(JSON.stringify(lines[5492]));
