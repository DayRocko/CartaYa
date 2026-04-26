const fs = require('fs');
let content = fs.readFileSync('Avance2135.html', 'utf8');

// Get the exact bytes between the two anchors and replace them
const startAnchor = '        // 3. IMPORTAR RECETAS E INVENTARIO (CORAZ\u00d3N DEL SUBM\u00d3DULO)\r\n';
const endAnchor = '\r\n\r\n        // 4. IMPORTAR MODIFICADORES';

const startIdx = content.indexOf(startAnchor);
const endIdx = content.indexOf(endAnchor, startIdx);

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find anchors', startIdx, endIdx);
  process.exit(1);
}

const newBlock = `        // 3. IMPORTAR RECETAS E INVENTARIO (CORAZ\u00d3N DEL SUBM\u00d3DULO)
        // Buscar la hoja de recetas con normalizaci\u00f3n flexible
        const normalizeSheet = (s) => String(s || '').normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').toUpperCase().replace(/[^A-Z0-9]/g, '');
        const recSheetName = wb.SheetNames.find(n =>
          normalizeSheet(n).includes('RECETA') || normalizeSheet(n).includes('5RECETA')
        );
        const sRec = recSheetName ? wb.Sheets[recSheetName] : findSheet(['RECETAS', 'RECETA', 'INGREDIENTES', '5_']);

        // Extraer ingredientes y an\u00e1lisis financiero de 5_RECETAS
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
                cantidad:             parseNum(row[10]),  // Col K: Cantidad (Porci\u00f3n)
                unidad_medida:        row[11] || 'g',     // Col L: Unidad de Medida
                subtotal_costo:       parseNum(row[12]),  // Col M: Subtotal Costo MP
                margen_ingrediente_pct: parseNum(row[13]) * (String(row[13]).includes('%') ? 1 : 100), // Col N
                pvp_sugerido_ing:     parseNum(row[14]),  // Col O: Precio Venta Sugerido
                margen_bruto_pesos_ing: parseNum(row[15]),// Col P: Margen Bruto Pesos
                costo_por_plato:      tieneValorQ ? parseFloat(colQ) : 0,
                margen_plato_pct:     tieneValorQ ? parseFloat(colR) * 100 : 0,
                pvp_sugerido_plato:   tieneValorQ ? parseFloat(colS) : 0,
                margen_plato_pesos:   tieneValorQ ? parseFloat(colT) : 0,
                proveedor:            row[2] || '',       // Col C
                stock_minimo:         parseNum(row[3]),   // Col D
                unidad_compra:        row[4] || 'kg',     // Col E
                costo_unitario:       parseNum(row[9]),   // Col J
                stock_actual:         parseNum(row[5]) || 0,  // Col F
              });
            }
          });
        }

        // Enriquecer platos con an\u00e1lisis financiero de 5_RECETAS
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

content = content.substring(0, startIdx) + newBlock + content.substring(endIdx);

// Fix the setPlatos call
content = content.replace(
  'if (pls.length > 0) setPlatos(pls);',
  'if (platosEnriquecidos.length > 0) setPlatos(platosEnriquecidos);'
);

// Fix the alert
content = content.replace(
  "alert(`\u2705 \u00a1Importaci\u00f3n Exitosa!\\n\\nSe cargaron:\\n- ${cats.length} Categor\u00edas\\n- ${pls.length} Platos\\n- ${recs.length} L\u00edneas de Receta\\n- ${newInv.length} Insumos de Inventario\\n- ${grupos.length} Grupos de Modificadores`);",
  "const platosConReceta = platosEnriquecidos.filter(p => p.tiene_receta).length;\n        const platosSinReceta = platosEnriquecidos.filter(p => !p.tiene_receta).length;\n        alert(`\u2705 Importaci\u00f3n exitosa:\\n  \ud83d\udcda ${cats.length} categor\u00edas\\n  \ud83c\udf7d ${platosEnriquecidos.length} platos\\n  \ud83d\udccb ${Object.keys(platoData).length} platos con receta y an\u00e1lisis de margen\\n  \u26a0\ufe0f ${platosSinReceta} platos sin receta registrada en 5_RECETAS`);"
);

fs.writeFileSync('Avance2135.html', content, 'utf8');
console.log('Done.');
