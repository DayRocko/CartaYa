const fs = require('fs');
const file = 'dashboard.html';
const content = fs.readFileSync(file, 'utf8');
const newContent = content.replace(/React\.React\./g, 'React.');
fs.writeFileSync(file, newContent, 'utf8');
console.log('Fixed all duplicate React prefixes.');
