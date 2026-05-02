const fs = require('fs');
const content = fs.readFileSync('Avance2135.html', 'utf8');

// 1. Fix Babel deoptimization note
let result = content.replace('<script type="text/babel">', '<script type="text/babel" data-compact="false">');

// 2. Fix Mojibake
const fixes = {
  'Ã¢Å¡Â ': '⚠️',
  'Ã¢Å“â€œ': '✓',
  'Ã‚Â¿': '¿',
  'Ã‚Â¡': '¡',
  'ÃƒÂ³': 'ó',
  'ÃƒÂ¡': 'á',
  'ÃƒÂ©': 'é',
  'ÃƒÂ­': 'í',
  'ÃƒÂº': 'ú',
  'ÃƒÂ±': 'ñ',
  'Ãƒâ"': 'Ó',
  'Ãƒâ€œ': 'Ó',
  'Ãƒâ€˜': 'Ñ',
  'Ãƒâ€': 'Á',
  'Ã¢â‚¬â€': '–',
  'Ã¢â€°Â¤': '≤',
  'Ã¢â€ â€™': '→',
  'Ã¢Å“Â¨': '✨',
  'Ã¢Ëœâ€¦': '★',
  'ÃƒÅ¡': 'Ú',
  'Ã¢Å“â€': '✅',
  'Ã¢Å“â€¹': '✅',
  'Ã°Å¸â€œÂ': '📈',
  'Ã°Å¸â€œË†': '📉',
  'Ã°Å¸â€™Â°': '💰',
  'Ã°Å¸Â¤â€"': '🤔',
  'Ã°Å¸â€˜â€¹': '👋',
  'Ã°Å¸â€™Â¡': '💡',
  'Ã°Å¸â€™Â¬': '💬',
  'Ã°Å¸â€œâ€¹': '📋',
  'Ã°Å¸â€œâ€¢': '📅',
  'Ã°Å¸â€œÂ£': '📢',
  'Ã°Å¸Å'Å¸': '🌟',
  'Ã°Å¸â€™Â¥': '💥',
  'Ã°Å¸Å¡â‚¬': '🚀',
  'Ã°Å¸Â¤Â©': '🤩',
  'Ã°Å¸ÂÂ½': '🍽️',
  'Ã°Å¸Ââ€¢': '🍕',
  'Ã°Å¸ÂÂ': '🍝',
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
  'Ã¢Å“â€¦': '✅',
};

for (const [corrupt, clean] of Object.entries(fixes)) {
  result = result.split(corrupt).join(clean);
}

// Additional common patterns
result = result.replace(/ÃƒÂ/g, 'á'); // Fallback for simple 'á'
result = result.replace(/Ã‚Â/g, '');   // Clean up floating non-breaking spaces or similar artifacts

fs.writeFileSync('Avance2135.html', result, 'utf8');
console.log('Babel config and string cleanup complete.');
