const fs = require('fs');
let content = fs.readFileSync('Avance2135.html', 'utf8');

// ─── PATCH 1: Replace platosEnriquecidos in MenuRecetasBlock ─────────────────
// Find start by locating the exact line from the file (uses \r\n line endings)
const enrichStart = content.indexOf('// \u2500\u2500\u2500 ENRICH PLATOS \u2500');
const enrichEnd = content.indexOf('  });\r\n\r\n  // \u2500\u2500\u2500 ESCANDALLO PANEL', enrichStart);

if (enrichStart === -1 || enrichEnd === -1) {
  console.log('PATCH 1: boundaries not found', enrichStart, enrichEnd);
} else {
  const oldBlock = content.substring(enrichStart, enrichEnd + 4); // include '  });'
  const newBlock = `// \u2500\u2500\u2500 FORMATO DE MONEDA Y PORCENTAJE \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  const formatCOP = (val) => {
    const n = parseFloat(val);
    if (isNaN(n) || val === null || val === undefined) return '\u2014';
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);
  };

  const formatPct = (val) => {
    const n = parseFloat(val);
    if (isNaN(n) || val === null || val === undefined) return '\u2014';
    // El valor del Excel ya viene como decimal (0.78 = 78%)
    return (n * 100).toFixed(1) + '%';
  };

  // \u2500\u2500\u2500 ENRICH PLATOS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  // Lee directamente los campos enriquecidos que vienen del parser de 5_RECETAS
  const platosEnriquecidos = (platos || []).map(plato => {
    const pNorm = norm(plato.nombre);
    const tieneReceta = plato.tiene_receta || (recetas || []).some(r => r.nombre_plato && norm(r.nombre_plato) === pNorm);

    return {
      ...plato,
      tieneReceta,
      costoMP: (plato.costo_materia_prima !== null && plato.costo_materia_prima !== undefined) ? plato.costo_materia_prima : null,
      margenPctProm: (plato.margen_bruto_pct_promedio !== null && plato.margen_bruto_pct_promedio !== undefined) ? plato.margen_bruto_pct_promedio : null,
      pvpSugerido: (plato.precio_venta_sugerido !== null && plato.precio_venta_sugerido !== undefined) ? plato.precio_venta_sugerido : null,
      margenBrutoPesos: (plato.margen_bruto_pesos !== null && plato.margen_bruto_pesos !== undefined) ? plato.margen_bruto_pesos : null,
      alertaState: tieneReceta ? 'sync' : 'no_registrado',
      fugaMsg: tieneReceta ? '' : 'Sin receta en 5_RECETAS'
    };
  });`;

  content = content.substring(0, enrichStart) + newBlock + content.substring(enrichEnd + 4);
  console.log('PATCH 1 OK - platosEnriquecidos updated');
}

// ─── PATCH 3: TABLE CELLS ─────────────────────────────────────────────────────
const cellStart = content.indexOf('{/* COSTO MATERIA PRIMA */}');
const cellEnd = content.indexOf('{/* ALERTA FUGAS */}');

if (cellStart === -1 || cellEnd === -1) {
  console.log('PATCH 3: cell boundaries not found');
} else {
  const newCells = `{/* COSTO MATERIA PRIMA */}
                      <td className="px-4 py-3">
                        {plato.costoMP !== null
                          ? <span className="font-bold text-slate-700 text-sm">{formatCOP(plato.costoMP)}</span>
                          : <span style={{color:'#D1D5DB',fontWeight:700}}>\u2014</span>
                        }
                      </td>
                      {/* MARGEN % PROMEDIO */}
                      <td className="px-4 py-3 text-center">
                        {plato.margenPctProm !== null
                          ? <span className="font-black text-sm px-3 py-1 rounded-lg" style={{background: ms.bg, color: ms.color, border:\`1px solid \${ms.border}\`}}>{formatPct(plato.margenPctProm)}</span>
                          : <span style={{color:'#D1D5DB',fontWeight:700}}>\u2014</span>
                        }
                      </td>
                      {/* PRECIO VENTA SUGERIDO */}
                      <td className="px-4 py-3 text-right">
                        {plato.pvpSugerido !== null
                          ? <span className="font-black text-slate-900 text-sm">{formatCOP(plato.pvpSugerido)}</span>
                          : <span style={{color:'#D1D5DB',fontWeight:700}}>\u2014</span>
                        }
                      </td>
                      {/* MARGEN PESOS */}
                      <td className="px-4 py-3 text-right">
                        {plato.margenBrutoPesos !== null
                          ? <span className="font-bold text-slate-700 text-sm">{formatCOP(plato.margenBrutoPesos)}</span>
                          : <span style={{color:'#D1D5DB',fontWeight:700}}>\u2014</span>
                        }
                      </td>
                      `;

  content = content.substring(0, cellStart) + newCells + content.substring(cellEnd);
  console.log('PATCH 3 OK - table cells updated');
}

fs.writeFileSync('Avance2135.html', content, 'utf8');
console.log('Done.');
