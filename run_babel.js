const fs = require('fs');
let code = fs.readFileSync('Avance2135.html', 'utf8').match(/<script type=\"text\/babel\">([\s\S]*?)<\/script>/)[1];
const babel = require('@babel/core');
try {
  babel.transformSync(code, { presets: ['@babel/preset-react'] });
  console.log('OK');
} catch(e) {
  console.log(e.message);
}
