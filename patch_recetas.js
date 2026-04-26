const fs = require('fs');

let content = fs.readFileSync('Avance2135.html', 'utf8');

// 1. In handleFileUpload, find where recs is parsed and insert the new extraction logic.
const insertionPoint = `        const recs = rowsRec.filter(r => r.plato || r.ingrediente).map((r, i) => ({`;
const newExtractionLogic = `        // --- LÓGICA DE EXTRACCIÓN HOJA 5_RECETAS ---
        const normalizeSheet = (s) => String(s || '').normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').toUpperCase().replace(/[^A-Z0-9]/g, '');

        const sheetName = wb.SheetNames.find(n =>
          normalizeSheet(n).includes('RECETA') ||
          normalizeSheet(n).includes('5RECETA') ||
          normalizeSheet(n).includes('RECETAS')
        );

        const readSheetRows = (sheet) => {
          if (!sheet) return {};
          const raw = window.XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
          if (!raw || raw.length < 3) return {};

          const dataRows = raw.slice(2);
          const platoData = {};

          dataRows.forEach((row) => {
            const nombrePlato = String(row[0] || '').trim();
            if (!nombrePlato) return;

            const colQ = row[16];
            const colR = row[17];
            const colS = row[18];
            const colT = row[19];

            const tieneValor = colQ !== '' && colQ !== null && colQ !== undefined && !isNaN(parseFloat(colQ));

            if (tieneValor && !platoData[nombrePlato]) {
              platoData[nombrePlato] = {
                costoMateriaPrima:         parseFloat(colQ) || 0,
                margenBrutoPctPromedio:    parseFloat(colR) || 0,
                precioVentaSugerido:       parseFloat(colS) || 0,
                margenBrutoPesos:          parseFloat(colT) || 0,
              };
            }
          });

          return platoData;
        };

        const platoData = readSheetRows(sheetName ? wb.Sheets[sheetName] : null);

        // Enriquecer platos
        const platosEnriquecidos = pls.map((plato) => {
          const receta = platoData[plato.nombre] || null;
          return {
            ...plato,
            costo_materia_prima:       receta ? receta.costoMateriaPrima       : null,
            margen_bruto_pct_promedio: receta ? receta.margenBrutoPctPromedio   : null,
            precio_venta_sugerido:     receta ? receta.precioVentaSugerido      : null,
            margen_bruto_pesos:        receta ? receta.margenBrutoPesos         : null,
            tiene_receta:              receta !== null,
          };
        });

        const recs = rowsRec.filter(r => r.plato || r.ingrediente).map((r, i) => ({`;

content = content.replace(insertionPoint, newExtractionLogic);

// 2. Update setPlatos to use platosEnriquecidos
content = content.replace(`if (pls.length > 0) setPlatos(pls);`, `if (platosEnriquecidos.length > 0) setPlatos(platosEnriquecidos);`);

// 3. Replace the alert message
const oldAlertStr = "alert(`✅ ¡Importación Exitosa!\\n\\nSe cargaron:\\n- ${cats.length} Categorías\\n- ${pls.length} Platos\\n- ${recs.length} Líneas de Receta\\n- ${newInv.length} Insumos de Inventario\\n- ${grupos.length} Grupos de Modificadores`);";
const newAlertStr = `const platosConReceta = platosEnriquecidos.filter(p => p.tiene_receta).length;
        const platosSinReceta = platosEnriquecidos.filter(p => !p.tiene_receta).length;
        alert(\`✅ Importación exitosa:\\n  📚 \${cats.length} categorías\\n  🍽 \${platosEnriquecidos.length} platos\\n  📋 \${Object.keys(platoData).length} platos con receta y análisis de margen\\n  ⚠️ \${platosSinReceta} platos sin receta registrada en 5_RECETAS\`);`;

content = content.replace(oldAlertStr, newAlertStr);


// 4. Update platosEnriquecidos mapping inside MenuRecetasBlock
const oldMapBlock = `  const platosEnriquecidos = (platos || []).map(plato => {
    const pNorm = norm(plato.nombre);
    const unaReceta = (recetas || []).find(r => 
      r.nombre_plato && norm(r.nombre_plato) === pNorm && r.costo_por_plato > 0
    );
    
    const tieneCualquierReceta = (recetas || []).some(r => r.nombre_plato && norm(r.nombre_plato) === pNorm);
    
    const costoMP = unaReceta ? unaReceta.costo_por_plato : null;
    const margenPctProm = unaReceta ? unaReceta.margen_plato_pct : null;
    const pvpSugerido = unaReceta ? unaReceta.pvp_sugerido_plato : null;
    const margenBrutoPesos = unaReceta ? unaReceta.margen_plato_pesos : null;

    return { 
      ...plato, 
      tieneReceta: tieneCualquierReceta, 
      costoMP, 
      margenPctProm, 
      pvpSugerido, 
      margenBrutoPesos,
      alertaState: tieneCualquierReceta ? 'sync' : 'no_registrado',
      fugaMsg: tieneCualquierReceta ? '' : 'Consumo no registrado'
    };
  });`;

const newMapBlock = `  const formatCOP = (val) => {
    const n = parseFloat(val);
    if (isNaN(n) || val === null) return '—';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(n);
  };

  const formatPct = (val) => {
    const n = parseFloat(val);
    if (isNaN(n) || val === null) return '—';
    return (n * 100).toFixed(1) + '%';
  };

  const platosEnriquecidos = (platos || []).map(plato => {
    return { 
      ...plato, 
      tieneReceta: plato.tiene_receta || false, 
      costoMP: plato.costo_materia_prima !== null ? plato.costo_materia_prima : null, 
      margenPctProm: plato.margen_bruto_pct_promedio !== null ? plato.margen_bruto_pct_promedio * 100 : null, 
      pvpSugerido: plato.precio_venta_sugerido !== null ? plato.precio_venta_sugerido : null, 
      margenBrutoPesos: plato.margen_bruto_pesos !== null ? plato.margen_bruto_pesos : null,
      alertaState: plato.tiene_receta ? 'sync' : 'no_registrado',
      fugaMsg: plato.tiene_receta ? '' : 'Sin receta registrada en 5_RECETAS'
    };
  });`;

content = content.replace(oldMapBlock, newMapBlock);

// 5. Update Table Rendering in MenuRecetasBlock
// We must exactly match the existing table JSX
const oldTableRender = `{/* COSTO MATERIA PRIMA */}
                      <td className="px-4 py-3">
                        {plato.costoMP > 0 
                          ? <span className="font-bold text-slate-700 text-sm">\${plato.costoMP.toLocaleString('es-CO')}</span>
                          : <span style={{color:'#D1D5DB',fontWeight:700}}>—</span>
                        }
                      </td>
                      {/* MARGEN % PROMEDIO */}
                      <td className="px-4 py-3 text-center">
                        {plato.margenPctProm > 0
                          ? <span className="font-black text-sm px-3 py-1 rounded-lg" style={{background: ms.bg, color: ms.color, border:\`1px solid \${ms.border}\`}}>{plato.margenPctProm}%</span>
                          : <span style={{color:'#D1D5DB',fontWeight:700}}>—</span>
                        }
                      </td>
                      {/* PRECIO VENTA SUGERIDO */}
                      <td className="px-4 py-3 text-right">
                        <span className="font-black text-slate-900 text-sm">\${(plato.pvpSugerido||0).toLocaleString('es-CO')}</span>
                      </td>
                      {/* MARGEN PESOS */}
                      <td className="px-4 py-3 text-right">
                        <span className="font-bold text-slate-700 text-sm">\${(plato.margenBrutoPesos||0).toLocaleString('es-CO')}</span>
                      </td>`;

// Wait! In the actual file it's:
// <span style={{color:'#D1D5DB',fontWeight:700}}>ÔÇö</span>
// So I should replace using a more robust regex or exact replacement since reading UTF-16 may have produced encoding issues like ÔÇö.

fs.writeFileSync('Avance2135.html', content, 'utf8');
console.log('Patch step 1 complete.');
