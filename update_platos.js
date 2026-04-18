const fs = require('fs');

let lines = fs.readFileSync('c:/Users/dayro/Desktop/Project # 3 Startup AI/RestPro AI/cartaya/dashboard.html', 'utf8').split('\n');
let out = [];
let i = 0;

while (i < lines.length) {
  const line = lines[i];

  if (line.includes("const categoriasConPlatos = categorias.filter(c => c.estado === 'ACTIVA' || activePlatos.some(p => p.categoria_id === c.id));")) {
    out.push(`  const [showAllPlatosModal, setShowAllPlatosModal] = useState(false);

  const checkSchedule = (horario) => {
    if (!horario) return true;
    const now = new Date();
    const daysMap = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
    if (!horario.dias.includes(daysMap[now.getDay()])) return false;
    const currentMins = now.getHours() * 60 + now.getMinutes();
    const [hIn, mIn] = horario.inicio.split(':').map(Number);
    const [hFin, mFin] = horario.fin.split(':').map(Number);
    const startMins = hIn * 60 + mIn;
    const endMins = hFin * 60 + mFin;
    if (endMins < startMins) return currentMins >= startMins || currentMins <= endMins;
    return currentMins >= startMins && currentMins <= endMins;
  };

  const mapCatIdToName = {};
  categorias.forEach(c => mapCatIdToName[c.id] = c.nombre);

  const activeCategoryIds = new Set(
    categorias
      .filter(c => c.estado === 'ACTIVA' && checkSchedule(c.horario))
      .map(c => c.id)
  );

  let platosActivos = activePlatos.filter(p => activeCategoryIds.has(p.categoria_id));
  platosActivos.sort((a,b) => (a.orden_en_categoria || 0) - (b.orden_en_categoria || 0));
  
  const previewPlatos = platosActivos.slice(0, 3);
  
  const groupedPlatos = {};
  platosActivos.forEach(p => {
    const cName = mapCatIdToName[p.categoria_id] || 'Otras';
    if(!groupedPlatos[cName]) groupedPlatos[cName] = [];
    groupedPlatos[cName].push(p);
  });
`);
    i++;
    continue;
  }

  if (line.includes("<div className=\"bg-gray-100 p-1 rounded-lg flex items-center mr-2\">")) {
    // Skip 4 lines (the viewMode buttons)
    i += 4;
    continue;
  }

  // The main block to replace
  if (line.includes('<div className="bg-gray-50/50 flex-1 relative min-h-[400px]">')) {
    out.push(`      <div className="bg-gray-50/50 flex-1 relative p-6">
        {activeCategoryIds.size === 0 ? (
           <div className="border border-dashed border-gray-300 rounded-2xl p-10 flex flex-col justify-center items-center text-center bg-white">
              <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4"><UtensilsCrossed size={32}/></div>
              <h4 className="text-sm font-bold text-slate-800 mb-2">No hay categorías activas</h4>
              <p className="text-xs text-gray-500 max-w-sm">Activa al menos una categoría en el bloque superior para ver los platos disponibles en este momento.</p>
           </div>
        ) : (
           <div className="space-y-3">
              <h4 className="text-[10px] font-black tracking-widest uppercase text-slate-400 mb-3 ml-2 border-b border-gray-200 pb-2">Platos Destacados (Top 3)</h4>
              {previewPlatos.map(plato => (
                 <div key={plato.id} className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm flex items-center justify-between gap-4 hover:border-emerald-300 transition-colors">
                    <div className="flex items-center gap-4 flex-1">
                       <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                          {plato.foto_url ? <img src={plato.foto_url} className="w-full h-full object-cover rounded-lg"/> : <ImageIcon size={20}/>}
                       </div>
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                             <h4 className="font-bold text-sm text-slate-800">{plato.nombre}</h4>
                             <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 uppercase">{mapCatIdToName[plato.categoria_id]}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs">
                             <span className="font-black text-slate-900">{formatCOP(plato.precio_venta)}</span>
                             <span className={\`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border \${plato.canal === 'SALON' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : plato.canal === 'DELIVERY' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-700 border-gray-200'}\`}>{plato.canal}</span>
                             <span className="flex items-center gap-1 text-gray-500 text-[10px]"><div className={\`w-1.5 h-1.5 rounded-full \${plato.estado === 'DISPONIBLE' ? 'bg-emerald-500' : plato.estado === 'AGOTADO' ? 'bg-red-500' : 'bg-gray-400'}\`}></div> {plato.estado}</span>
                          </div>
                       </div>
                    </div>
                    <button onClick={() => handleOpenForm(plato)} className="text-[10px] font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors">Editar Plato</button>
                 </div>
              ))}
              
              {platosActivos.length > 3 && (
                 <button onClick={() => setShowAllPlatosModal(true)} className="w-full py-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 border-dashed transition-colors flex items-center justify-center gap-2 mt-4">
                    <List size={14}/> + Ver todos los platos ({platosActivos.length})
                 </button>
              )}
           </div>
        )}
      </div>

      {showAllPlatosModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-gray-50 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
              <div className="px-6 py-5 border-b border-gray-200 bg-white flex justify-between items-center shrink-0">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center"><List size={16} /></div>
                    <div>
                       <h3 className="font-black text-slate-800 text-lg leading-tight">Todos los platos activos</h3>
                       <p className="text-[10px] text-gray-500 font-medium">Actualizado en tiempo real según categorías</p>
                    </div>
                 </div>
                 <button onClick={() => setShowAllPlatosModal(false)} className="text-gray-400 hover:text-slate-800 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"><X size={16}/></button>
              </div>
              
              <div className="overflow-y-auto flex-1 p-6 space-y-8">
                 {Object.keys(groupedPlatos).map(catName => (
                   <div key={catName}>
                      <h4 className="text-[11px] font-black tracking-widest uppercase text-slate-400 mb-3 border-b border-gray-200 pb-2">{catName} <span className="float-right text-gray-300">{groupedPlatos[catName].length} ítems</span></h4>
                      <div className="space-y-3">
                         {groupedPlatos[catName].map(plato => (
                           <div key={plato.id} className="bg-white border border-gray-200 p-3 rounded-xl shadow-sm flex items-center justify-between gap-4 hover:border-emerald-300 transition-colors">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                 <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 shrink-0">
                                    {plato.foto_url ? <img src={plato.foto_url} className="w-full h-full object-cover rounded-lg"/> : <ImageIcon size={16}/>}
                                 </div>
                                 <div className="min-w-0">
                                    <h4 className="font-bold text-xs text-slate-800 truncate mb-1">{plato.nombre}</h4>
                                    <div className="flex flex-wrap items-center gap-2 text-[10px]">
                                       <span className="font-black text-slate-900">{formatCOP(plato.precio_venta)}</span>
                                       <span className={\`font-bold uppercase px-1.5 py-0.5 rounded border \${plato.canal === 'SALON' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : plato.canal === 'DELIVERY' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-700 border-gray-200'}\`}>{plato.canal}</span>
                                       <span className="flex items-center gap-1 text-gray-500 font-medium"><div className={\`w-1.5 h-1.5 rounded-full \${plato.estado === 'DISPONIBLE' ? 'bg-emerald-500' : plato.estado === 'AGOTADO' ? 'bg-red-500' : 'bg-gray-400'}\`}></div> {plato.estado}</span>
                                    </div>
                                 </div>
                              </div>
                              <button onClick={() => {
                                 setShowAllPlatosModal(false);
                                 handleOpenForm(plato);
                              }} className="text-[10px] font-bold text-slate-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-2 py-1.5 rounded-lg transition-colors shrink-0">Editar</button>
                           </div>
                         ))}
                      </div>
                   </div>
                 ))}
                 
                 {platosActivos.length === 0 && (
                   <div className="text-center text-gray-400 text-sm py-10">No hay platos para mostrar.</div>
                 )}
              </div>
           </div>
        </div>
      )}
`);
    // Now skip everything until {/* MODAL FORMULARIO DE PLATO */}
    while (i < lines.length && !lines[i].includes('{/* MODAL FORMULARIO DE PLATO */}')) {
      i++;
    }
    continue;
  }

  // Also remove the large block of imports from node for the next scripts
  out.push(line);
  i++;
}

fs.writeFileSync('c:/Users/dayro/Desktop/Project # 3 Startup AI/RestPro AI/cartaya/dashboard.html', out.join('\n'));
console.log('Update Platos Script finished successfully.');
