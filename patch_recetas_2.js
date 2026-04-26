const fs = require('fs');
let content = fs.readFileSync('Avance2135.html', 'utf8');

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

const newTableRender = `{/* COSTO MATERIA PRIMA */}
                      <td className="px-4 py-3">
                        <span className="font-bold text-slate-700 text-sm">{formatCOP(plato.costoMP)}</span>
                      </td>
                      {/* MARGEN % PROMEDIO */}
                      <td className="px-4 py-3 text-center">
                        {plato.margenPctProm !== null
                          ? <span className="font-black text-sm px-3 py-1 rounded-lg" style={{background: ms.bg, color: ms.color, border:\`1px solid \${ms.border}\`}}>{formatPct(plato.margenPctProm / 100)}</span>
                          : <span style={{color:'#D1D5DB',fontWeight:700}}>—</span>
                        }
                      </td>
                      {/* PRECIO VENTA SUGERIDO */}
                      <td className="px-4 py-3 text-right">
                        <span className="font-black text-slate-900 text-sm">{formatCOP(plato.pvpSugerido)}</span>
                      </td>
                      {/* MARGEN PESOS */}
                      <td className="px-4 py-3 text-right">
                        <span className="font-bold text-slate-700 text-sm">{formatCOP(plato.margenBrutoPesos)}</span>
                      </td>`;

content = content.replace(oldTableRender, newTableRender);

fs.writeFileSync('Avance2135.html', content, 'utf8');
console.log('Patch step 2 complete.');
