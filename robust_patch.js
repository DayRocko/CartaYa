const fs = require('fs');
const path = 'Avance2135.html';
let content = fs.readFileSync(path, 'utf8');

console.log('Original length:', content.length);

// 1. REPLACING handleFileUpload
// Regex that is less sensitive to exact whitespace
const hfuRegex = /const handleFileUpload = \(e\) => \{[\s\S]+?reader\.readAsArrayBuffer\(file\);\s+\};/;

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
        String(s || '')
          .normalize('NFD')
          .replace(/[\\u0300-\\u036f]/g, '')
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, '');

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
        if (s === 'SALON') return 'SALON';
        if (s === 'DELIVERY') return 'DELIVERY';
        return 'AMBOS';
      };

      const normBool = (v) => {
        const s = String(v || '').toUpperCase().trim();
        return s === 'SI' || s === 'TRUE' || s === '1' || s === 'ACTIVA' || s === 'ACTIVO';
      };

      const catSheet = findSheet(['CATEGORIAS', 'CATEGORIA', 'CAT', 'CATEGORIES']);
      const catRows = readSheetRows(catSheet);

      const cats = catRows
        .filter(r => r['nombre'] && r['nombre'] !== '')
        .map((r, i) => {
          const tiene24h = normBool(r['disponible_24h']);
          let horario = null;
          if (!tiene24h) {
            const dias = r['dias_activos']
              ? r['dias_activos'].split(',').map(d => d.trim().toUpperCase()).filter(Boolean)
              : ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'];
            horario = {
              tipo: 'semanal',
              inicio: r['hora_inicio'] || '07:00',
              fin: r['hora_fin'] || '22:00',
              dias,
              fecha_desde: null,
              fecha_hasta: null,
            };
          }
          return {
            id: \`cat-import-\${i}\`,
            nombre: r['nombre'],
            canal: normCanal(r['canal']),
            estado: normBool(r['activa']) ? 'ACTIVA' : 'INACTIVA',
            color: r['color_hex'] || '#7C3AED',
            icono: '🍽',
            destino_impresion: r['destino_impresion'] || 'Cocina Principal',
            impuesto: r['impuesto'] || '8% Impoconsumo',
            prioridad_pos: parseInt(r['orden']) || (i + 1),
            descripcion: r['descripcion'] || '',
            horario,
            platos_count: 0,
          };
        });

      const platosSheet = findSheet(['PLATOS', 'PLATO', 'ITEMS', 'MENU', 'CARTA']);
      const platosRows = readSheetRows(platosSheet);

      const pls = platosRows
        .filter(r => r['nombre'] && r['nombre'] !== '')
        .map((r, i) => {
          const catNombre = String(r['categoria_nombre'] || '').trim();
          const catObj = cats.find(c =>
            normalize(c.nombre) === normalize(catNombre)
          );
          const precio = parseFloat(String(r['precio_venta']).replace(/[^0-9.]/g, '')) || 0;
          const costo = r['costo_produccion']
            ? parseFloat(String(r['costo_produccion']).replace(/[^0-9.]/g, ''))
            : null;
          const margen = precio > 0 && costo !== null
            ? Number((((precio - costo) / precio) * 100).toFixed(1))
            : null;

          return {
            id: \`plato-import-\${i}\`,
            nombre: r['nombre'],
            descripcion: r['descripcion_carta'] || r['descripcion'] || '',
            precio_venta: precio,
            costo_produccion: costo,
            margen_bruto: margen,
            categoria_id: catObj ? catObj.id : (cats[0] ? cats[0].id : ''),
            categoria_nombre: catNombre || (cats[0] ? cats[0].nombre : ''),
            canal: normCanal(r['canal']),
            estado: normEstado(r['estado_inicial'] || r['estado']),
            iva_pct: normBool(r['iva_aplica']) ? 19 : (normBool(r['impuesto_consumo']) ? 8 : 0),
            es_destacado: normBool(r['es_destacado']),
            tiempo_prep_min: parseInt(r['tiempo_prep_min']) || 0,
            calorias: parseInt(r['calorias']) || null,
            tags: r['tags'] || '',
            prioridad_pos: parseInt(r['orden_en_categoria']) || (i + 1),
            foto_url: r['foto_url'] || null,
            fecha_temporal_desde: null,
            fecha_temporal_hasta: null,
          };
        });

      const catsConCount = cats.map(c => ({
        ...c,
        platos_count: pls.filter(p => normalize(p.categoria_nombre) === normalize(c.nombre)).length,
      }));

      const modSheet = findSheet(['MODIFICADORES', 'MODIFICADOR', 'GRUPOS', 'GRUPOS_MOD', 'MODIFIER']);
      const modRows = readSheetRows(modSheet);

      const grupos = modRows
        .filter(r => r['nombre'] && r['nombre'] !== '')
        .map((r, i) => {
          const tipo = String(r['tipo_seleccion'] || 'UNICA').toUpperCase().trim();
          const esObligatorio = normBool(r['obligatorio']);
          let tipoFinal = tipo;
          if (!esObligatorio && tipo === 'MULTIPLE') tipoFinal = 'OPCIONAL_MULTIPLE';
          if (!esObligatorio && tipo === 'UNICA') tipoFinal = 'OPCIONAL_UNICA';

          return {
            id: \`gmod-import-\${i}\`,
            nombre: r['nombre'],
            tipo_seleccion: tipoFinal,
            obligatorio: esObligatorio,
            min_selecciones: parseInt(r['min_opciones']) || (esObligatorio ? 1 : 0),
            max_selecciones: parseInt(r['max_opciones']) || (tipo.includes('MULTIPLE') ? 5 : 1),
            estado: normBool(r['activo']) ? 'ACTIVO' : 'INACTIVO',
            descripcion: r['descripcion'] || '',
            visible_en_delivery: normBool(r['visible_en_delivery']),
            _aplica_a_platos: String(r['aplica_a_platos'] || '').trim(),
            _orden_en_plato: parseInt(r['orden_en_plato']) || (i + 1),
          };
        });

      const opSheet = findSheet(['OPCIONES_MOD', 'OPCIONES', 'OPCION', 'OPTIONS', '4_OPCIONES']);
      const opRows = readSheetRows(opSheet);

      const opciones = opRows
        .filter(r => r['nombre'] && r['nombre'] !== '')
        .map((r, i) => {
          const grupoNombre = String(r['nombre_grupo'] || r['grupo'] || '').trim();
          const grupoObj = grupos.find(g => normalize(g.nombre) === normalize(grupoNombre));
          return {
            id: \`opmod-import-\${i}\`,
            grupo_id: grupoObj ? grupoObj.id : '',
            nombre: r['nombre'],
            precio_adicional: parseFloat(String(r['precio_adicional'] || '0').replace(/[^0-9.]/g, '')) || 0,
            estado: normBool(r['es_agotado']) ? 'AGOTADO' : 'DISPONIBLE',
            descripcion: r['descripcion'] || '',
            orden: parseInt(r['orden_en_grupo']) || (i + 1),
            foto_url: r['foto_url'] || null,
          };
        });

      const vinculos = [];
      grupos.forEach(grupo => {
        const target = grupo._aplica_a_platos;
        if (!target) return;
        if (normalize(target) === 'TODOS') {
          pls.forEach((plato) => {
            vinculos.push({ plato_id: plato.id, grupo_id: grupo.id, orden_en_plato: grupo._orden_en_plato });
          });
        } else {
          target.split(',').map(s => s.trim()).forEach(nombreTarget => {
            const platoObj = pls.find(p => normalize(p.nombre) === normalize(nombreTarget));
            if (platoObj) {
              vinculos.push({ plato_id: platoObj.id, grupo_id: grupo.id, orden_en_plato: grupo._orden_en_plato });
            }
          });
        }
      });

      const recSheet = findSheet(['RECETAS', 'RECETA', 'RECIPE', 'INGREDIENTES', '5_RECETAS']);
      const recRows = readSheetRows(recSheet);

      const recs = recRows
        .filter(r => r['nombre_plato'] && r['ingrediente_nombre'])
        .map((r, i) => ({
          id: \`rec-import-\${i}\`,
          nombre_plato: String(r['nombre_plato']).trim(),
          ingrediente_nombre: String(r['ingrediente_nombre']).trim(),
          cantidad: parseFloat(r['cantidad']) || 0,
          unidad_medida: r['unidad_medida'] || 'und',
          costo_unitario: parseFloat(String(r['costo_unitario'] || '0').replace(/[^0-9.]/g, '')) || 0,
          proveedor: r['proveedor'] || '',
          es_critico: normBool(r['es_critico']),
          stock_minimo: parseFloat(r['stock_minimo']) || 0,
          notas: r['notas'] || '',
        }));

      const invMap = {};
      recs.forEach(r => {
        const key = normalize(r.ingrediente_nombre);
        if (!invMap[key]) {
          invMap[key] = {
            id: \`inv-import-\${key}\`,
            nombre: r.ingrediente_nombre,
            unidad_compra: r.unidad_medida,
            precio_por_unidad: r.costo_unitario,
            stock_actual: 0,
            stock_minimo_alerta: r.stock_minimo,
            proveedor: r.proveedor,
            es_critico: r.es_critico,
          };
        }
      });
      const invFinal = Object.values(invMap);

      setCategorias(catsConCount);
      setPlatos(pls);
      setGruposMod(grupos);
      setOpcionesMod(opciones);
      setVinculosMod(vinculos);
      setRecetas(recs);
      setInventario(invFinal);

      const activos = catsConCount.filter(c => c.estado === 'ACTIVA').map(c => c.nombre);
      setActiveCatNames(activos);
      setCategoriasExpandidas(activos);

      localStorage.setItem('cartaya_menu_data', JSON.stringify({
        categorias: catsConCount, platos: pls,
        gruposMod: grupos, opcionesMod: opciones, vinculosMod: vinculos,
        recetas: recs, inventario: invFinal,
        activeCatNames: activos, categoriasExpandidas: activos
      }));

      setImportResult({
        categorias: catsConCount.length, platos: pls.length,
        grupos: grupos.length, opciones: opciones.length, vinculos: vinculos.length,
        recetas: recs.length, insumos: invFinal.length
      });

    } catch (err) {
      console.error('Error al parsear Excel:', err);
      setImportError('Error: ' + err.message);
    }
    setImporting(false);
    if (e.target) e.target.value = '';
  };

  reader.onerror = () => {
    setImportError('No se pudo leer el archivo. Intenta de nuevo.');
    setImporting(false);
  };

  reader.readAsArrayBuffer(file);
};`;

if (hfuRegex.test(content)) {
    content = content.replace(hfuRegex, newHfu);
    console.log('handleFileUpload replaced via Regex.');
} else {
    console.log('handleFileUpload Regex FAILED.');
}

// 2. REPLACING localStorage useEffect
const ueRegex = /React\.useEffect\(\(\) => \{[\s\S]+?localStorage\.getItem\('cartaya_menu_data'\)[\s\S]+?\}, \[\]\);/;
const newUe = `React.useEffect(() => {
    try {
      const stored = localStorage.getItem('cartaya_menu_data');
      if (stored) {
        const data = JSON.parse(stored);
        if (data.categorias)        setCategorias(data.categorias);
        if (data.platos)            setPlatos(data.platos);
        if (data.gruposMod)         setGruposMod(data.gruposMod);
        if (data.opcionesMod)       setOpcionesMod(data.opcionesMod);
        if (data.vinculosMod)       setVinculosMod(data.vinculosMod);
        if (data.recetas)           setRecetas(data.recetas);
        if (data.inventario)        setInventario(data.inventario);
        if (data.activeCatNames)    setActiveCatNames(data.activeCatNames);
        if (data.categoriasExpandidas) setCategoriasExpandidas(data.categoriasExpandidas);
      }
    } catch (e) { console.error(e); }
  }, []);`;

if (ueRegex.test(content)) {
    content = content.replace(ueRegex, newUe);
    console.log('useEffect replaced via Regex.');
} else {
    // Maybe dashboard_2 doesn't have it yet? Let's check.
    console.log('useEffect Regex FAILED. Attempting to inject after setActiveCatNames state.');
    const stateMarker = /const \[categoriasExpandidas, setCategoriasExpandidas\] = React\.useState\(\[[\s\S]+?\]\);/;
    if (stateMarker.test(content)) {
        content = content.replace(stateMarker, (m) => m + '\n  ' + newUe);
        console.log('useEffect injected after state.');
    }
}

// 3. Status Banner
const sm5Regex = /<div style=\{\{ display: 'flex', gap: '8px' \}\}>\s+<button onClick=\{handleDescargarPlantilla\}[\s\S]+?<\/div>\s+<\/div>/;
const sm5New = `<div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={handleDescargarPlantilla} style={{ padding: '8px 16px', fontSize: '13px', border: '0.5px solid #374151', borderRadius: '6px', background: 'transparent', color: 'white', cursor: 'pointer' }}>1. Bajar Plantilla</button>
                    <button onClick={handleSubirArchivo} style={{ padding: '8px 16px', fontSize: '13px', border: 'none', borderRadius: '6px', background: '#00A066', color: 'white', cursor: 'pointer', fontWeight: 500 }}>2. Subir Archivo CSV</button>
                  </div>
                </div>

                {importError && (
                  <div style={{marginTop:'1rem', padding:'12px', borderRadius:'8px', background:'#FEF2F2', border:'1px solid #FECACA', color:'#791F1F', fontSize:14, fontWeight:700}}>
                    ⚠️ {importError}
                  </div>
                )}
                {importResult && (
                  <div style={{marginTop:'1rem', padding:'12px', border:'1px solid #BBF7D0', borderRadius:'8px', background:'#E6FAF3', color:'#085041'}}>
                    <h4 style={{margin:0, fontWeight:700, fontSize:14, marginBottom:8}}>✅ Importación Exitosa</h4>
                    <div style={{display:'flex', flexWrap:'wrap', gap:'12px', fontSize:11, fontFamily: 'monospace'}}>
                      <span>📚 {importResult.categorias} categorías</span>
                      <span>🍽 {importResult.platos} platos</span>
                      <span>⚙️ {importResult.grupos} grupos mod.</span>
                      <span>🔘 {importResult.opciones} opciones</span>
                      <span>🔗 {importResult.vinculos} vínculos</span>
                      <span>📋 {importResult.recetas} recetas</span>
                      <span>📦 {importResult.insumos} insumos</span>
                    </div>
                    <button onClick={() => { setImportResult(null); setImportError(null); }} style={{marginTop:12, width:'100%', padding:'8px', background:'#00A066', color:'white', border:'none', borderRadius:6, fontWeight:700, cursor:'pointer'}}>Ver mi carta cargada</button>
                  </div>
                )}
                {importing && (
                   <div style={{marginTop:'1rem', color:'white', fontSize:12, textAlign:'center'}}>⏳ Procesando archivo...</div>
                )}`;

if (sm5Regex.test(content)) {
    content = content.replace(sm5Regex, sm5New);
    console.log('Status banner injected.');
} else {
    console.log('Status banner Regex FAILED.');
}

console.log('Final length:', content.length);
fs.writeFileSync(path, content, 'utf8');
console.log('Update complete.');
