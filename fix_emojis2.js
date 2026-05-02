const fs = require('fs');
let content = fs.readFileSync('Avance2135.html', 'utf8');

// Fix any remaining corrupted emoji/mojibake sequences
// Ã°Å¸ is the start of a 4-byte emoji encoded incorrectly
content = content.replace(/\u00c3\u00b0\u00c5\u00b8[^\s<"'`{}\[\]()]+/g, (match) => {
  if (match.includes('\u00c2\u00b7')) return '\ud83c\udf77'; // 🍷
  if (match.includes('\u00c2\u00ba')) return '\ud83c\udf7a'; // 🍺
  if (match.includes('\u00c2\u00b2')) return '\ud83c\udf72'; // 🍲
  if (match.includes('\u00c2\u00b0')) return '\ud83c\udf70'; // 🍰
  if (match.includes('\u00c2\u00bd')) return '\ud83c\udf7d'; // 🍽
  if (match.includes('\u00c2\u00a5')) return '\ud83e\udd57'; // 🥗
  if (match.includes('\u00c5\u00b8')) return '\ud83d\udc1f'; // 🐟
  if (match.includes('\u00e2\u20ac\u00a2')) return '\ud83c\udf55'; // 🍕
  if (match.includes('\u00e2\u20ac\u201d')) return '\ud83c\udf57'; // 🍗
  if (match.includes('\u00e2\u20ac ')) return '\ud83c\udf54';      // 🍔
  if (match.includes('\u00c5\u2019')) return '\ud83c\udf1f'; // 🌟
  if (match.includes('\u00e2\u20ac\u2122')) return '\ud83d\udcca'; // 📊
  if (match.includes('\u00e2\u20ac\u02dc')) return '\ud83d\udcc8'; // 📈
  if (match.includes('\u201a')) return '\ud83d\udc49';  // 👉
  return '\u2728'; // ✨ fallback
});

// Fix Ã¢ patterns
content = content.split('\u00c3\u00a2\u00e2\u20ac \u00e2\u20ac\u2122').join('\u2192'); // →
content = content.split('\u00c3\u00a2\u00cb\u0153\u00e2\u20ac\u00a2').join('\u2615'); // ☕
content = content.split('\u00c3\u00a2\u00e2\u201a\u00ac\u00e2\u20ac\u201d').join('\u2013'); // –
content = content.split('\u00c3\u201a\u00c2\u00b7').join('\u00b7'); // ·

// Fix remaining ÃƒÂ patterns (accents)
const accentFixes = [
  ['\u00c3\u0192\u00c2\u00b3', '\u00f3'],  // ó
  ['\u00c3\u0192\u00c2\u00a1', '\u00e1'],  // á
  ['\u00c3\u0192\u00c2\u00a9', '\u00e9'],  // é
  ['\u00c3\u0192\u00c2\u00ad', '\u00ed'],  // í
  ['\u00c3\u0192\u00c2\u00ba', '\u00fa'],  // ú
  ['\u00c3\u0192\u00c2\u00b1', '\u00f1'],  // ñ
];
for (const [k, v] of accentFixes) {
  content = content.split(k).join(v);
}

const remaining = (content.match(/\u00c3\u00b0\u00c5\u00b8/g) || []).length;
console.log('Remaining corrupted emojis:', remaining);

fs.writeFileSync('Avance2135.html', content, 'utf8');
console.log('Done.');
