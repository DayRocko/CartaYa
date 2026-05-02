const fs = require('fs');
let t = fs.readFileSync('Avance2135.html', 'utf8');

// BLOQUE 1
const b1_target = 'const [alertasInventario, setAlertasInventario] = useState([]);';
const b1_replace = `const [alertasInventario, setAlertasInventario] = useState([]);
  const [transacciones, setTransacciones] = useState([]);`;
t = t.replace(b1_target, b1_replace);

const b1_helper_target = 'return (\\n    <div className="flex h-screen overflow-hidden bg-slate-900">';
const b1_helper_regex = /return \(\s*<div className="flex h-screen overflow-hidden bg-slate-900">/;

const b1_helper_code = `
  const registrarPagoEnFinanzas = React.useCallback((payload) => {
    const nueva = {
      id: \`ORD-\${Date.now()}\`,
      hora: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      fecha: new Date().toLocaleDateString('es-CO'),
      timestamp: Date.now(),
      cliente: payload.mesaLabel || 'Mostrador',
      canal: payload.mesa ? 'Salón' : 'Para llevar',
      items: payload.items || [],
      itemCount: (payload.items || []).reduce((s, i) => s + (i.qty || 1), 0),
      subtotal: payload.subtotal || 0,
      descuento: payload.discountAmount || 0,
      impuesto: payload.impuesto || 0,
      propina: payload.tipAmount || 0,
      total: payload.total || 0,
      metodoPago: payload.metodoPago || 'Efectivo',
      estado: 'Pagado',
      mesa: payload.mesa || null,
    };
    setTransacciones(prev => [nueva, ...prev]);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900">`;
t = t.replace(b1_helper_regex, b1_helper_code);


// BLOQUE 2
const b2_target1 = `{activeTab === 'pos' && (
                  <ViewPOS
                    categorias={categorias}
                    platos={platos}
                    gruposMod={gruposMod}
                    opcionesMod={opcionesMod}
                    vinculosMod={vinculosMod}
                  />
                )}`;
const b2_replace1 = `{activeTab === 'pos' && (
                  <ViewPOS
                    categorias={categorias}
                    platos={platos}
                    gruposMod={gruposMod}
                    opcionesMod={opcionesMod}
                    vinculosMod={vinculosMod}
                    onRegistrarPago={registrarPagoEnFinanzas}
                  />
                )}`;

// Handle potential whitespace differences for Target 1
const b2_t1_regex = /\{\s*activeTab === 'pos' && \(\s*<ViewPOS[\s\S]*?vinculosMod=\{vinculosMod\}\s*\/>\s*\)\s*\}/;
const b2_r1 = `{activeTab === 'pos' && (
                  <ViewPOS
                    categorias={categorias}
                    platos={platos}
                    gruposMod={gruposMod}
                    opcionesMod={opcionesMod}
                    vinculosMod={vinculosMod}
                    onRegistrarPago={registrarPagoEnFinanzas}
                  />
                )}`;
t = t.replace(b2_t1_regex, b2_r1);

const b2_t2_regex = /\{activeTab === 'ventas-finanzas' && <ViewVentasFinanzas[^>]+>\s*\}/;
const b2_r2 = `{activeTab === 'ventas-finanzas' && (
                  <ViewVentasFinanzas
                    platos={platos}
                    recetas={recetas}
                    inventario={inventario}
                    gruposMod={gruposMod}
                    opcionesMod={opcionesMod}
                    vinculosMod={vinculosMod}
                    transacciones={transacciones}
                  />
                )}`;
t = t.replace(b2_t2_regex, b2_r2);

// BLOQUE 3
const b3_target1 = /function ViewPOS\(\{ categorias = \[\], platos = \[\], gruposMod = \[\], opcionesMod = \[\], vinculosMod = \[\] \}\) \{/;
const b3_replace1 = `function ViewPOS({ categorias = [], platos = [], gruposMod = [], opcionesMod = [], vinculosMod = [], onRegistrarPago }) {`;
t = t.replace(b3_target1, b3_replace1);

const b3_target2 = /<button\s*onClick=\{\(\) => setCheckoutSuccess\(true\)\}\s*className="w-full bg-\[#02a96b\] hover:bg-\[#028f5a\] text-white py-6 rounded-\[24px\] font-black text-\[15px\] flex items-center justify-center gap-2 shadow-lg shadow-emerald-50 transition-all active:scale-\[0\.98\] uppercase tracking-\[0\.1em\] mb-4"\s*>\s*Registrar Pago\s*<\/button>/;
const b3_replace2 = `<button
    onClick={() => {
      if (typeof onRegistrarPago === 'function') {
        onRegistrarPago({
          mesa: selectedMesa,
          mesaLabel: selectedMesa ? \`Mesa \${selectedMesa.numero}\` : 'Mostrador',
          items: orderItems,
          subtotal,
          discountAmount,
          impuesto,
          tipAmount,
          total,
          metodoPago: paymentMethod,
        });
      }
      setCheckoutSuccess(true);
    }}
    className="w-full bg-[#02a96b] hover:bg-[#028f5a] text-white py-6 rounded-[24px] font-black text-[15px] flex items-center justify-center gap-2 shadow-lg shadow-emerald-50 transition-all active:scale-[0.98] uppercase tracking-[0.1em] mb-4"
  >
    Registrar Pago
  </button>`;
t = t.replace(b3_target2, b3_replace2);

// BLOQUE 4
const b4_start = t.indexOf('function ViewVentasFinanzas(');
const b4_end = t.indexOf('function ViewMenu(', b4_start);

const b4_code = \`function ViewVentasFinanzas({ platos = [], recetas = [], inventario = [], transacciones = [] }) {
  const formatearMonto = (monto) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(monto);
  const compactMonto = (monto) => new Intl.NumberFormat('es-CO', { notation: "compact", compactDisplay: "short" }).format(monto);

  const [periodo, setPeriodo] = React.useState('Hoy');
  const [ordenSeleccionada, setOrdenSeleccionada] = React.useState(null);

  const META_DIARIA = 2500000;

  // ─── KPIs REACTIVOS — se recalculan cada vez que llega una transacción del POS ───
  const kpis = React.useMemo(() => {
    const hoy = new Date().toLocaleDateString('es-CO');
    const txFiltradas = periodo === 'Hoy'
      ? transacciones.filter(t => t.fecha === hoy)
      : transacciones;

    const ingresos        = txFiltradas.reduce((s, t) => s + (t.total || 0), 0);
    const tickets         = txFiltradas.length;
    const ticketPromedio  = tickets > 0 ? Math.round(ingresos / tickets) : 0;
    const itemsVendidos   = txFiltradas.reduce((s, t) => s + (t.itemCount || 0), 0);
    const avanceMeta      = Math.min(100, Math.round((ingresos / META_DIARIA) * 100));

    // Ventas por hora
    const ventasPorHora = {};
    txFiltradas.forEach(t => {
      const h = t.hora ? t.hora.split(':')[0] + 'h' : '?';
      ventasPorHora[h] = (ventasPorHora[h] || 0) + t.total;
    });

    // Top platos
    const platosConteo = {};
    txFiltradas.forEach(t => {
      (t.items || []).forEach(item => {
        if (!platosConteo[item.name]) platosConteo[item.name] = { qty: 0, ventas: 0 };
        platosConteo[item.name].qty    += item.qty || 1;
        platosConteo[item.name].ventas += (item.price || 0) * (item.qty || 1);
      });
    });
    const topPlatos = Object.entries(platosConteo)
      .sort((a, b) => b[1].ventas - a[1].ventas)
      .slice(0, 5)
      .map(([nombre, v]) => ({ nombre, qty: v.qty, ventas: v.ventas, pct: 100 }));
    const maxVentas = topPlatos[0]?.ventas || 1;
    topPlatos.forEach(p => { p.pct = Math.round((p.ventas / maxVentas) * 100); });

    // Mix canales
    const porCanal = { 'Salón': 0, 'Delivery': 0, 'Para llevar': 0 };
    txFiltradas.forEach(t => {
      const c = t.canal || 'Salón';
      porCanal[c] = (porCanal[c] || 0) + t.total;
    });
    const totalCanal = Object.values(porCanal).reduce((s, v) => s + v, 1);
    const canalesPct = Object.entries(porCanal).map(([name, val]) => ({
      name, val, pct: Math.round((val / totalCanal) * 100),
    }));

    return { ingresos, tickets, ticketPromedio, itemsVendidos, avanceMeta, ventasPorHora, topPlatos, maxVentas, canalesPct, txFiltradas };
  }, [transacciones, periodo]);

  const maxVentaHora = Math.max(...Object.values(kpis.ventasPorHora), 1);
  const horasOrden   = ['11h','12h','13h','14h','15h','16h','17h','18h','19h','20h','21h','22h'];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1400px] mx-auto pb-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Ventas <span className="text-emerald-500">&</span> Finanzas</h2>
            <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-100 uppercase tracking-tighter">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              {kpis.tickets} ventas registradas
            </span>
          </div>
          <p className="text-xs text-gray-500 font-medium mt-1">Sincronizado con POS en tiempo real · {new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100 mr-2">
            {['Hoy', '7 días', 'Este mes', 'Trimestre'].map(d => (
              <button key={d} onClick={() => setPeriodo(d)} className={\`px-4 py-1.5 rounded-lg text-xs font-black transition-all \${periodo === d ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}\`}>{d}</button>
            ))}
          </div>
          <button className="px-4 py-2 bg-white border border-gray-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-tight hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm">📥 Exportar P&L</button>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-tight hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-100">Cierre de Caja</button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          KPIs PRINCIPALES — ESTOS SON LOS 4 BLOQUES DE LA IMAGEN
          Se recalculan automáticamente con cada pago registrado en POS
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* KPI 1 — INGRESOS TOTALES */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex justify-between">
            Ingresos Totales ({periodo}) <span className="text-lg">💰</span>
          </p>
          <p className="text-2xl font-black text-slate-800">{formatearMonto(kpis.ingresos)}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={\`text-[10px] font-black px-1.5 py-0.5 rounded \${kpis.tickets > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}\`}>
              {kpis.tickets > 0 ? \`+\${kpis.tickets} ventas\` : 'Sin ventas aún'}
            </span>
            <span className="text-[10px] font-bold text-gray-400">registradas desde POS</span>
          </div>
        </div>

        {/* KPI 2 — TICKET PROMEDIO */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex justify-between">
            Ticket Promedio <span className="text-lg">🧾</span>
          </p>
          <p className="text-2xl font-black text-slate-800">{formatearMonto(kpis.ticketPromedio)}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={\`text-[10px] font-black px-1.5 py-0.5 rounded \${kpis.tickets > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}\`}>
              {kpis.tickets > 0 ? \`\${kpis.tickets} órdenes\` : '—'}
            </span>
            <span className="text-[10px] font-bold text-gray-400">promedio por cobro</span>
          </div>
        </div>

        {/* KPI 3 — CLIENTES ATENDIDOS */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex justify-between">
            Clientes Atendidos <span className="text-lg">👥</span>
          </p>
          <p className="text-2xl font-black text-slate-800">{kpis.itemsVendidos > 0 ? \`\${kpis.tickets} pax\` : '0 pax'}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={\`text-[10px] font-black px-1.5 py-0.5 rounded \${kpis.itemsVendidos > 0 ? 'bg-gray-100 text-slate-600' : 'bg-gray-100 text-gray-400'}\`}>
              {kpis.itemsVendidos > 0 ? \`+\${kpis.itemsVendidos} ítems\` : '—'}
            </span>
            <span className="text-[10px] font-bold text-gray-400">mesas cerradas hoy</span>
          </div>
        </div>

        {/* KPI 4 — AVANCE VS META DIARIA */}
        <div className={\`p-5 rounded-2xl border shadow-sm flex flex-col justify-between relative overflow-hidden \${kpis.avanceMeta >= 100 ? 'bg-emerald-50 border-emerald-300' : kpis.avanceMeta >= 60 ? 'bg-emerald-50/30 border-emerald-200' : 'bg-white border-gray-100'}\`}>
          <p className={\`text-[10px] font-black uppercase tracking-widest mb-1 flex justify-between \${kpis.avanceMeta >= 60 ? 'text-emerald-600' : 'text-gray-400'}\`}>
            Avance vs Meta Diaria <span className="text-lg">🎯</span>
          </p>
          <p className={\`text-2xl font-black \${kpis.avanceMeta >= 100 ? 'text-emerald-600' : kpis.avanceMeta >= 60 ? 'text-emerald-700' : 'text-slate-800'}\`}>
            {kpis.avanceMeta}%
          </p>
          <div className="mt-2">
            <div className="w-full bg-emerald-100 h-1.5 rounded-full overflow-hidden mb-1">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: \`\${kpis.avanceMeta}%\` }}
              ></div>
            </div>
            <span className="text-[10px] font-bold text-emerald-600">
              {formatearMonto(kpis.ingresos)} / {formatearMonto(META_DIARIA)} · {kpis.avanceMeta >= 100 ? '¡Meta alcanzada!' : kpis.avanceMeta >= 60 ? 'En Camino' : 'Por debajo'}
            </span>
          </div>
        </div>

      </div>
      {/* FIN KPIs PRINCIPALES */}

      {/* GRÁFICO VENTAS POR HORA + MIX CANALES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 flex flex-col">
          <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-1 h-4 bg-slate-900 rounded-full"></span>
            Ventas por Hora (Tiempo Real)
          </h3>
          {Object.keys(kpis.ventasPorHora).length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
              <p className="text-4xl mb-3 opacity-20">📊</p>
              <p className="text-sm font-bold text-gray-300">Las barras aparecerán aquí</p>
              <p className="text-xs text-gray-300 mt-1">conforme registres pagos en el POS</p>
            </div>
          ) : (
            <div className="flex-1 flex items-end gap-2 h-40">
              {horasOrden.map((h, i) => {
                const v = kpis.ventasPorHora[h] || 0;
                const pct = maxVentaHora > 0 ? (v / maxVentaHora) * 100 : 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                    <div className="w-full bg-emerald-500 rounded-t-md hover:bg-emerald-600 transition-colors" style={{ height: \`\${pct}%\`, minHeight: v > 0 ? '4px' : '0' }}></div>
                    <span className="text-[9px] font-black text-gray-400">{h}</span>
                    {v > 0 && <div className="absolute -top-6 bg-slate-800 text-white text-[9px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">{compactMonto(v)}</div>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="lg:col-span-4 bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 flex flex-col">
          <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-1 h-4 bg-slate-900 rounded-full"></span>
            Mix de Canales
          </h3>
          <div className="space-y-5 flex-1 justify-center flex flex-col">
            {kpis.canalesPct.map((c, i) => {
              const colores = ['bg-indigo-500', 'bg-emerald-500', 'bg-amber-500'];
              return (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-black text-slate-800">{c.name} <span className="text-[9px] text-gray-400">({c.pct}%)</span></span>
                    <span className="text-xs font-black text-slate-800">{compactMonto(c.val)}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden mb-1">
                    <div className={\`h-full \${colores[i]} rounded-full transition-all duration-700\`} style={{ width: \`\${c.pct}%\` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* TABLA TRANSACCIONES + TOP PLATOS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1 h-4 bg-slate-900 rounded-full"></span>
              Transacciones del Día
            </h3>
            <div className="flex gap-2">
              <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border border-emerald-100">{kpis.txFiltradas.length} cobradas</span>
              <button className="px-3 py-1 bg-white border border-gray-200 text-slate-700 rounded-lg text-xs font-black uppercase tracking-tight hover:bg-gray-50 flex items-center gap-1 shadow-sm">📥 Exportar</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="p-3 text-[10px] font-black text-gray-400 uppercase tracking-widest pl-6"># Orden</th>
                  <th className="p-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Hora</th>
                  <th className="p-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Mesa / Cliente</th>
                  <th className="p-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Canal</th>
                  <th className="p-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Ítems</th>
                  <th className="p-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                  <th className="p-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Pago</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {kpis.txFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-10 text-center text-gray-300 text-sm italic">
                      Las transacciones aparecerán aquí al cobrar en el POS
                    </td>
                  </tr>
                ) : (
                  kpis.txFiltradas.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-3 pl-6 text-xs font-black text-slate-800">{t.id}</td>
                      <td className="p-3 text-xs font-bold text-gray-500">{t.hora}</td>
                      <td className="p-3 text-xs font-bold text-slate-700">{t.cliente}</td>
                      <td className="p-3"><span className="text-[9px] font-black px-2 py-1 rounded bg-gray-100 text-slate-600">{t.canal}</span></td>
                      <td className="p-3 text-xs font-bold text-gray-500 text-center">{t.itemCount}</td>
                      <td className="p-3 text-xs font-black text-slate-800">{formatearMonto(t.total)}</td>
                      <td className="p-3"><span className="text-[9px] font-black px-2 py-1 rounded bg-emerald-50 text-emerald-600 border border-emerald-100">{t.metodoPago}</span></td>
                      <td className="p-3 text-right pr-6">
                        <button onClick={() => setOrdenSeleccionada(t)} className="text-[10px] font-black text-emerald-600 hover:text-emerald-800 uppercase tracking-tight">Ver Detalle</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 flex flex-col">
          <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-1 h-4 bg-amber-500 rounded-full"></span>
            Platos Más Vendidos 🏆
          </h3>
          <div className="space-y-4 flex-1">
            {kpis.topPlatos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-3xl mb-2 opacity-20">🍽</p>
                <p className="text-xs font-bold text-gray-300">El ranking se actualiza</p>
                <p className="text-xs text-gray-300">con cada venta del POS</p>
              </div>
            ) : (
              kpis.topPlatos.map((p, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex gap-2">
                      <span className="text-[10px] font-black w-4 text-gray-300 group-hover:text-amber-500 transition-colors">0{i+1}</span>
                      <p className="text-xs font-black text-slate-800 leading-none mt-0.5 group-hover:text-amber-600 transition-colors">{p.nombre}</p>
                    </div>
                    <p className="text-xs font-black text-slate-800">{compactMonto(p.ventas)}</p>
                  </div>
                  <div className="flex justify-between items-center pl-6 mb-1">
                    <p className="text-[9px] text-gray-400 font-bold">{p.qty} unidades</p>
                  </div>
                  <div className="ml-6 h-1 w-full bg-gray-50 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 group-hover:bg-amber-500 transition-colors rounded-full" style={{ width: \`\${p.pct}%\` }}></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* SEPARADOR FINANZAS */}
      <div className="py-4 mt-8 mb-4 relative flex items-center justify-center">
        <div className="absolute w-full h-px bg-gray-200"></div>
        <span className="bg-[#f8f9fc] px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest relative z-10">Finanzas & Rentabilidad</span>
      </div>

      {/* KPIs FINANZAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1 flex justify-between">Ingresos del Mes <span className="text-lg">💰</span></p>
          <p className="text-2xl font-black text-slate-800">$28.4M</p>
          <div className="flex items-center gap-2 mt-2"><span className="text-[10px] font-black bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">+14.2%</span><span className="text-[10px] font-bold text-gray-400">vs abril 2025</span></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1 flex justify-between">Costos Totales <span className="text-lg">📉</span></p>
          <p className="text-2xl font-black text-slate-800">$19.8M</p>
          <div className="flex items-center gap-2 mt-2"><span className="text-[10px] font-black bg-red-50 text-red-600 px-1.5 py-0.5 rounded">+8.1%</span><span className="text-[10px] font-bold text-gray-400">Gasto operativo</span></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1 flex justify-between">Utilidad Neta <span className="text-lg">🥧</span></p>
          <p className="text-2xl font-black text-slate-800">$8.6M</p>
          <div className="flex items-center gap-2 mt-2"><span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded">30.3%</span><span className="text-[10px] font-bold text-gray-400">Proyección de cierre</span></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1 flex justify-between">Flujo Caja Disponible <span className="text-lg">🏦</span></p>
          <p className="text-2xl font-black text-slate-800">$6.2M</p>
          <div className="flex items-center gap-2 mt-2"><span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded">+</span><span className="text-[10px] font-bold text-gray-400">Disponible real</span></div>
        </div>
      </div>

      {/* COSTOS CRÍTICOS */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-6">
        <div className="mb-6">
          <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><span className="w-1 h-4 bg-slate-900 rounded-full"></span>Los 3 Costos que definen tu rentabilidad</h3>
          <p className="text-[10px] text-gray-400 font-bold mt-1">Estándar del sector: Food ≤30% · Labor ≤30% · Fijos ≤20%</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          <div className="md:pr-6 pt-4 md:pt-0">
            <p className="text-xs font-black text-slate-800 mb-2">Food Cost (Comida & Bebida)</p>
            <div className="flex items-end gap-3 mb-2"><span className="text-4xl font-black text-emerald-500">28.4%</span><span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full border border-emerald-100 mb-1">Saludable</span></div>
            <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden mb-2"><div className="h-full bg-emerald-500" style={{width:'28.4%'}}></div></div>
            <div className="flex justify-between text-[10px] font-bold"><span className="text-gray-400">Meta: ≤30%</span><span className="text-slate-600">$8.06M</span></div>
          </div>
          <div className="md:px-6 pt-4 md:pt-0">
            <p className="text-xs font-black text-slate-800 mb-2">Labor Cost (Nómina & Personal)</p>
            <div className="flex items-end gap-3 mb-2"><span className="text-4xl font-black text-amber-500">33.7%</span><span className="text-[10px] font-black bg-amber-50 text-amber-600 px-2 py-1 rounded-full border border-amber-100 mb-1">Revisar</span></div>
            <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden mb-2"><div className="h-full bg-amber-500" style={{width:'33.7%'}}></div></div>
            <div className="flex justify-between text-[10px] font-bold"><span className="text-gray-400">Meta: ≤30%</span><span className="text-slate-600">$9.57M</span></div>
          </div>
          <div className="md:pl-6 pt-4 md:pt-0">
            <p className="text-xs font-black text-slate-800 mb-2">Overhead (Arriendo & Fijos)</p>
            <div className="flex items-end gap-3 mb-2"><span className="text-4xl font-black text-rose-500">22.1%</span><span className="text-[10px] font-black bg-rose-50 text-rose-600 px-2 py-1 rounded-full border border-rose-100 mb-1">Optimizar</span></div>
            <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden mb-2"><div className="h-full bg-rose-500" style={{width:'22.1%'}}></div></div>
            <div className="flex justify-between text-[10px] font-bold"><span className="text-gray-400">Meta: ≤20%</span><span className="text-slate-600">$6.27M</span></div>
          </div>
        </div>
      </div>

      {/* EQUILIBRIO + FLUJO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-slate-900 rounded-[32px] shadow-sm p-8 flex flex-col justify-center relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-2">Punto de Equilibrio · Meta $21.3M</h3>
            <p className="text-[11px] text-slate-400 font-bold mb-6 max-w-md">Has cubierto tus costos fijos y variables. Todo ingreso adicional genera utilidad pura.</p>
            <div className="relative h-6 bg-slate-800 rounded-full overflow-hidden mb-2 shadow-inner border border-slate-700">
              <div className="absolute top-0 left-0 h-full bg-emerald-500 transition-all duration-1000" style={{width:'100%'}}></div>
              <div className="absolute top-0 right-0 h-full bg-emerald-400 transition-all duration-1000 opacity-50" style={{width:'25%'}}></div>
            </div>
            <div className="flex justify-between items-center text-[10px] font-black">
              <span className="text-emerald-400">133% alcanzado</span>
              <span className="text-white">+$7.1M de excedente</span>
            </div>
          </div>
          <div className="absolute right-[-10%] top-[-20%] w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>
        <div className="lg:col-span-5 bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Flujo de Caja Semanal</h3>
            <div className="flex gap-3">
              <span className="flex items-center gap-1.5 text-[9px] font-black text-gray-400"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Entradas</span>
              <span className="flex items-center gap-1.5 text-[9px] font-black text-gray-400"><span className="w-2 h-2 rounded-full bg-rose-400/80"></span> Salidas</span>
            </div>
          </div>
          <div className="space-y-2.5 flex-1 justify-center flex flex-col">
            {[{d:'L',in:1.2,out:0.8},{d:'M',in:0.9,out:0.6},{d:'M',in:1.4,out:0.9},{d:'J',in:1.6,out:1.1},{d:'V',in:2.1,out:1.3},{d:'S',in:2.4,out:1.4},{d:'D',in:1.9,out:1.2}].map((f,i)=>(
              <div key={i} className="flex items-center gap-3">
                <span className="text-[10px] font-black text-gray-400 w-4">{f.d}</span>
                <div className="flex-1 relative h-3 bg-gray-50 rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full" style={{width:\`\${(f.in/3)*100}%\`}}></div>
                  <div className="absolute top-0 left-0 h-full bg-rose-400/80 rounded-full" style={{width:\`\${(f.out/3)*100}%\`}}></div>
                </div>
                <div className="flex gap-2 w-20 justify-end">
                  <span className="text-[9px] font-black text-emerald-600">+\${f.in}M</span>
                  <span className="text-[9px] font-black text-rose-500">-\${f.out}M</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL DETALLE ORDEN */}
      {ordenSeleccionada && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{ordenSeleccionada.id}</p>
                <h2 className="text-xl font-black text-slate-800">{ordenSeleccionada.cliente}</h2>
                <p className="text-sm text-gray-500 font-bold mt-1">{ordenSeleccionada.hora} · {ordenSeleccionada.canal}</p>
              </div>
              <span className="text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">{ordenSeleccionada.estado}</span>
            </div>
            <div className="p-6">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Productos</p>
              <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                {(ordenSeleccionada.items || []).map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <span className="text-sm font-black text-gray-400">{item.qty}x</span>
                      <span className="text-sm font-bold text-slate-700">{item.name}</span>
                    </div>
                    <span className="text-sm font-black text-slate-800">{formatearMonto((item.price || 0) * (item.qty || 1))}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between items-center text-sm"><span className="font-bold text-gray-500">Subtotal</span><span className="font-bold text-slate-700">{formatearMonto(ordenSeleccionada.subtotal)}</span></div>
                {ordenSeleccionada.descuento > 0 && <div className="flex justify-between items-center text-sm"><span className="font-bold text-rose-400">Descuento</span><span className="font-bold text-rose-400">-{formatearMonto(ordenSeleccionada.descuento)}</span></div>}
                <div className="flex justify-between items-center text-sm"><span className="font-bold text-gray-500">Impoconsumo (8%)</span><span className="font-bold text-slate-700">{formatearMonto(ordenSeleccionada.impuesto)}</span></div>
                {ordenSeleccionada.propina > 0 && <div className="flex justify-between items-center text-sm"><span className="font-bold text-indigo-500">Propina</span><span className="font-bold text-slate-700">{formatearMonto(ordenSeleccionada.propina)}</span></div>}
                <div className="flex justify-between items-center text-lg mt-2 pt-2 border-t border-gray-100">
                  <span className="font-black text-slate-800">Total cobrado</span>
                  <span className="font-black text-emerald-600">{formatearMonto(ordenSeleccionada.total)}</span>
                </div>
                <div className="flex justify-between items-center text-sm"><span className="font-bold text-gray-400">Método de pago</span><span className="font-bold text-slate-700">{ordenSeleccionada.metodoPago}</span></div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 grid grid-cols-2 gap-3">
              <button className="py-3 bg-white border border-gray-200 text-slate-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2">🖨️ Imprimir</button>
              <button className="py-3 bg-slate-900 border border-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-colors shadow-sm" onClick={() => setOrdenSeleccionada(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
\`;

t = t.substring(0, b4_start) + b4_code + '\\n\\n' + t.substring(b4_end);

fs.writeFileSync('Avance2135.html', t, 'utf8');
console.log('Applied exact modifications');
