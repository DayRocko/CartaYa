const fs = require('fs');

let content = fs.readFileSync('Avance2135.html', 'utf8');

const oldExtractionLogic = `        const readSheetRows = (sheet) => {
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

        const recs = rowsRec.filter(r => r.plato || r.ingrediente).map((r, i) => ({
          id: \`rec-\${Date.now()}-\${i}\`,
          nombre_plato: String(r.plato || '').trim(),
          ingrediente_nombre: String(r.ingrediente || '').trim(),
          cantidad: parseNum(r.cantidad),
          unidad_medida: r.unidad || 'g',
          costo_unitario: parseNum(r.costo_unit),
          subtotal_costo: parseNum(r.subtotal),
          costo_por_plato: parseNum(r.costo_plato),
          margen_plato_pct: parseNum(r.margen_pct) * (String(r.margen_pct).includes('%') ? 1 : 100),
          pvp_sugerido_plato: parseNum(r.pvp_sug),
          margen_plato_pesos: parseNum(r.margen_pesos),
          proveedor: r.proveedor || '',
          stock_minimo: parseNum(r.stock_min),
          stock_actual: parseNum(r.stock_actual) || parseNum(r.cantidad_compra)
        }));`;

const newExtractionLogic = `        const readSheetRows = (sheet) => {
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

content = content.replace(oldExtractionLogic, newExtractionLogic);

fs.writeFileSync('Avance2135.html', content, 'utf8');
console.log('Patch step 3 complete.');
