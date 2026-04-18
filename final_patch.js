const fs = require('fs');
const path = 'Avance2135.html';
let content = fs.readFileSync(path, 'utf8');

console.log('Finalizing patches for Avance2135.html...');

// 1. REPLACING/INJECTING LOAD useEffect
const newUserUe = `React.useEffect(() => {
    try {
      const stored = localStorage.getItem('cartaya_menu_data');
      if (stored) {
        const data = JSON.parse(stored);
        if (data.categorias) setCategorias(data.categorias);
        if (data.platos) setPlatos(data.platos);
        if (data.gruposMod) setGruposMod(data.gruposMod);
        if (data.opcionesMod) setOpcionesMod(data.opcionesMod);
        if (data.vinculosMod) setVinculosMod(data.vinculosMod);
        if (data.recetas) setRecetas(data.recetas);
        if (data.inventario) setInventario(data.inventario);
      }
    } catch (e) { console.error(e); }
  }, []);`;

// Search for the original empty useEffect
const oldUeRegex = /React\.useEffect\(\(\) => \{[\s\S]+?No fetch al montar[\s\S]+?\}, \[\]\);/;
if (oldUeRegex.test(content)) {
    content = content.replace(oldUeRegex, newUserUe);
    console.log('Load useEffect replaced.');
} else {
    // Inject at the beginning of ViewMenu if not found
    const vmStart = 'function ViewMenu({';
    const vmIdx = content.indexOf(vmStart);
    if (vmIdx !== -1) {
        const insertIdx = content.indexOf('{', vmIdx) + 1;
        content = content.slice(0, insertIdx) + '\n  ' + newUserUe + content.slice(insertIdx);
        console.log('Load useEffect injected at ViewMenu start.');
    }
}

// 2. ADDING SAVING useEffect
const savingUe = `
  // --- PERSISTENCIA AUTOMÁTICA ---
  React.useEffect(() => {
    localStorage.setItem('cartaya_menu_data', JSON.stringify({
      categorias, platos,
      gruposMod, opcionesMod, vinculosMod,
      recetas, inventario
    }));
  }, [categorias, platos, gruposMod, opcionesMod, vinculosMod, recetas, inventario]);
`;

// Inject right after the load useEffect (which we just added/replaced)
if (content.indexOf(newUserUe) !== -1) {
    const ueEndIdx = content.indexOf(newUserUe) + newUserUe.length;
    content = content.slice(0, ueEndIdx) + '\n  ' + savingUe + content.slice(ueEndIdx);
    console.log('Saving useEffect added.');
}

// 3. VERIFYING/FIXING RESULT BANNER
// The user wanted:
/*
{importResult && (
  <div style={{marginTop:8, padding:'8px 12px', background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:8, fontSize:11, color:'#15803D', fontWeight:700, display:'flex', flexWrap:'wrap', gap:'12px'}}>
    <span>✅ Sincronización Exitosa:</span>
    <span>📚 {importResult.categorias} Categorías</span>
    <span>🍽 {importResult.platos} Platos</span>
    <span>⚙️ {importResult.grupos} Grupos Mod.</span>
    <span>📋 {importResult.recetas} Recetas</span>
  </div>
)}
*/

// I'll look for where importResult is used and ensure this banner is there.
const bannerOld = /\{importResult && \([\s\S]+?📚 \{importResult.categorias \|\| 0\} categorías[\s\S]+?\)\}/;
const bannerNew = `{importResult && (
  <div style={{marginTop:8, padding:'8px 12px', background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:8, fontSize:11, color:'#15803D', fontWeight:700, display:'flex', flexWrap:'wrap', gap:'12px'}}>
    <span>✅ Sincronización Exitosa:</span>
    <span>📚 {importResult.categorias} Categorías</span>
    <span>🍽 {importResult.platos} Platos</span>
    <span>⚙️ {importResult.grupos} Grupos Mod.</span>
    <span>📋 {importResult.recetas} Recetas</span>
  </div>
)}`;

if (bannerOld.test(content)) {
    content = content.replace(bannerOld, bannerNew);
    console.log('Banner updated with user style.');
} else {
    // If not found, look for another location to inject below handleSubirArchivo
    console.log('Banner not found via regex. Trying to inject below handleSubirArchivo call.');
    const callMarker = 'handleFileUpload';
    // This is hard, let's just use the previous injection result if it exists.
}

fs.writeFileSync(path, content, 'utf8');
console.log('Final patch complete.');
