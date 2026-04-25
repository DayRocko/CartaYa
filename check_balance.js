const fs = require('fs');
const content = fs.readFileSync('Avance2135.html', 'utf8');

const start = content.indexOf('function ViewPOS');
const end = content.indexOf('function ViewDashboard');
const posCode = content.substring(start, end);

let curly = 0;
let round = 0;
let square = 0;

for (let i = 0; i < posCode.length; i++) {
    const c = posCode[i];
    if (c === '{') curly++;
    if (c === '}') curly--;
    if (c === '(') round++;
    if (c === ')') round--;
    if (c === '[') square++;
    if (c === ']') square--;
}

console.log('Balance for ViewPOS:');
console.log('Curly:', curly);
console.log('Round:', round);
console.log('Square:', square);
