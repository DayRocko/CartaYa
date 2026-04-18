const fs = require('fs');
const babel = require('@babel/standalone');

const content = fs.readFileSync('Avance2135.html', 'utf8');
const match = content.match(/<script type="text\/babel">([\s\S]*?)<\/script>/);

if (match) {
    console.log('Compiling with Babel...');
    try {
        babel.transform(match[1], { presets: ['react'] });
        console.log('✅ Babel compilation SUCCESS!');
    } catch (err) {
        console.error('❌ Babel compile ERROR:');
        console.error(err.message);
        if (err.loc) {
            console.error(`at line ${err.loc.line}, column ${err.loc.column}`);
            const lines = match[1].split('\n');
            console.error('Code snippet:');
            for(let i=Math.max(0, err.loc.line - 3); i <= Math.min(lines.length-1, err.loc.line + 2); i++) {
                if (i === err.loc.line - 1) {
                    console.error('>> ' + lines[i]);
                } else {
                    console.error('   ' + lines[i]);
                }
            }
        }
    }
} else {
    console.log('No babel script tag found.');
}
