const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'Avance2135.html');
let content = fs.readFileSync(filePath, 'utf8');

const fixes = {
  'Ã¢Å¡Â ': '⚠️',
  'Ã¢Å“â€œ': '✓',
  'Ã¢Å“â€¦': '✅',
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
  'Ã¢Â â€œ': '🕒', // Assuming this was meant to be a clock or similar
  'Ã¢â‚¬â„¢': "'",
  'Ã¢â‚¬Å“': '"',
  'Ã¢â‚¬Â': '"',
  'Ã¢â‚¬': '—',
};

for (const [corrupt, clean] of Object.entries(fixes)) {
    content = content.split(corrupt).join(clean);
}

// Additional regex cleanup for common partial patterns
content = content.replace(/ÃƒÂ/g, 'á'); 
content = content.replace(/Ã‚Â/g, '');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully fixed mojibake in Avance2135.html');
