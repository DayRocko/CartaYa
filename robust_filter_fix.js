const fs = require('fs');
const file = 'dashboard.html';
if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    const newFilter = `const platosDeCategoria = platos.filter(p => {
    const campoCategoria = p.categoria_nombre || p.categoria || p.category || p.categoria_id || '';
    const nombreCategoria = categoria.nombre || categoria.name || '';
    return campoCategoria.toString().trim().toLowerCase() === nombreCategoria.toString().trim().toLowerCase();
  });`;

    const oldFilterRegex = /const platosDeCategoria = platos.filter\(p =>[\s\S]*?p\.categoria_nombre === categoria\.nombre \|\| p\.categoria === categoria\.nombre[\s\S]*?\);/;

    if (oldFilterRegex.test(content)) {
        content = content.replace(oldFilterRegex, newFilter);
        fs.writeFileSync(file, content);
        console.log('Successfully updated to robust filter.');
    } else {
        console.log('Old filter not found.');
    }
} else {
    console.log('File not found: ' + file);
}
