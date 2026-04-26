const fs = require('fs');
let code = fs.readFileSync('Avance2135.html', 'utf8').match(/<script type="text\/babel">([\s\S]*?)<\/script>/)[1];
const babel = require('@babel/core');
try {
  let result = babel.transformSync(code, { presets: ['@babel/preset-react'] });
  fs.writeFileSync('babel_out.js', result.code);
  console.log('OK');
} catch(e) {
  console.log(e.message);
}
