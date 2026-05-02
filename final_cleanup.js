const fs = require('fs');
const content = fs.readFileSync('Avance2135.html', 'utf8');

const fixes = {
  'Ã¢Å“Â¨': '✨',
  'Ã¢Ëœâ€¦': '★',
  'ÃƒÅ¡': 'Ú',
  'ÃƒÂ³': 'ó',
  'ÃƒÂ¡': 'á',
  'ÃƒÂ©': 'é',
  'ÃƒÂ­': 'í',
  'ÃƒÂº': 'ú',
  'ÃƒÂ±': 'ñ',
  'Ã¢â‚¬â€': '–',
  'Ã¢â€°Â¤': '≤',
  'Ã‚Â«': '«',
  'Ã‚Â»': '»',
  'ÃƒÂ': 'Á', // A with acute (common in titles)
  'Ã¢â€ â€™': '→',
};

let result = content;
for (const [corrupt, clean] of Object.entries(fixes)) {
  result = result.split(corrupt).join(clean);
}

fs.writeFileSync('Avance2135.html', result, 'utf8');
console.log('Final string cleanup complete.');
