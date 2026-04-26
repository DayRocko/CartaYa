const fs = require('fs');
let content = fs.readFileSync('Avance2135.html', 'utf8');

let changed = 0;

// ─── PATCH 1: ENRICH PLATOS in MenuRecetasBlock ─────────────────────────────
// Replace the old logic that re-computes from recetas with one that reads plato props
const oldEnrich = `  // ─── ENRICH PLATOS ────────────────────────────────────────────────────────────
  const platosEnriquecidos = (platos || []).map(plato => {
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
      fugaMsg: null 
    };
  });`;

const newEnrich = `  // ─── FORMATO DE MONEDA Y PORCENTAJE ─────────────────────────────────────────
  const formatCOP = (val) => {
    const n = parseFloat(val);
    if (isNaN(n) || val === null || val === undefined) return '—';
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);
  };

  const formatPct = (val) => {
    const n = parseFloat(val);
    if (isNaN(n) || val === null || val === undefined) return '—';
    // El valor del Excel ya viene como decimal (0.78 = 78%)
    return (n * 100).toFixed(1) + '%';
  };

  // ─── ENRICH PLATOS ────────────────────────────────────────────────────────────
  // Lee directamente los campos enriquecidos que vienen del parser de 5_RECETAS
  const platosEnriquecidos = (platos || []).map(plato => {
    const pNorm = norm(plato.nombre);
    const tieneReceta = plato.tiene_receta || (recetas || []).some(r => r.nombre_plato && norm(r.nombre_plato) === pNorm);

    return {
      ...plato,
      tieneReceta,
      costoMP: plato.costo_materia_prima !== null && plato.costo_materia_prima !== undefined ? plato.costo_materia_prima : null,
      margenPctProm: plato.margen_bruto_pct_promedio !== null && plato.margen_bruto_pct_promedio !== undefined ? plato.margen_bruto_pct_promedio : null,
      pvpSugerido: plato.precio_venta_sugerido !== null && plato.precio_venta_sugerido !== undefined ? plato.precio_venta_sugerido : null,
      margenBrutoPesos: plato.margen_bruto_pesos !== null && plato.margen_bruto_pesos !== undefined ? plato.margen_bruto_pesos : null,
      alertaState: tieneReceta ? 'sync' : 'no_registrado',
      fugaMsg: tieneReceta ? '' : 'Sin receta en 5_RECETAS'
    };
  });`;

if (content.includes(oldEnrich)) {
  content = content.replace(oldEnrich, newEnrich);
  changed++;
  console.log('PATCH 1 OK - platosEnriquecidos');
} else {
  console.log('PATCH 1 NOT FOUND - platosEnriquecidos');
}

// ─── PATCH 2: MOCK_LINEAS fix ────────────────────────────────────────────────
const oldMock = `      } else {
        // Fallback a datos mock hardcodeados
        lineasIniciales = MOCK_LINEAS[plato.nombre]
          ? MOCK_LINEAS[plato.nombre].map(l => ({ ...l }))
          : [];
      }`;

const newMock = `      } else {
        // Sin receta importada — comenzar con escandallo vacío
        lineasIniciales = [];
      }`;

if (content.includes(oldMock)) {
  content = content.replace(oldMock, newMock);
  changed++;
  console.log('PATCH 2 OK - MOCK_LINEAS');
} else {
  // Soft fix via regex
  content = content.replace(/MOCK_LINEAS\[plato\.nombre\]/g, "null");
  console.log('PATCH 2 - applied soft regex fix for MOCK_LINEAS');
}

// ─── PATCH 3: TABLE CELLS — use formatCOP / formatPct ────────────────────────
const oldCells = `                      {/* COSTO MATERIA PRIMA */}
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

const newCells = `                      {/* COSTO MATERIA PRIMA */}
                      <td className="px-4 py-3">
                        {plato.costoMP !== null
                          ? <span className="font-bold text-slate-700 text-sm">{formatCOP(plato.costoMP)}</span>
                          : <span style={{color:'#D1D5DB',fontWeight:700}}>—</span>
                        }
                      </td>
                      {/* MARGEN % PROMEDIO */}
                      <td className="px-4 py-3 text-center">
                        {plato.margenPctProm !== null
                          ? <span className="font-black text-sm px-3 py-1 rounded-lg" style={{background: ms.bg, color: ms.color, border:\`1px solid \${ms.border}\`}}>{formatPct(plato.margenPctProm)}</span>
                          : <span style={{color:'#D1D5DB',fontWeight:700}}>—</span>
                        }
                      </td>
                      {/* PRECIO VENTA SUGERIDO */}
                      <td className="px-4 py-3 text-right">
                        {plato.pvpSugerido !== null
                          ? <span className="font-black text-slate-900 text-sm">{formatCOP(plato.pvpSugerido)}</span>
                          : <span style={{color:'#D1D5DB',fontWeight:700}}>—</span>
                        }
                      </td>
                      {/* MARGEN PESOS */}
                      <td className="px-4 py-3 text-right">
                        {plato.margenBrutoPesos !== null
                          ? <span className="font-bold text-slate-700 text-sm">{formatCOP(plato.margenBrutoPesos)}</span>
                          : <span style={{color:'#D1D5DB',fontWeight:700}}>—</span>
                        }
                      </td>`;

if (content.includes(oldCells)) {
  content = content.replace(oldCells, newCells);
  changed++;
  console.log('PATCH 3 OK - table cells');
} else {
  console.log('PATCH 3 NOT FOUND - table cells (check exact whitespace)');
}

// ─── PATCH 4: margenStyle must handle null ────────────────────────────────────
// margenPctProm now holds decimal 0-1 so margenStyle gets 0.78, not 78
// Just guard so null doesn't break it
const oldMargenStyle = `const ms = margenStyle(plato.margenPctProm);`;
const newMargenStyle = `const ms = margenStyle(plato.margenPctProm !== null ? plato.margenPctProm * 100 : null);`;

if (content.includes(oldMargenStyle)) {
  content = content.replace(oldMargenStyle, newMargenStyle);
  changed++;
  console.log('PATCH 4 OK - margenStyle null guard');
} else {
  console.log('PATCH 4 NOT FOUND');
}

fs.writeFileSync('Avance2135.html', content, 'utf8');
console.log(`\nTotal patches applied: ${changed}/4`);
