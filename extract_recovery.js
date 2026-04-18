const fs = require('fs');
const filepath = 'C:/Users/dayro/.gemini/antigravity/brain/fe7bb225-ed03-49cf-91f8-901d68f6faac/walkthrough.md.resolved';
const text = fs.readFileSync(filepath, 'utf8');

const regex = /```diff:Avance2135\.html[\s\S]*?\n([\s\S]*?)```/g;
let match;
let count = 0;
while ((match = regex.exec(text)) !== null) {
  count++;
  console.log(`Block ${count} size: ${match[1].length}`);
  if (match[1].length > 200000) { // Should be a full file dump
    let data = match[1];
    
    // Check if it's a diff or a full copy.
    // If every line is prefixed by ' ', it's a diff format of the full file!
    if (data.startsWith('<!DOCTYPE html>')) {
         fs.writeFileSync('Avance2135.recovered.html', data);
         console.log('Successfully extracted full file from block', count);
    } else {
         console.log('Block does not start with DOCTYPE, might be a partial diff.');
    }
  }
}
