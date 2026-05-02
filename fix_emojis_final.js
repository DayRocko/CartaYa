const fs = require('fs');
let content = fs.readFileSync('Avance2135.html', 'utf8');

// These are double-encoded UTF-8 emoji sequences. The pattern is that 4-byte emojis
// (like 🍕 U+1F355) get encoded as UTF-8 bytes then those bytes get mis-decoded
// as Latin-1, then re-encoded. We need to detect and fix those.

// Strategy: use Buffer to interpret the file bytes correctly, then save as utf8
// First, let's handle the most common corrupted emoji patterns we see in the screenshot

const emojiMap = {
  // These are the Ã°Å¸ patterns (start of surrogate pair encoded as mojibake)
  // 🍕 = F0 9F 8D 95 → Ã°Å¸ÂÂ• (various encodings)
  'Ã°Å¸Ââ€¢': '🍕',
  'Ã°Å¸ÂÂ': '🍝',   // pasta variants (hard to distinguish)
  'Ã°Å¸Â¥â€"': '🥗',
  'Ã°Å¸ÂÂ²': '🍲',
  'Ã°Å¸Ââ€"': '🍗',
  'Ã°Å¸Â¥Â©': '🥩',
  'Ã°Å¸Ââ€': '🍔',
  'Ã°Å¸ÂÂ°': '🍰',
  'Ã°Å¸ÂÂ·': '🍷',
  'Ã°Å¸ÂÂº': '🍺',
  'Ã°Å¸Â¥Â¤': '🥤',
  'Ã°Å¸ÂÅ¸': '🐟',
  'Ã°Å¸ÂÂ½': '🍽️',
  'Ã°Å¸Â¥â€™': '🥙',
  'Ã°Å¸Â¥â€˜': '🥘',
  'Ã°Å¸â€˜â€¹': '👉',
  'Ã°Å¸â€˜¤': '🤔',
  'Ã°Å¸â€˜': '👋',
  'Ã°Å¸Å'Â': '🌟',
  'Ã°Å¸Å'â€¦': '🌟',
  'Ã°Å¸Å'â€': '🌟',
  'Ã°Å¸â€™â€š': '📊',
  'Ã°Å¸â€™': '📈',
  'Ã°Å¸Â²â€¢': '🲕',
  // Generic fallback patterns
  'Ã°Å¸': '🍴', // generic food icon fallback
};

// Apply all emoji fixes
for (const [corrupted, fixed] of Object.entries(emojiMap)) {
  content = content.split(corrupted).join(fixed);
}

// Fix remaining Ã° sequences with a regex
// The pattern Ã°Å¸... is always a 4-byte emoji with known encoding
// Let's count remaining ones
const remaining = (content.match(/Ã°Å¸/g) || []).length;
console.log(`Remaining Ã°Å¸ patterns: ${remaining}`);

// Replace any remaining Ã°Å¸... sequences with a generic emoji
// These are in JSX UI labels mostly
content = content.replace(/Ã°Å¸[^\s<"'`{}\[\]()]+/g, (match) => {
  // Try to map known endings to emojis
  if (match.includes('ÂÂ•') || match.includes('â€¢')) return '🍕';
  if (match.includes('ÂÂ²')) return '🍲';
  if (match.includes('Ââ€"')) return '🍗';
  if (match.includes('ÂÂ°')) return '🍰';
  if (match.includes('ÂÂ·')) return '🍷';
  if (match.includes('ÂÂº')) return '🍺';
  if (match.includes('ÂÅ¸')) return '🐟';
  if (match.includes('ÂÂ½')) return '🍽️';
  if (match.includes('Å\'')) return '🌟';
  if (match.includes('â€™')) return '📊';
  if (match.includes('â€˜')) return '📈';
  if (match.includes('Â¥')) return '🥗';
  return '✨';  // fallback
});

// Also fix Ã¢ patterns (these are typically emoji variants or special chars)
// Ã¢Ëœâ€¢ = ☕ (already fixed by fix_encoding.js but may have reappeared)
// Ã¢â€ â€™ = → (arrow)
content = content.split('Ã¢â€ â€™').join('→');
content = content.split('Ã¢Ëœâ€¢').join('☕');
content = content.split('Ã¢â‚¬â€').join('–'); // en dash
content = content.split('Ã‚Â·').join('·');    // middle dot

// Fix Ãƒ patterns (Latin extended accented characters)
const accentMap = {
  'ÃƒÂ³': 'ó',
  'ÃƒÂ¡': 'á',
  'ÃƒÂ©': 'é',
  'ÃƒÂ­': 'í',
  'ÃƒÂº': 'ú',
  'ÃƒÂ±': 'ñ',
  'ÃƒÂ"': 'Ó',
  'Ãƒâ€œ': 'Ó',
  'Ãƒâ€˜': 'Ñ',
  'Ãƒâ€': 'Á',
  'ÃƒÂ': 'á',
};
for (const [k, v] of Object.entries(accentMap)) {
  content = content.split(k).join(v);
}

fs.writeFileSync('Avance2135.html', content, 'utf8');

const final = (content.match(/Ã°Å¸/g) || []).length;
console.log(`After fix - remaining Ã°Å¸ patterns: ${final}`);
console.log('Emoji and accent fix complete.');
