const fs = require('fs');
const file = 'dashboard.html';
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

// Line 1748 was a duplicate of 1747 (in index 1747, zero-indexed)
if (lines[1747].trim() === ') : (' && lines[1746].trim() === ') : (') {
    console.log('Duplicate ) : ( found across lines 1747 and 1748. Removing 1748.');
    lines.splice(1747, 1);
    fs.writeFileSync(file, lines.join('\n'), 'utf8');
    console.log('Fixed syntax error.');
} else {
    // If not exact lines, search and replace
    const newContent = content.replace(/\) : \(\r?\n\s*\) : \(/, ') : (');
    if (newContent !== content) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log('Fixed syntax error using regex.');
    } else {
        console.log('Could not find duplicate separator.');
    }
}
