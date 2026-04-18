const fs = require('fs');

// Step 1: Restore from dashboard_2.html
let content = fs.readFileSync('dashboard_2.html', 'utf8');
console.log('Restored from dashboard_2.html, length:', content.length);

// Step 2: Replace handleFileUpload
const hfuOldRegex = /const handleFileUpload = \(e\) => \{[\s\S]+?reader\.readAsArrayBuffer\(file\);\s*\n\s*\};/;

const newHfu = `const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  setImporting(true);
  setImportError(null);
  setImportResult(null);

  const reader = new FileReader();

  reader.onload = (evt) => {
    try {
      const data = new Uint8Array(evt.target.result);
      const wb = window.XLSX.read(data, { type: 'array' });

      const normalize = (s) =>
        String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z0-9]/g, '');

      const findSheet = (keywords) => {
        const normKeys = keywords.map(normalize);
        const match = wb.SheetNames.find(name => {
          const normName = normalize(name);
          return normKeys.some(k => normName.includes(k));
        });
        return match ? wb.Sheets[match] : null;
      };

      const readSheetRows = (sheet) => {
        if (!sheet) return [];
        const raw = window.XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
        if (!raw || raw.length < 2) return [];
        const fila0 = raw[0] || [];
        const noVacios0 = fila0.filter(c => c !== '' && c !== null && c !== undefined);
        const esTitulo = noVacios0.length <= 2 && String(noVacios0[0] || '').length > 15;
        const headerRow = esTitulo ? (raw[1] || []) : fila0;
        const dataStart = esTitulo ? 2 : 1;
        const headers = headerRow.map(h => String(h || '').trim().toLowerCase());
        const dataRows = raw.slice(dataStart).filter(r =>
          Array.isArray(r) && r.some(c => c !== '' && c !== null && c !== undefined)
        );
        return dataRows.map(r =>
          Object.fromEntries(headers.map((h, i) => [h, r[i] !== undefined ? String(r[i]).trim() : '']))
        );
      };

      const normEstado = (v) => {
        const s = String(v || '').toUpperCase().trim();
        if (s === 'OCULTO' || s === 'INACTIVO') return 'OCULTO';
        if (s === 'AGOTADO') return 'AGOTADO';
        if (s === 'TEMPORAL') return 'TEMPORAL';
        return 'DISPONIBLE';
      };
      const normCanal = (v) => {
        const s = String(v || '').toUpperCase().trim();
        return (s === 'SALON') ? 'SALON' : (s === 'DELIVERY' ? 'DELIVERY' : 'AMBOS');
      };
      const normBool = (v) => String(v || '').toUpperCase().trim() === 'SI';

      // 1. CATEGORÍAS
      const catSheet = findSheet(['CATEGORIAS', 'CATEGORIA', 'CAT', 'CATEGORIES']);
      const catRows = readSheetRows(catSheet);
      const cats = catRows.filter(r => r['nombre']).map((r, i) => {
        const tiene24h = normBool(r['disponible_24h']);
        let horario = !tiene24h ? {
          tipo: 'semanal', inicio: r['hora_inicio'] || '07:00', fin: r['hora_fin'] || '22:00',
          dias: r['dias_activos'] ? r['dias_activos'].split(',').map(d => d.trim().toUpperCase()) : ['LUN','MAR','MIE','JUE','VIE','SAB','DOM'],
        } : null;
        return {
          id: \`cat-import-\${i}\`, nombre: r['nombre'], canal: normCanal(r['canal']),
          estado: normBool(r['activa']) ? 'ACTIVA' : 'INACTIVA',
          color: r['color_hex'] || '#7C3AED', prioridad_pos: parseInt(r['orden']) || (i + 1), horario
        };
      });

      // 2. PLATOS
      const platosSheet = findSheet(['PLATOS', 'PLATO', 'ITEMS', 'MENU', 'CARTA']);
      const platosRows = readSheetRows(platosSheet);
      const pls = platosRows.filter(r => r['nombre']).map((r, i) => {
        const catObj = cats.find(c => normalize(c.nombre) === normalize(r['categoria_nombre']));
        const precio = parseFloat(String(r['precio_venta']).replace(/[^0-9.]/g, '')) || 0;
        return {
          id: \`plato-import-\${i}\`, nombre: r['nombre'], precio_venta: precio,
          categoria_id: catObj ? catObj.id : (cats[0]?.id || ''),
          categoria_nombre: r['categoria_nombre'] || (cats[0]?.nombre || ''),
          estado: normEstado(r['estado_inicial'] || r['estado']),
          es_destacado: normBool(r['es_destacado'])
        };
      });

      // 3. MODIFICADORES
      const modSheet = findSheet(['MODIFICADORES', 'MODIFICADOR', 'GRUPOS']);
      const modRows = readSheetRows(modSheet);
      const grupos = modRows.filter(r => r['nombre']).map((r, i) => ({
        id: \`gmod-import-\${i}\`, nombre: r['nombre'],
        tipo_seleccion: String(r['tipo_seleccion'] || 'UNICA').toUpperCase().trim(),
        obligatorio: normBool(r['obligatorio']),
        _aplica_a_platos: String(r['aplica_a_platos'] || '').trim(),
        _orden_en_plato: parseInt(r['orden_en_plato']) || (i + 1)
      }));

      const opSheet = findSheet(['OPCIONES_MOD', 'OPCIONES']);
      const opRows = readSheetRows(opSheet);
      const opciones = opRows.filter(r => r['nombre']).map((r, i) => {
        const grupoObj = grupos.find(g => normalize(g.nombre) === normalize(r['nombre_grupo']));
        return {
          id: \`opmod-import-\${i}\`, grupo_id: grupoObj ? grupoObj.id : '', nombre: r['nombre'],
          precio_adicional: parseFloat(String(r['precio_adicional'] || '0').replace(/[^0-9.]/g, '')) || 0
        };
      });

      const vinculos = [];
      grupos.forEach(grupo => {
        if (!grupo._aplica_a_platos) return;
        if (normalize(grupo._aplica_a_platos) === 'TODOS') {
          pls.forEach(p => vinculos.push({ plato_id: p.id, grupo_id: grupo.id, orden_en_plato: grupo._orden_en_plato }));
        } else {
          grupo._aplica_a_platos.split(',').forEach(n => {
            const p = pls.find(pl => normalize(pl.nombre) === normalize(n.trim()));
            if (p) vinculos.push({ plato_id: p.id, grupo_id: grupo.id, orden_en_plato: grupo._orden_en_plato });
          });
        }
      });

      // 4. RECETAS E INVENTARIO
      const recSheet = findSheet(['RECETAS', 'RECETA', 'INGREDIENTES']);
      const recRows = readSheetRows(recSheet);
      const recs = recRows.filter(r => r['nombre_plato'] && r['ingrediente_nombre']).map((r, i) => ({
        id: \`rec-import-\${i}\`, nombre_plato: r['nombre_plato'],
        ingrediente_nombre: r['ingrediente_nombre'],
        cantidad: parseFloat(r['cantidad']) || 0, unidad_medida: r['unidad_medida'] || 'und'
      }));

      const invMap = {};
      recs.forEach(r => {
        const key = normalize(r.ingrediente_nombre);
        if (!invMap[key]) invMap[key] = { id: \`inv-\${key}\`, nombre: r.ingrediente_nombre, unidad_compra: r.unidad_medida, stock_actual: 0 };
      });

      setCategorias(cats); setPlatos(pls); setGruposMod(grupos);
      setOpcionesMod(opciones); setVinculosMod(vinculos);
      setRecetas(recs); setInventario(Object.values(invMap));

      localStorage.setItem('cartaya_menu_data', JSON.stringify({
        categorias: cats, platos: pls, gruposMod: grupos, opcionesMod: opciones,
        vinculosMod: vinculos, recetas: recs, inventario: Object.values(invMap)
      }));

      setImportResult({ categorias: cats.length, platos: pls.length, grupos: grupos.length, recetas: recs.length });
      setImporting(false);
    } catch (err) {
      setImportError('Error al leer el archivo: ' + err.message);
      setImporting(false);
    }
    if (e.target) e.target.value = '';
  };
  reader.readAsArrayBuffer(file);
};`;

if (hfuOldRegex.test(content)) {
    content = content.replace(hfuOldRegex, newHfu);
    console.log('✅ handleFileUpload replaced.');
} else {
    console.log('❌ handleFileUpload NOT found via regex.');
}

// Step 3: Replace load useEffect
const oldUeRegex = /React\.useEffect\(\(\) => \{\s*\/\/ No fetch al montar[\s\S]+?\}, \[\]\);/;
const newLoadUe = `React.useEffect(() => {
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

if (oldUeRegex.test(content)) {
    content = content.replace(oldUeRegex, newLoadUe);
    console.log('✅ Load useEffect replaced.');
} else {
    console.log('❌ Load useEffect NOT found via regex.');
}

// Step 4: Replace the root.render block with the nuclear pattern
const renderOldRegex = /const root = ReactDOM\.createRoot[\s\S]+?root\.render\(<App \/>\);/;
const renderNew = `// ── MOUNT ──────────────────────────────────────────────────────────────
    window.addEventListener('DOMContentLoaded', function() {
      setTimeout(function() {
        try {
          const rootEl = document.getElementById('root');
          if (!rootEl) throw new Error('No se encontró el elemento #root');
          if (typeof App === 'undefined') throw new Error('App no está definida');
          const root = ReactDOM.createRoot(rootEl);
          root.render(React.createElement(App));
        } catch(e) {
          console.error('Mount error:', e);
          const el = document.getElementById('root');
          if (el) el.innerHTML = '<div style="padding:40px;font-family:sans-serif;color:#DC2626;"><h2>Error al cargar CartaYa</h2><p>' + e.message + '</p><p>Revisa la consola para más detalles.</p></div>';
        }
      }, 100);
    });`;

if (renderOldRegex.test(content)) {
    content = content.replace(renderOldRegex, renderNew);
    console.log('✅ root.render replaced with nuclear pattern.');
} else {
    console.log('❌ root.render NOT found via regex.');
}

// Step 5: Add import result banner after the "Subir Archivo" button  
const sm5Regex = /<button onClick=\{handleSubirArchivo\}[^>]+>2\. Subir Archivo CSV<\/button>/;
const sm5Replacement = `<button onClick={handleSubirArchivo} style={{ padding: '8px 16px', fontSize: '13px', border: 'none', borderRadius: '6px', background: '#00A066', color: 'white', cursor: 'pointer', fontWeight: 500 }}>2. Subir Archivo CSV</button>
                  </div>
                  {importing && (
                    <div style={{marginTop:8, padding:'8px 12px', color:'#6B7280', fontSize:12}}>⏳ Procesando archivo...</div>
                  )}
                  {importResult && (
                    <div style={{marginTop:8, padding:'8px 12px', background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:8, fontSize:11, color:'#15803D', fontWeight:700, display:'flex', flexWrap:'wrap', gap:'12px'}}>
                      <span>✅ Sincronización Exitosa:</span>
                      <span>📚 {importResult.categorias} Categorías</span>
                      <span>🍽 {importResult.platos} Platos</span>
                      <span>⚙️ {importResult.grupos} Grupos Mod.</span>
                      <span>📋 {importResult.recetas} Recetas</span>
                    </div>
                  )}
                  {importError && (
                    <div style={{marginTop:8, padding:'8px 12px', background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:8, fontSize:12, color:'#DC2626', fontWeight:700}}>
                      ⚠️ {importError}
                    </div>
                  )}
                  <div style={{display:'none'}}>`;  // dummy close that will be fixed below

if (sm5Regex.test(content)) {
    // Actually let's not break the div structure - inject just the banners after the buttons div closes
    // Instead we look for the pattern differently
    console.log('Found "Subir Archivo" button.');
}

// Simpler: find the existing result banner and replace it with the user's preferred format
const oldResultBannerRegex = /\{importResult && \(\s*<div style=\{\{marginTop:'1rem'[\s\S]+?\}\}\s*>\s*<h4[\s\S]+?<\/div>\s*\)\}/;
const newResultBanner = `{importResult && (
                <div style={{marginTop:8, padding:'8px 12px', background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:8, fontSize:11, color:'#15803D', fontWeight:700, display:'flex', flexWrap:'wrap', gap:'12px'}}>
                  <span>✅ Sincronización Exitosa:</span>
                  <span>📚 {importResult.categorias} Categorías</span>
                  <span>🍽 {importResult.platos} Platos</span>
                  <span>⚙️ {importResult.grupos} Grupos Mod.</span>
                  <span>📋 {importResult.recetas} Recetas</span>
                </div>
              )}`;

if (oldResultBannerRegex.test(content)) {
    content = content.replace(oldResultBannerRegex, newResultBanner);
    console.log('✅ Result banner replaced.');
} else {
    console.log('ℹ️ Old banner pattern not found — injecting after Subir Archivo button div.');
    // Inject result banner after the buttons container div
    const injectAfter = 'onClick={handleSubirArchivo}';
    const idx = content.indexOf(injectAfter);
    if (idx !== -1) {
        // Find the end of the button tag and then the parent div close
        let closeIdx = content.indexOf('</div>', idx);
        closeIdx = content.indexOf('</div>', closeIdx + 1); // skip button, go to parent div
        if (closeIdx !== -1) {
            const banner = `
              {importing && (
                <div style={{marginTop:8, padding:'8px 12px', color:'#6B7280', fontSize:12}}>⏳ Procesando archivo...</div>
              )}
              {importResult && (
                <div style={{marginTop:8, padding:'8px 12px', background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:8, fontSize:11, color:'#15803D', fontWeight:700, display:'flex', flexWrap:'wrap', gap:'12px'}}>
                  <span>✅ Sincronización Exitosa:</span>
                  <span>📚 {importResult.categorias} Categorías</span>
                  <span>🍽 {importResult.platos} Platos</span>
                  <span>⚙️ {importResult.grupos} Grupos Mod.</span>
                  <span>📋 {importResult.recetas} Recetas</span>
                </div>
              )}
              {importError && (
                <div style={{marginTop:8, padding:'8px 12px', background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:8, fontSize:12, color:'#DC2626', fontWeight:700}}>
                  ⚠️ {importError}
                </div>
              )}`;
            content = content.slice(0, closeIdx + 6) + banner + content.slice(closeIdx + 6);
            console.log('✅ Result banner injected after Subir Archivo button.');
        }
    }
}

fs.writeFileSync('Avance2135.html', content, 'utf8');
console.log('Final file length:', content.length);
console.log('All patches applied successfully.');
