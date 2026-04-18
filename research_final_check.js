const fs = require('fs');
const file = 'dashboard.html';
const lines = fs.readFileSync(file, 'utf8').split('\n');

console.log('--- FINAL JSX CHARACTER CHECK ---');

// Check for icons first
const iconRegex = /icon=\{([^<\{\'\"\(][^}]*)\}/;
lines.forEach((line, index) => {
    if (iconRegex.test(line)) {
        console.log(`ICON ERROR at ${index + 1}: ${line.trim()}`);
    }
});

// Check for characters after && 
const andRegex = /&&\s*[^\w\s<\{\'"\(]/;
lines.forEach((line, index) => {
    if (andRegex.test(line)) {
        console.log(`&& ERROR at ${index + 1}: ${line.trim()}`);
    }
});

// Check for characters as children of elements (this is usually fine, but let's check for weird symbols outside tags)
// Wait, the user specifically hates bare characters in expressions { ... }. 

// Scan for any other {} content that looks like a single emoji
const curlyEmojiRegex = /\{[^<\{\'\"\(][^}]*\}/;
// We'll filter this because {activeTab} is fine.
lines.forEach((line, index) => {
    const match = line.match(curlyEmojiRegex);
    if (match) {
        const content = match[0].slice(1, -1).trim();
        // If it's a single non-alphanumeric character (emoji/symbol)
        if (content.length <= 4 && !/^[a-zA-Z0-9_\.\[\]]+$/.test(content)) {
            console.log(`CURLY ERROR at ${index + 1}: ${line.trim()}`);
        }
    }
});
