const fs = require('fs');
const path = 'Avance2135.html';
let content = fs.readFileSync(path, 'utf8');

console.log('Patching Avance2135.html...');

// 1. ADD SAVING useEffect
const savingUe = `
  // --- PERSISTENCIA AUTOMÁTICA ---
  React.useEffect(() => {
    localStorage.setItem('cartaya_menu_data', JSON.stringify({
      categorias, platos,
      gruposMod, opcionesMod, vinculosMod,
      recetas, inventario,
      activeCatNames, categoriasExpandidas
    }));
  }, [categorias, platos, gruposMod, opcionesMod, vinculosMod, recetas, inventario, activeCatNames, categoriasExpandidas]);
`;

const ueMarker = /React\.useEffect\(\(\) => \{[\s\S]+?localStorage\.getItem\('cartaya_menu_data'\)[\s\S]+?\}, \[\]\);/;
if (ueMarker.test(content)) {
    content = content.replace(ueMarker, (m) => m + savingUe);
    console.log('Saving useEffect added.');
}

// 2. UPDATE RESULT BANNER
const bannerStart = /<span>Categorías: \{importResult.categorias \|\| 0\}<\/span>/;
const newBanner = `<span>📚 {importResult.categorias || 0} categorías</span>
                          <span>🍽 {importResult.platos || 0} platos</span>
                          <span>⚙️ {importResult.grupos || 0} grupos</span>
                          <span>🔘 {importResult.opciones || 0} opciones</span>
                          <span>🔗 {importResult.vinculos || 0} vínculos</span>
                          <span>📋 {importResult.recetas || 0} recetas</span>
                          <span>📦 {importResult.insumos || 0} insumos</span>`;

if (bannerStart.test(content)) {
    const bannerEnd = /<span>Insumos: \{importResult.insumos \|\| 0\}<\/span>/;
    content = content.replace(/<span>Categorías: \{importResult.categorias \|\| 0\}<\/span>[\s\S]+?<span>Insumos: \{importResult.insumos \|\| 0\}<\/span>/, newBanner);
    console.log('Result banner updated.');
}

fs.writeFileSync(path, content, 'utf8');
console.log('Update complete.');
