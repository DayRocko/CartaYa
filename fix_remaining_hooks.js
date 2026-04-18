const fs = require('fs');
const file = 'dashboard.html';
let content = fs.readFileSync(file, 'utf8');

const blocks = ['MenuCategoriasBlock', 'MenuPlatosBlock'];

blocks.forEach(blockName => {
    const functionStart = content.indexOf(`function ${blockName}`);
    if (functionStart !== -1) {
        // Find end of function block (rough approximation to next block or end)
        const nextBlock = content.indexOf('// --- WIDGET:', functionStart + 1);
        const endOfScript = content.indexOf('</script>', functionStart + 1);
        const functionEnd = nextBlock !== -1 && nextBlock < endOfScript ? nextBlock : endOfScript;
        
        const block = content.slice(functionStart, functionEnd);
        let newBlock = block.replace(/useState\(/g, 'React.useState(');
        newBlock = newBlock.replace(/useEffect\(/g, 'React.useEffect(');
        
        content = content.replace(block, newBlock);
        console.log(`Fixed ${blockName} hook scope.`);
    } else {
        console.warn(`${blockName} not found.`);
    }
});

fs.writeFileSync(file, content, 'utf8');
