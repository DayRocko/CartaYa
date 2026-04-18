function MenuRecetasBlock({ platos, recetas, inventario }) {
  const [activeTab, setActiveTab] = React.useState('platos');

  // ─── MOCK COSTOS (Auditoría Financiera) ─────────────────────────────────────
  const MOCK_COSTOS = {
    'Fettuccine al Funghi':     { costo: 8500  },
    'Lasagna della Nonna':      { costo: 11500 },
    'Spaghetti Carbonara':      { costo: null  },
    'Pizza Diavola':            { costo: null  },
    'Pizza Margherita':         { costo: 12000 },
    'Calzone di Napoli':        { costo: 8500  },
    'Pizza Quattro Formaggi':   { costo: 18000 },
    'Pizza Funghi e Tartufo':   { costo: 15000 },
    'Bruschettas al Pomodoro':  { costo: 15000 },
    'Burrata di Puglia':        { costo: 12000 },
    'Tiramisú della Casa':      { costo: 5500  },
    'Copa de Chianti Classico': { costo: 5500  },
  };

  const MOCK_FUGAS = {
    'Lasagna della Nonna':      { tipo: 'fuga',          msg: '3 unds. faltantes · Posible Fuga' },
    'Tiramisú della Casa':      { tipo: 'no_registrado', msg: 'Consumo no registrado' },
    'Copa de Chianti Classico': { tipo: 'no_registrado', msg: 'Consumo no registrado · Alerta' },
  };

  // ─── MOCK LÍNEAS DE RECETA POR PLATO ────────────────────────────────────────
  const MOCK_LINEAS = {
    'Fettuccine al Funghi': [
      { id: 1, ingrediente: 'Pasta Fettuccine',  costo_unitario: 13000,  unidad_compra: 'kg', cantidad: 150, unidad_receta: 'g',  factor: 1.0  },
      { id: 2, ingrediente: 'Champiñones París', costo_unitario: 28000,  unidad_compra: 'kg', cantidad: 100, unidad_receta: 'g',  factor: 0.85 },
      { id: 3, ingrediente: 'Crema de Leche',    costo_unitario: 27500,  unidad_compra: 'l',  cantidad: 80,  unidad_receta: 'ml', factor: 0.95 },
      { id: 4, ingrediente: 'Queso Parmesano',   costo_unitario: 120000, unidad_compra: 'kg', cantidad: 20,  unidad_receta: 'g',  factor: 1.0  },
      { id: 5, ingrediente: 'Mantequilla',       costo_unitario: 36000,  unidad_compra: 'kg', cantidad: 15,  unidad_receta: 'g',  factor: 1.0  },
      { id: 6, ingrediente: 'Vino Blanco',       costo_unitario: 46666,  unidad_compra: 'l',  cantidad: 30,  unidad_receta: 'ml', factor: 1.0  },
      { id: 7, ingrediente: 'Ajo y Cebolla',     costo_unitario: 4000,   unidad_compra: 'kg', cantidad: 30,  unidad_receta: 'g',  factor: 0.70 },
    ],
    'Lasagna della Nonna': [
      { id: 1, ingrediente: 'Láminas de Lasagna', costo_unitario: 9000,  unidad_compra: 'kg', cantidad: 200, unidad_receta: 'g', factor: 1.0  },
      { id: 2, ingrediente: 'Carne Molida',       costo_unitario: 26000, unidad_compra: 'kg', cantidad: 180, unidad_receta: 'g', factor: 0.90 },
      { id: 3, ingrediente: 'Salsa de Tomate',    costo_unitario: 12000, unidad_compra: 'kg', cantidad: 150, unidad_receta: 'g', factor: 1.0  },
    ],
    'Pizza Margherita': [
      { id: 1, ingrediente: 'Masa de Pizza',       costo_unitario: 8000,  unidad_compra: 'kg', cantidad: 250, unidad_receta: 'g', factor: 1.0  },
      { id: 2, ingrediente: 'Mozzarella di Bufala',costo_unitario: 55000, unidad_compra: 'kg', cantidad: 150, unidad_receta: 'g', factor: 1.0  },
      { id: 3, ingrediente: 'Tomate San Marzano',  costo_unitario: 14000, unidad_compra: 'kg', cantidad: 120, unidad_receta: 'g', factor: 0.85 },
    ],
    'Calzone di Napoli': [
      { id: 1, ingrediente: 'Masa de Pizza',   costo_unitario: 8000,  unidad_compra: 'kg', cantidad: 280, unidad_receta: 'g', factor: 1.0  },
      { id: 2, ingrediente: 'Ricotta Fresca',  costo_unitario: 42000, unidad_compra: 'kg', cantidad: 120, unidad_receta: 'g', factor: 1.0  },
      { id: 3, ingrediente: 'Jamón de Parma',  costo_unitario: 75000, unidad_compra: 'kg', cantidad: 60,  unidad_receta: 'g', factor: 1.0  },
    ],
    'Pizza Quattro Formaggi': [
      { id: 1, ingrediente: 'Masa de Pizza',   costo_unitario: 8000,   unidad_compra: 'kg', cantidad: 250, unidad_receta: 'g', factor: 1.0 },
      { id: 2, ingrediente: 'Gorgonzola',      costo_unitario: 85000,  unidad_compra: 'kg', cantidad: 80,  unidad_receta: 'g', factor: 1.0 },
      { id: 3, ingrediente: 'Fontina',         costo_unitario: 70000,  unidad_compra: 'kg', cantidad: 80,  unidad_receta: 'g', factor: 1.0 },
    ],
    'Pizza Funghi e Tartufo': [
      { id: 1, ingrediente: 'Masa de Pizza',       costo_unitario: 8000,   unidad_compra: 'kg', cantidad: 250, unidad_receta: 'g',  factor: 1.0 },
      { id: 2, ingrediente: 'Champiñones París',   costo_unitario: 28000,  unidad_compra: 'kg', cantidad: 180, unidad_receta: 'g',  factor: 0.85},
      { id: 3, ingrediente: 'Aceite de Trufa',     costo_unitario: 180000, unidad_compra: 'l',  cantidad: 15,  unidad_receta: 'ml', factor: 1.0 },
    ],
    'Bruschettas al Pomodoro': [
      { id: 1, ingrediente: 'Pan Artesanal',  costo_unitario: 12000, unidad_compra: 'kg', cantidad: 200, unidad_receta: 'g', factor: 1.0  },
      { id: 2, ingrediente: 'Tomate Fresco', costo_unitario: 6000,  unidad_compra: 'kg', cantidad: 250, unidad_receta: 'g', factor: 0.80 },
    ],
    'Burrata di Puglia': [
      { id: 1, ingrediente: 'Burrata Import.', costo_unitario: 95000, unidad_compra: 'kg', cantidad: 125, unidad_receta: 'g', factor: 1.0 },
      { id: 2, ingrediente: 'Rúcula Fresca',   costo_unitario: 22000, unidad_compra: 'kg', cantidad: 40,  unidad_receta: 'g', factor: 0.85},
    ],
    'Tiramisú della Casa': [
      { id: 1, ingrediente: 'Mascarpone',     costo_unitario: 48000, unidad_compra: 'kg', cantidad: 80, unidad_receta: 'g',  factor: 1.0 },
      { id: 2, ingrediente: 'Café Expreso',   costo_unitario: 65000, unidad_compra: 'kg', cantidad: 30, unidad_receta: 'g',  factor: 1.0 },
    ],
    'Copa de Chianti Classico': [
      { id: 1, ingrediente: 'Chianti Classico DOCG', costo_unitario: 85000, unidad_compra: 'l', cantidad: 150, unidad_receta: 'ml', factor: 1.0 },
    ],
  };

  // ─── STATE ───────────────────────────────────────────────────────────────────
  // Panel open state: stores plato.id | null
  const [expandedPlato, setExpandedPlato] = React.useState(null);
  // Each plato has its own lineas state, keyed by plato.id -> []
  const [platosLineas, setPlatosLineas] = React.useState({});
  const [buscarInsumo, setBuscarInsumo] = React.useState('');

  const UNIDADES = ['g', 'kg', 'ml', 'l', 'und', 'cc'];

  // ─── HELPERS  ─────────────────────────────────────────────────────────────────
  const fmt = (val) => {
    if (val === null || val === undefined || isNaN(Number(val))) return null;
    return '$' + Math.round(Number(val)).toLocaleString('es-CO');
  };

  const factorLabel = (f) => {
    const n = Number(f);
    if (n >= 1.0) return 'Sin merma';
    if (n >= 0.8) return 'Limpieza/tallo';
    if (n >= 0.6) return 'Pelado/Puntas';
    return 'Alta merma';
  };

  // Convert cantidad to base unit (kg or l) based on unidad_receta
  const toBase = (cantidad, unidad) => {
    const n = Number(cantidad) || 0;
    if (unidad === 'g')   return n / 1000;
    if (unidad === 'ml')  return n / 1000;
    if (unidad === 'cc')  return n / 1000;
    return n; // kg, l, und -> directo
  };

  const calcFila = (linea) => {
    const cu = Number(linea.costo_unitario) || 0;
    const cant = toBase(linea.cantidad, linea.unidad_receta);
    const factor = Math.max(0.01, Number(linea.factor) || 1);
    if (!cu) return { operacion: '—', costo: null };
    const costo = (cu * cant) / factor;
    const cantBase = cant.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
    const operacion = `(${cu.toLocaleString('es-CO')} × ${cantBase}) / ${factor}`;
    return { operacion, costo: Math.round(costo) };
  };

  const calcMargen = (precio, costo) => {
    if (!precio || costo === null || costo === undefined) return null;
    return Math.round(((precio - costo) / precio) * 100);
  };

  const margenStyle = (pct) => {
    if (pct === null) return { color: '#D1D5DB' };
    if (pct >= 60) return { color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' };
    if (pct >= 40) return { color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' };
    return { color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' };
  };

  // ─── ESCANDALLO OPEN/CLOSE ────────────────────────────────────────────────────
  const toggleEscandallo = (plato) => {
    if (expandedPlato === plato.id) { setExpandedPlato(null); return; }
    // Load lines if not already loaded for this plato
    setPlatosLineas(prev => {
      if (prev[plato.id]) return prev; // already loaded
      const mockLineas = MOCK_LINEAS[plato.nombre]
        ? MOCK_LINEAS[plato.nombre].map(l => ({ ...l }))
        : [];
      return { ...prev, [plato.id]: mockLineas };
    });
    setBuscarInsumo('');
    setExpandedPlato(plato.id);
  };

  const getLineas = (platoId) => platosLineas[platoId] || [];

  const addIngrediente = (platoId) => {
    const nombre = buscarInsumo.trim();
    if (!nombre) return;
    const nuevaLinea = { id: Date.now(), ingrediente: nombre, costo_unitario: 0, unidad_compra: 'kg', cantidad: 100, unidad_receta: 'g', factor: 1.0 };
    setPlatosLineas(prev => ({ ...prev, [platoId]: [...(prev[platoId] || []), nuevaLinea] }));
    setBuscarInsumo('');
  };

  const removeIngrediente = (platoId, lineaId) => {
    setPlatosLineas(prev => ({ ...prev, [platoId]: (prev[platoId] || []).filter(l => l.id !== lineaId) }));
  };

  const updateLinea = (platoId, lineaId, field, value) => {
    setPlatosLineas(prev => ({
      ...prev,
      [platoId]: (prev[platoId] || []).map(l => l.id === lineaId ? { ...l, [field]: value } : l)
    }));
  };

  // ─── ENRICH PLATOS ────────────────────────────────────────────────────────────
  const MOCK_RECETA_ACTIVA = new Set([
    'Fettuccine al Funghi', 'Lasagna della Nonna', 'Pizza Margherita',
    'Calzone di Napoli', 'Pizza Quattro Formaggi', 'Pizza Funghi e Tartufo',
    'Bruschettas al Pomodoro', 'Burrata di Puglia', 'Tiramisú della Casa',
    'Copa de Chianti Classico',
  ]);

  const platosEnriquecidos = (platos || []).map(plato => {
    const mock = MOCK_COSTOS[plato.nombre] || {};
    const tieneReceta = MOCK_RECETA_ACTIVA.has(plato.nombre) ||
      (recetas || []).some(r => r.nombre_plato === plato.nombre);
    const costoReal = mock.costo !== undefined ? mock.costo : (plato.costo_produccion || null);
    const margen = calcMargen(plato.precio_venta, costoReal);
    const fuga = MOCK_FUGAS[plato.nombre] || null;
    let alertaState = 'sync';
    if (!tieneReceta) alertaState = 'no_registrado';
    else if (fuga && fuga.tipo === 'fuga') alertaState = 'fuga';
    else if (fuga && fuga.tipo === 'no_registrado') alertaState = 'no_registrado';
    return { ...plato, tieneReceta, costoReal, margen, alertaState, fugaMsg: fuga ? fuga.msg : null };
  });

  // ─── ESCANDALLO PANEL ─────────────────────────────────────────────────────────
  const EscandalloPanel = ({ plato }) => {
    const lineas = getLineas(plato.id);
    const costoTotal = lineas.reduce((acc, l) => {
      const { costo } = calcFila(l);
      return acc + (costo || 0);
    }, 0);
    const margenPct = calcMargen(plato.precio_venta, costoTotal > 0 ? costoTotal : null);
    const ms = margenStyle(margenPct);

    return (
      <tr>
        <td colSpan={8} style={{padding:'4px 8px 8px 8px', background:'#F8FAFC'}}>
          <div style={{background:'white', border:'1px solid #E2E8F0', borderRadius:16, boxShadow:'0 4px 16px rgba(0,0,0,0.06)', padding:'20px', margin:'0 4px'}}>

            {/* HEADER */}
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14}}>
              <div style={{display:'flex', alignItems:'center', gap:10}}>
                <span style={{fontSize:17}}>✏️</span>
                <span style={{fontWeight:700, color:'#1E293B', fontSize:14}}>Escandallo — {plato.nombre}</span>
                <span style={{fontSize:'9px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', background:'#F3F4F6', color:'#6B7280', borderRadius:5, padding:'2px 8px'}}>COMPOSICIÓN TÉCNICA</span>
              </div>
              <button
                onClick={() => setExpandedPlato(null)}
                style={{background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:8, padding:'4px 12px', fontSize:12, fontWeight:700, color:'#64748B', cursor:'pointer'}}
              >✕ Cerrar</button>
            </div>

            {/* SEARCH ROW */}
            <div style={{display:'flex', gap:8, marginBottom:14}}>
              <div style={{flex:1, position:'relative'}}>
                <span style={{position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', fontSize:14, color:'#9CA3AF'}}>🔍</span>
                <input
                  type="text"
                  placeholder="Buscar insumo... (ej: Harina, Queso)"
                  value={buscarInsumo}
                  onChange={e => setBuscarInsumo(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addIngrediente(plato.id); } }}
                  style={{width:'100%', border:'1px solid #E5E7EB', borderRadius:12, padding:'8px 12px 8px 36px', fontSize:13, background:'#F9FAFB', outline:'none', boxSizing:'border-box'}}
                />
              </div>
              <button
                onClick={() => addIngrediente(plato.id)}
                style={{background:'#4F46E5', color:'white', fontWeight:700, fontSize:13, padding:'8px 18px', borderRadius:12, border:'none', cursor:'pointer', whiteSpace:'nowrap'}}
              >+ Agregar Ingrediente</button>
            </div>

            {/* TABLA FICHA TÉCNICA */}
            <div style={{overflowX:'auto', borderRadius:12, border:'1px solid #E5E7EB'}}>
              <table style={{width:'100%', borderCollapse:'collapse', fontSize:13, minWidth:820}}>
                <thead>
                  <tr style={{background:'#F8FAFC', borderBottom:'1px solid #E5E7EB'}}>
                    <th style={{padding:'10px 12px', textAlign:'left', fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.06em', color:'#94A3B8'}}>Ingrediente</th>
                    <th style={{padding:'10px 12px', textAlign:'center', fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.06em', color:'#94A3B8'}}>Costo Unitario (Compra)</th>
                    <th style={{padding:'10px 12px', textAlign:'center', fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.06em', color:'#94A3B8'}}>Cantidad Neta (Receta)</th>
                    <th style={{padding:'10px 12px', textAlign:'center', fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.06em', color:'#94A3B8'}}>Factor Rendimiento</th>
                    <th style={{padding:'10px 12px', textAlign:'center', fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.06em', color:'#94A3B8'}}>Operación (Costo Real)</th>
                    <th style={{padding:'10px 12px', textAlign:'right', fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.06em', color:'#94A3B8'}}>Total Ingrediente</th>
                    <th style={{padding:'10px 8px', width:32}}></th>
                  </tr>
                </thead>
                <tbody>
                  {lineas.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{textAlign:'center', padding:'24px', color:'#9CA3AF', fontSize:13, fontStyle:'italic'}}>
                        No hay ingredientes. Usa el buscador para agregar insumos.
                      </td>
                    </tr>
                  ) : (
                    lineas.map((linea, li) => {
                      const { operacion, costo } = calcFila(linea);
                      const isOdd = li % 2 === 1;
                      const cu = Number(linea.costo_unitario) || 0;
                      const unidadBase = (linea.unidad_compra === 'kg' || linea.unidad_compra === 'l') ? linea.unidad_compra : linea.unidad_compra;
                      const equivalente = cu > 0 ? `($${cu.toLocaleString('es-CO')}/${unidadBase})` : '';
                      return (
                        <tr key={linea.id} style={{borderBottom:'1px solid #F1F5F9', background: isOdd ? '#FAFBFC' : 'white'}}>
                          {/* COL 1 — INGREDIENTE */}
                          <td style={{padding:'10px 12px'}}>
                            <span style={{fontWeight:700, color:'#1E293B', fontSize:13}}>{linea.ingrediente}</span>
                          </td>
                          {/* COL 2 — COSTO UNITARIO */}
                          <td style={{padding:'10px 12px', textAlign:'center'}}>
                            {cu > 0 ? (
                              <div>
                                <div style={{fontWeight:700, color:'#334155', fontSize:13}}>
                                  ${cu.toLocaleString('es-CO')} / {linea.unidad_compra}
                                </div>
                                <div style={{fontSize:10, color:'#94A3B8', marginTop:2}}>{equivalente}</div>
                              </div>
                            ) : (
                              <span style={{color:'#D97706', fontSize:12, fontWeight:700}}>Sin precio</span>
                            )}
                          </td>
                          {/* COL 3 — CANTIDAD NETA */}
                          <td style={{padding:'10px 12px', textAlign:'center'}}>
                            <div style={{display:'inline-flex', alignItems:'center', gap:4}}>
                              <input
                                type="number"
                                min="0"
                                step="any"
                                value={linea.cantidad}
                                onChange={e => updateLinea(plato.id, linea.id, 'cantidad', e.target.value)}
                                style={{width:72, textAlign:'center', fontSize:13, border:'1px solid #E2E8F0', borderRadius:8, padding:'4px 6px', background:'white', outline:'none'}}
                              />
                              <select
                                value={linea.unidad_receta}
                                onChange={e => updateLinea(plato.id, linea.id, 'unidad_receta', e.target.value)}
                                style={{border:'1px solid #E2E8F0', borderRadius:8, fontSize:12, padding:'4px 6px', background:'white', outline:'none', cursor:'pointer'}}
                              >
                                {UNIDADES.map(u => <option key={u} value={u}>{u}</option>)}
                              </select>
                            </div>
                          </td>
                          {/* COL 4 — FACTOR RENDIMIENTO */}
                          <td style={{padding:'10px 12px', textAlign:'center'}}>
                            <div>
                              <input
                                type="number"
                                min="0.01"
                                max="1.0"
                                step="0.01"
                                value={linea.factor}
                                onChange={e => updateLinea(plato.id, linea.id, 'factor', e.target.value)}
                                style={{width:60, textAlign:'center', fontSize:13, border:'1px solid #E2E8F0', borderRadius:8, padding:'4px 6px', background:'white', outline:'none'}}
                              />
                              <div style={{fontSize:9, color:'#94A3B8', marginTop:3}}>{factorLabel(linea.factor)}</div>
                            </div>
                          </td>
                          {/* COL 5 — OPERACIÓN */}
                          <td style={{padding:'10px 12px', textAlign:'center'}}>
                            <div style={{background:'#F8FAFC', borderRadius:8, padding:'5px 10px', display:'inline-block', minWidth:140}}>
                              <div style={{fontSize:10, color:'#94A3B8', marginBottom:2}}>{operacion}</div>
                              <div style={{fontWeight:700, color:'#1E293B', fontSize:13}}>
                                {costo !== null ? `$${costo.toLocaleString('es-CO')}` : '—'}
                              </div>
                            </div>
                          </td>
                          {/* COL 6 — TOTAL INGREDIENTE */}
                          <td style={{padding:'10px 12px', textAlign:'right'}}>
                            {costo !== null
                              ? <span style={{fontWeight:900, color:'#047857', fontSize:13}}>${costo.toLocaleString('es-CO')}</span>
                              : <span style={{color:'#D1D5DB'}}>—</span>
                            }
                          </td>
                          {/* DELETE BTN */}
                          <td style={{padding:'10px 8px', textAlign:'center'}}>
                            <button
                              onClick={() => removeIngrediente(plato.id, linea.id)}
                              style={{width:24, height:24, borderRadius:6, border:'none', background:'transparent', color:'#CBD5E1', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, transition:'all 0.15s'}}
                              onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#DC2626'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#CBD5E1'; }}
                              title="Eliminar ingrediente"
                            >✕</button>
                          </td>
                        </tr>
                      );
                    })
                  )}

                  {/* RESUMEN — COSTO TOTAL */}
                  {lineas.length > 0 && (
                    <>
                      <tr style={{background:'#F8FAFC', borderTop:'2px solid #E2E8F0'}}>
                        <td colSpan={5} style={{padding:'10px 12px'}}>
                          <span style={{fontWeight:900, color:'#334155', fontSize:13, textTransform:'uppercase', letterSpacing:'0.04em'}}>Costo Total de Producción</span>
                        </td>
                        <td style={{padding:'10px 12px', textAlign:'right'}}>
                          <span style={{fontWeight:900, color:'#0F172A', fontSize:15}}>
                            ${costoTotal.toLocaleString('es-CO')}
                          </span>
                        </td>
                        <td></td>
                      </tr>
                      <tr style={{background:'#F8FAFC', borderTop:'1px solid #F1F5F9'}}>
                        <td colSpan={5} style={{padding:'6px 12px'}}>
                          <span style={{fontWeight:700, color:'#64748B', fontSize:12}}>Margen Bruto Proyectado</span>
                        </td>
                        <td style={{padding:'6px 12px', textAlign:'right'}}>
                          {margenPct !== null ? (
                            <span style={{fontWeight:900, fontSize:14, color: ms.color, background: ms.bg, border:`1px solid ${ms.border}`, borderRadius:8, padding:'2px 10px'}}>
                              {margenPct}%
                            </span>
                          ) : <span style={{color:'#D1D5DB'}}>—</span>}
                        </td>
                        <td></td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>

            {/* FOOTER BUTTONS */}
            <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:14, paddingTop:12, borderTop:'1px solid #F1F5F9'}}>
              <button
                onClick={() => setExpandedPlato(null)}
                style={{background:'white', border:'1px solid #E2E8F0', color:'#475569', fontWeight:700, fontSize:13, padding:'8px 20px', borderRadius:12, cursor:'pointer'}}
              >Cancelar</button>
              <button
                onClick={() => {
                  console.log('[Receta guardada]', plato.nombre, getLineas(plato.id));
                  setExpandedPlato(null);
                }}
                style={{background:'#059669', color:'white', fontWeight:700, fontSize:13, padding:'8px 20px', borderRadius:12, border:'none', cursor:'pointer', boxShadow:'0 2px 8px rgba(5,150,105,0.25)'}}
              >✓ Guardar Receta</button>
            </div>
          </div>
        </td>
      </tr>
    );
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col overflow-hidden" style={{borderLeft:'4px solid #7C3AED'}}>
      {/* HEADER */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center" style={{fontSize:20}}>📋</div>
            <div>
              <h3 className="text-lg font-black text-slate-800 tracking-tight">4. Recetas e Inventario (Auditoría Financiera)</h3>
              <p className="text-xs text-gray-500">Stock valorizado y márgenes en tiempo real (Algoritmo IA).</p>
            </div>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-xl shadow-inner border border-gray-200/50 shrink-0">
            <button
              onClick={() => setActiveTab('platos')}
              className="px-4 py-2 text-xs font-bold rounded-lg transition-all"
              style={{background: activeTab==='platos' ? 'white' : 'transparent', color: activeTab==='platos' ? '#0F172A' : '#6B7280', boxShadow: activeTab==='platos' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none'}}
            >🍲 Recetas (Cálculo Costos)</button>
            <button
              onClick={() => setActiveTab('inventario')}
              className="px-4 py-2 text-xs font-bold rounded-lg transition-all ml-1"
              style={{background: activeTab==='inventario' ? 'white' : 'transparent', color: activeTab==='inventario' ? '#0F172A' : '#6B7280', boxShadow: activeTab==='inventario' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none'}}
            >📦 Insumos (Catálogo Central)</button>
          </div>
        </div>
      </div>

      {/* ── TAB RECETAS ─────────────────────────────────────────────────────────── */}
      {activeTab === 'platos' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse bg-white" style={{minWidth:900}}>
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200">
                <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Foto</th>
                <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nombre del Plato</th>
                <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Composición Técnica (Escandallo)</th>
                <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">M2: Precio Venta</th>
                <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">M4: Costo Real</th>
                <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Margen Final</th>
                <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Alerta Detección Fugas</th>
                <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {platosEnriquecidos.map((plato, idx) => {
                const isExpanded = expandedPlato === plato.id;
                const rowBg = idx % 2 === 0 ? 'white' : 'rgba(248,250,252,0.5)';
                const ms = margenStyle(plato.margen);
                return (
                  <React.Fragment key={plato.id || idx}>
                    <tr
                      className="border-b border-gray-100 hover:bg-purple-50/20 transition-colors"
                      style={{background: isExpanded ? '#F5F3FF' : rowBg, minHeight:64}}
                    >
                      {/* FOTO */}
                      <td className="px-4 py-3">
                        <div style={{width:48,height:48,borderRadius:12,background:'#F3F4F6',border:'1px solid #E5E7EB',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center'}}>
                          {plato.foto_url
                            ? <img src={plato.foto_url} alt={plato.nombre} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                            : <span style={{fontSize:22,color:'#D1D5DB'}}>🖼</span>
                          }
                        </div>
                      </td>
                      {/* NOMBRE */}
                      <td className="px-4 py-3">
                        <span className="font-bold text-slate-800 text-sm">{plato.nombre}</span>
                      </td>
                      {/* ESCANDALLO BADGE */}
                      <td className="px-4 py-3">
                        {plato.tieneReceta ? (
                          <button
                            onClick={() => toggleEscandallo(plato)}
                            style={{display:'inline-flex',alignItems:'center',gap:6,fontSize:12,fontWeight:700,borderRadius:8,padding:'4px 12px',background: isExpanded ? '#D1FAE5' : '#ECFDF5',color:'#047857',border:`1px solid ${isExpanded ? '#6EE7B7' : '#A7F3D0'}`,cursor:'pointer',transition:'all 0.15s'}}
                          >
                            <span style={{fontSize:13}}>🔪</span> Receta Activa
                          </button>
                        ) : (
                          <button
                            onClick={() => toggleEscandallo(plato)}
                            style={{display:'inline-flex',alignItems:'center',gap:6,fontSize:12,fontWeight:700,borderRadius:8,padding:'4px 12px',background:'#FFFBEB',color:'#B45309',border:'1px solid #FCD34D',cursor:'pointer'}}
                          >
                            <span>⚠</span> Requiere Receta
                          </button>
                        )}
                      </td>
                      {/* PRECIO VENTA */}
                      <td className="px-4 py-3 text-right">
                        <span className="font-black text-slate-900 text-sm">${(plato.precio_venta||0).toLocaleString('es-CO')}</span>
                      </td>
                      {/* COSTO REAL */}
                      <td className="px-4 py-3 text-right">
                        {!plato.tieneReceta
                          ? <span style={{color:'#D1D5DB',fontWeight:700}}>—</span>
                          : plato.costoReal === null
                            ? <span style={{color:'#D97706',fontWeight:700}}>$?</span>
                            : <span className="font-black text-slate-700">${plato.costoReal.toLocaleString('es-CO')}</span>
                        }
                      </td>
                      {/* MARGEN FINAL */}
                      <td className="px-4 py-3 text-center">
                        {plato.margen !== null
                          ? <span className="font-black text-sm px-3 py-1 rounded-lg" style={{background: ms.bg, color: ms.color, border:`1px solid ${ms.border}`}}>{plato.margen}%</span>
                          : <span style={{color:'#D1D5DB',fontWeight:700}}>—</span>
                        }
                      </td>
                      {/* ALERTA FUGAS */}
                      <td className="px-4 py-3 text-center">
                        {plato.alertaState === 'sync' && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold rounded-lg px-2 py-1 border" style={{background:'#F0FDF4',color:'#15803D',borderColor:'#BBF7D0'}}>✓ Sincronizado</span>
                        )}
                        {plato.alertaState === 'fuga' && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold rounded-lg px-2 py-1 border" style={{background:'#FFFBEB',color:'#92400E',borderColor:'#FCD34D'}}>⚠ {plato.fugaMsg}</span>
                        )}
                        {plato.alertaState === 'no_registrado' && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold rounded-lg px-2 py-1 border" style={{background:'#FEF2F2',color:'#DC2626',borderColor:'#FECACA'}}>⊗ {plato.fugaMsg || 'Consumo no registrado'}</span>
                        )}
                      </td>
                      {/* ACCIONES */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button title="Ver detalle" className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-colors" style={{background:'#F8FAFC',color:'#475569',border:'1px solid #E2E8F0'}}>👁</button>
                          <button title="Editar receta" onClick={() => toggleEscandallo(plato)} className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-colors" style={{background:'#EEF2FF',color:'#4338CA',border:'1px solid #C7D2FE'}}>✏</button>
                        </div>
                      </td>
                    </tr>

                    {/* INLINE ESCANDALLO PANEL */}
                    {isExpanded && <EscandalloPanel plato={plato} />}
                  </React.Fragment>
                );
              })}
              {platosEnriquecidos.length === 0 && (
                <tr><td colSpan={8} className="p-12 text-center text-slate-400 text-sm">No hay platos configurados en M2.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── TAB INSUMOS ─────────────────────────────────────────────────────────── */}
      {activeTab === 'inventario' && (
        <div className="overflow-x-auto rounded-b-3xl">
          <table className="w-full text-left text-sm border-collapse bg-white">
            <thead className="bg-slate-50">
              <tr className="border-b border-gray-200 text-[10px] uppercase text-slate-500 font-bold tracking-wider">
                <th className="p-4">Catálogo de Insumos</th>
                <th className="p-4">U. Medida Maestro</th>
                <th className="p-4 text-right">Impacto Financiero (Precio Base)</th>
                <th className="p-4 text-right">Stock a Hoy</th>
              </tr>
            </thead>
            <tbody>
              {(inventario || []).map((i, idx) => (
                <tr key={idx} className="border-b border-gray-50 hover:bg-purple-50/30 transition-colors group">
                  <td className="p-4">
                    <span className="font-bold text-slate-700 block">{i.nombre}</span>
                    {i.stock_minimo_alerta > 0 && i.stock_actual <= i.stock_minimo_alerta && (
                      <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">⚠️ CRÍTICO</span>
                    )}
                  </td>
                  <td className="p-4 text-slate-500 uppercase text-[11px] font-black tracking-wider bg-slate-50 w-32 border-x border-gray-50 text-center">{i.unidad_compra}</td>
                  <td className="p-4 text-right">
                    <span className="font-mono bg-white text-purple-700 font-bold px-3 py-1 inline-flex items-center justify-end rounded-lg border border-purple-100 shadow-sm group-hover:border-purple-300">
                      ${(i.precio_por_unidad || 0).toLocaleString()}
                    </span>
                  </td>
                  <td className="p-4 text-right text-slate-600 font-mono font-medium">{i.stock_actual || 0}</td>
                </tr>
              ))}
              {(!inventario || inventario.length === 0) && (
                <tr><td colSpan={4} className="p-12 text-center text-slate-400 text-sm italic">Sin insumos registrados. Sube tu plantilla "Inventario".</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

