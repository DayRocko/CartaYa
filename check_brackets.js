const fs = require('fs');

async function checkBabelCompile(filename) {
    const content = fs.readFileSync(filename, 'utf8');
    
    // Extract everything between <script type="text/babel"> and </script>
    const match = content.match(/<script type="text\/babel">([\s\S]*?)<\/script>/);
    if (!match) {
        console.log('No Babel script found.');
        return;
    }
    
    const babelCode = match[1];
    console.log(`Extracted ${babelCode.length} chars of Babel code from ${filename}`);
    
    // Check basic bracket balance
    let openBraces = 0, closeBraces = 0, openParen = 0, closeParen = 0;
    for(let i=0; i<babelCode.length; i++) {
        const char = babelCode[i];
        if (char === '{') openBraces++;
        if (char === '}') closeBraces++;
        if (char === '(') openParen++;
        if (char === ')') closeParen++;
    }
    console.log(`Braces: { = ${openBraces}, } = ${closeBraces}`);
    console.log(`Parentheses: ( = ${openParen}, ) = ${closeParen}`);
    
    if (openBraces !== closeBraces) {
        console.log('⚠️ UNBALANCED BRACES: ' + (openBraces - closeBraces));
    }
    if (openParen !== closeParen) {
        console.log('⚠️ UNBALANCED PARENTHESES: ' + (openParen - closeParen));
    }
}

checkBabelCompile('Avance12Abril2026.html');
checkBabelCompile('Avance2135.html');
