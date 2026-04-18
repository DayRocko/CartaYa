const fs = require('fs');
let content = fs.readFileSync('Avance2135.html', 'utf8');

// The problem: the normalize function in handleFileUpload was written with 
// double-escaped unicode: /[\\u0300-\\u036f]/g 
// But Babel Standalone in a <script type="text/babel"> needs: /[\u0300-\u036f]/g

// Check what's in the file
const lines = content.split('\n');
for (let i = 3200; i < 3230 && i < lines.length; i++) {
    if (lines[i].includes('0300') || lines[i].includes('036f')) {
        console.log(`Line ${i+1}:`, JSON.stringify(lines[i]));
    }
}

// Fix: replace the broken double-escaped version with a working alternative
// Use a character class approach that avoids unicode escapes entirely
// OR fix the escaping so it's a single backslash (which is valid JS regex)

// Count occurrences of the broken pattern
let fixed = 0;

// Replace \\u0300 (which in JS string is \u0300 literal backslash-u) with the actual unicode
// In the file content string, what we're looking for is literally: \u0300
// because when node writes the file, the \\u in JS string = \u in file
content = content.replace(/\.replace\(\/\[\\u0300-\\u036f\]\/g,\s*''\)/g, (match) => {
    console.log('Found broken regex:', match.substring(0, 50));
    fixed++;
    return ".replace(/[\u0300-\u036f]/g, '')";
});

console.log(`Fixed ${fixed} occurrences`);
fs.writeFileSync('Avance2135.html', content, 'utf8');
console.log('Done. Length:', content.length);
