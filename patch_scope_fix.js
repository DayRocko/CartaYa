const fs = require('fs');
let content = fs.readFileSync('Avance2135.html', 'utf8');

// ─── SECTION TO REPLACE ──────────────────────────────────────────────────────
// From "3. IMPORTAR RECETAS E INVENTARIO" all the way through
// "const recs = rowsRec..." block ending with  stock_actual: ...  }));
// We replace it with the full new logic that ALSO defines platosEnriquecidos and platoData

const oldBlock = `        // 3. IMPORTAR RECETAS E INVENTARIO (CORAZÓN DEL SUBMÓDULO)
        const sRec = findSheet(['RECETAS', 'RECETA', 'INGREDIENTES', '5_']);
        let rowsRec = readSheetRobust(sRec, 'receta');
        
        // Fallback especial para la plantilla "5_RECETAS" si no detectó encabezados por el diseño de celdas combinadas
        const normalizeSheet = (s) => String(s || '').normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').toUpperCase().replace(/[^A-Z0-9]/g, '');

        const sheetName = wb.SheetNames.find(n =>
          normalizeSheet(n).includes('RECETA') ||
          normalizeSheet(n).includes('5RECETA') ||
          normalizeSheet(n).includes('RECETAS')
        );

        const readSheetRows = (sheet) => {
          if (!sheet) return { platoData: {}, nuevasRecetas: [] };
          const raw = window.XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
          if (!raw || raw.length < 4) return { platoData: {}, nuevasRecetas: [] };

          const dataRows = raw.slice(3); // Los datos comienzan en la fila 4 (índice 3)
          const platoData = {};
          const nuevasRecetas = [];
          let currentPlato = '';

          dataRows.forEach((row, i) => {
            const colA = String(row[0] || '').trim(); // Columna A: Plato
            if (colA) {
              currentPlato = colA; // Actualiza el plato activo para agrupar ingredientes
            }

            // 1. Extraer Análisis Financiero del Plato (Columnas Q, R, S, T)
            const colQ = row[16];
            const colR = row[17];
            const colS = row[18];
            const colT = row[19];

            const tieneValorQ = colQ !== '' && colQ !== null && colQ !== undefined && !isNaN(parseFloat(colQ));

            if (tieneValorQ && currentPlato && !platoData[currentPlato]) {
              platoData[currentPlato] = {
                costoMateriaPrima:         parseFloat(colQ) || 0,
                margenBrutoPctPromedio:    parseFloat(colR) || 0,
                precioVentaSugerido:       parseFloat(colS) || 0,
                margenBrutoPesos:          parseFloat(colT) || 0,
              };
            }

            // 2. Extraer Ingredientes del Plato
            const ingrediente = String(row[1] || '').trim(); // Columna B: Ingrediente
            if (ingrediente && currentPlato) {
              nuevasRecetas.push({
                id: \`rec-\${Date.now()}-\${i}\`,
                nombre_plato: currentPlato,
                ingrediente_nombre: ingrediente,
                cantidad: parseNum(row[10]), // Columna K: Cantidad (Porción)
                unidad_medida: row[11] || 'g', // Columna L: Unidad de Medida
                subtotal_costo: parseNum(row[12]), // Columna M: Subtotal Costo Materia Prima
                costo_por_plato: tieneValorQ ? parseFloat(colQ) : 0,
                margen_plato_pct: tieneValorQ ? parseFloat(colR) * 100 : 0,
                pvp_sugerido_plato: tieneValorQ ? parseFloat(colS) : 0,
                margen_plato_pesos: tieneValorQ ? parseFloat(colT) : 0,

                // Atributos solicitados por el usuario para cada ingrediente
                margen_ingrediente_pct: parseNum(row[13]) * (String(row[13]).includes('%') ? 1 : 100), // Columna N: Margen Bruto %
                pvp_sugerido_ing: parseNum(row[14]), // Columna O: Precio de Venta Sugerido (Sin IVA)
                margen_bruto_pesos_ing: parseNum(row[15]), // Columna P: Margen Bruto Pesos
                
                // Mapeo adicional para el inventario (para no romper la integración existente)
                proveedor: row[2] || '', // Columna C
                stock_minimo: parseNum(row[3]), // Columna D
                unidad_compra: row[4] || 'kg', // Columna E (Presentación de compra)
                costo_unitario: parseNum(row[9]), // Columna J (Costo Unitario Base)
                stock_actual: parseNum(row[5]) || 0 // Columna F (Cantidad)
              });
            }
          });

          return { platoData, nuevasRecetas };
        };

        const { platoData, nuevasRecetas: recs } = readSheetRows(sheetName ? wb.Sheets[sheetName] : null);

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
        });`;

const newBlock = `        // 3. IMPORTAR RECETAS E INVENTARIO (CORAZÓN DEL SUBMÓDULO)
        // Buscar la hoja de recetas con normalización flexible
        const normalizeSheet = (s) => String(s || '').normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').toUpperCase().replace(/[^A-Z0-9]/g, '');
        const sheetName = wb.SheetNames.find(n =>
          normalizeSheet(n).includes('RECETA') || normalizeSheet(n).includes('5RECETA')
        );
        const sRec = sheetName ? wb.Sheets[sheetName] : findSheet(['RECETAS', 'RECETA', 'INGREDIENTES', '5_']);

        // Extraer ingredientes y análisis financiero de 5_RECETAS
        const platoData = {};
        const recs = [];

        if (sRec) {
          const raw5 = window.XLSX.utils.sheet_to_json(sRec, { header: 1, defval: '' });
          const dataRows5 = raw5.length >= 4 ? raw5.slice(3) : [];
          let currentPlato = '';

          dataRows5.forEach((row, i) => {
            const colA = String(row[0] || '').trim();
            if (colA) currentPlato = colA;

            const colQ = row[16], colR = row[17], colS = row[18], colT = row[19];
            const tieneValorQ = colQ !== '' && colQ !== null && colQ !== undefined && !isNaN(parseFloat(colQ));

            if (tieneValorQ && currentPlato && !platoData[currentPlato]) {
              platoData[currentPlato] = {
                costoMateriaPrima:      parseFloat(colQ) || 0,
                margenBrutoPctPromedio: parseFloat(colR) || 0,
                precioVentaSugerido:    parseFloat(colS) || 0,
                margenBrutoPesos:       parseFloat(colT) || 0,
              };
            }

            const ingrediente = String(row[1] || '').trim();
            if (ingrediente && currentPlato) {
              recs.push({
                id: \`rec-\${Date.now()}-\${i}\`,
                nombre_plato:         currentPlato,
                ingrediente_nombre:   ingrediente,
                cantidad:             parseNum(row[10]),  // Col K
                unidad_medida:        row[11] || 'g',     // Col L
                subtotal_costo:       parseNum(row[12]),  // Col M
                margen_ingrediente_pct: parseNum(row[13]) * (String(row[13]).includes('%') ? 1 : 100), // Col N
                pvp_sugerido_ing:     parseNum(row[14]),  // Col O
                margen_bruto_pesos_ing: parseNum(row[15]),// Col P
                costo_por_plato:      tieneValorQ ? parseFloat(colQ) : 0,
                margen_plato_pct:     tieneValorQ ? parseFloat(colR) * 100 : 0,
                pvp_sugerido_plato:   tieneValorQ ? parseFloat(colS) : 0,
                margen_plato_pesos:   tieneValorQ ? parseFloat(colT) : 0,
                proveedor:            row[2] || '',
                stock_minimo:         parseNum(row[3]),
                unidad_compra:        row[4] || 'kg',
                costo_unitario:       parseNum(row[9]),
                stock_actual:         parseNum(row[5]) || 0,
              });
            }
          });
        }

        // Enriquecer platos con análisis financiero de 5_RECETAS
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
        });`;

if (content.includes(oldBlock)) {
  content = content.replace(oldBlock, newBlock);
  console.log('PATCH OK - full 5_RECETAS block replaced');
} else {
  console.log('PATCH FAILED - old block not found, trying fallback...');

  // Fallback: just fix the usage of undefined vars without rebuilding
  // Replace only the broken setPlatos and alert lines
  content = content.replace(
    'if (platosEnriquecidos.length > 0) setPlatos(platosEnriquecidos);',
    'if (pls.length > 0) setPlatos(pls);'
  );
  content = content.replace(
    'const platosConReceta = platosEnriquecidos.filter(p => p.tiene_receta).length;\n        const platosSinReceta = platosEnriquecidos.filter(p => !p.tiene_receta).length;\n        alert(`✅ Importación exitosa:\\n  📚 ${cats.length} categorías\\n  🍽 ${platosEnriquecidos.length} platos\\n  📋 ${Object.keys(platoData).length} platos con receta y análisis de margen\\n  ⚠️ ${platosSinReceta} platos sin receta registrada en 5_RECETAS`);',
    'alert(`✅ ¡Importación Exitosa!\\n\\nSe cargaron:\\n- ${cats.length} Categorías\\n- ${pls.length} Platos\\n- ${recs.length} Líneas de Receta\\n- ${newInv.length} Insumos de Inventario\\n- ${grupos.length} Grupos de Modificadores`);'
  );
  console.log('FALLBACK applied');
}

fs.writeFileSync('Avance2135.html', content, 'utf8');
console.log('Done.');
