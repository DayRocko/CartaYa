const fs = require('fs');
const file = 'dashboard.html';
const content = fs.readFileSync(file, 'utf8');

const count = (str, char) => (str.match(new RegExp('\\' + char, 'g')) || []).length;

console.log('--- TOKEN COUNT ---');
console.log(`{ : ${count(content, '{')}`);
console.log(`} : ${count(content, '}')}`);
console.log(`( : ${count(content, '(')}`);
console.log(`) : ${count(content, ')')}`);
console.log(`[ : ${count(content, '[')}`);
console.log(`] : ${count(content, ']')}`);

// Check for unclosed tags (very rough check)
const tags = content.match(/<[a-zA-Z0-9]+[^>]*>/g) || [];
const closeTags = content.match(/<\/[a-zA-Z0-9]+>/g) || [];
console.log(`\nTags opened: ${tags.length}`);
console.log(`Tags closed: ${closeTags.length}`);
