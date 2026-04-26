const fs = require('fs');

let code = fs.readFileSync('c:/Users/dayro/Desktop/Project # 3 Startup AI/RestPro AI/cartaya/dashboard.html', 'utf8');

// 1. Añadir variables de estado para escenarios
const search1 = `  // 4. Variables para Drag & Drop
  const dragItem = useRef();
  const dragOverItem = useRef();`;

const replace1 = `  // 4. Variables para Drag & Drop
  const dragItem = useRef();
  const dragOverItem = useRef();

  // 5. Escenarios Rápidos
  const [activeScenario, setActiveScenario] = useState(null);

  // Helper de Validación de Tiempo
  const checkSchedule = (horario) => {
    if (!horario) return true;
    const now = new Date();
    const daysMap = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
    const today = daysMap[now.getDay()];
    if (!horario.dias.includes(today)) return false;
    
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [hIn, mIn] = horario.inicio.split(':').map(Number);
    const [hFin, mFin] = horario.fin.split(':').map(Number);
    const timeInicio = hIn * 60 + mIn;
    const timeFin = hFin * 60 + mFin;
    
    if (timeFin < timeInicio) {
      return currentTime >= timeInicio || currentTime <= timeFin;
    } else {
      return currentTime >= timeInicio && currentTime <= timeFin;
    }
  };

  const handleScenarioClick = (escenario) => {
    setActiveScenario(escenario);
    if (escenario === 'Lunes normal') {
      setCategorias(categorias.map(c => ({...c, estado: 'ACTIVA'})));
    } else if (escenario === 'Mediodía ejecutivo') {
      setCategorias(categorias.map(c => {
        if (c.nombre.toLowerCase().includes('ejecutivo') || c.nombre.toLowerCase().includes('mediodía')) {
          return {...c, estado: 'ACTIVA'};
        }
        return c;
      }));
    } else if (escenario === 'Fin de semana') {
      setCategorias(categorias.map(c => {
        if (c.horario && !c.horario.dias.includes('SABADO') && !c.horario.dias.includes('DOMINGO')) {
          return {...c, estado: 'INACTIVA'};
        }
        return {...c, estado: 'ACTIVA'}; // Las demás permanecen activas
      }));
    } else if (escenario === 'Plato agotado') {
      window.alert('Selecciona el toggle Gris de la categoría que deseas ocultar en el día de hoy.');
    } else if (escenario === 'Cambio de temporada') {
      window.alert('Usa el botón "Editar Reglas" de cada categoría para extender sus horarios o canales según la nueva temporada.');
      setActiveScenario(null);
    }
  };
`;

code = code.replace(search1, replace1);

// 2. Clear scenario on manual toggle
const search2 = `  // Regla 3: No borrar, solo desactivar / Automatización 2
  const handleToggleEstado = (cat) => {
    const nuevoEstado = cat.estado === 'ACTIVA' ? 'INACTIVA' : 'ACTIVA';`;

const replace2 = `  // Regla 3: No borrar, solo desactivar / Automatización 2
  const handleToggleEstado = (cat) => {
    setActiveScenario(null); // Quitar preset puro
    const nuevoEstado = cat.estado === 'ACTIVA' ? 'INACTIVA' : 'ACTIVA';`;

code = code.replace(search2, replace2);

// 3. Añadir UI de escenarios y Modificar renderizado de categoría
const search3 = `      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm"><Layers size={20}/></div>
          <div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight">1. Categorías de la Carta</h3>
            <p className="text-xs text-gray-500 font-medium">Arrastra para reordenar. Define dónde y cuándo aparecen tus platos.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="btn bg-gray-100 text-gray-600 hover:bg-gray-200 py-2 px-3 text-xs shadow-sm"><UploadCloud size={14}/> CSV</button>
           <button onClick={() => handleOpenModal()} className="btn bg-slate-900 text-white hover:bg-slate-800 py-2 px-4 text-xs shadow-md"><Plus size={14}/> Nueva Categoría</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {categorias.sort((a, b) => a.orden - b.orden).map((cat, index) => (
          <div 
            key={cat.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()}
            className={\`flex flex-col justify-between p-4 border rounded-xl transition-all cursor-grab active:cursor-grabbing bg-white hover:shadow-md \${cat.estado === 'INACTIVA' ? 'border-gray-200 opacity-60 bg-gray-50' : 'border-gray-200 hover:border-indigo-200'}\`}
          >
            <div>
              <div className="flex items-start gap-2 mb-3">
                 <div className="text-gray-300 hover:text-indigo-400 transition-colors mt-0.5"><GripVertical size={16}/></div>
                 <div className="flex-1">
                    <div className="flex justify-between items-start gap-2">
                       <h4 className={\`font-bold text-sm \${cat.estado === 'INACTIVA' ? 'text-gray-500 line-through' : 'text-slate-800'}\`}>{cat.nombre}</h4>
                       <span className={\`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0
                         \${cat.canal === 'SALON' ? 'bg-emerald-100 text-emerald-700' : cat.canal === 'DELIVERY' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}
                       \`}>{cat.canal}</span>`;

const replace3 = `      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm"><Layers size={20}/></div>
          <div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight">1. Categorías de la Carta</h3>
            <p className="text-xs text-gray-500 font-medium">Arrastra para reordenar. Define dónde y cuándo aparecen tus platos.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="btn bg-gray-100 text-gray-600 hover:bg-gray-200 py-2 px-3 text-xs shadow-sm"><UploadCloud size={14}/> CSV</button>
           <button onClick={() => handleOpenModal()} className="btn bg-slate-900 text-white hover:bg-slate-800 py-2 px-4 text-xs shadow-md"><Plus size={14}/> Nueva Categoría</button>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-6">
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Escoge un momento del día a día</p>
         <div className="flex flex-wrap gap-2">
            {[
              { id: 'Lunes normal', icon: '☀️' },
              { id: 'Mediodía ejecutivo', icon: '🍲' },
              { id: 'Fin de semana', icon: '🎉' },
              { id: 'Plato agotado', icon: '⛔' },
              { id: 'Cambio de temporada', icon: '🔄' }
            ].map(esc => (
              <button 
                key={esc.id} 
                onClick={() => handleScenarioClick(esc.id)}
                className={\`text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-sm \${activeScenario === esc.id ? 'bg-[#1D9E75] text-white shadow-emerald-900/20' : 'bg-slate-800 text-white hover:bg-slate-700'}\`}
              >
                 <span>{esc.icon}</span> {esc.id}
              </button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {categorias.sort((a, b) => a.orden - b.orden).map((cat, index) => {
          const isScheduleActive = checkSchedule(cat.horario);
          const isManualActive = cat.estado === 'ACTIVA';
          const isEffectivelyActive = isManualActive && isScheduleActive;
          
          return (
          <div 
            key={cat.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()}
            className={\`flex flex-col justify-between p-4 border rounded-xl transition-all cursor-grab active:cursor-grabbing hover:shadow-md \${!isManualActive ? 'bg-gray-50 border-gray-200 opacity-60' : isEffectivelyActive ? 'bg-white border-emerald-200' : 'bg-yellow-50/30 border-yellow-200 opacity-80'}\`}
          >
            <div>
              <div className="flex items-start gap-2 mb-3">
                 <div className="text-gray-300 hover:text-indigo-400 transition-colors mt-0.5"><GripVertical size={16}/></div>
                 <div className="flex-1">
                    <div className="flex justify-between items-start gap-2">
                       <h4 className={\`font-bold text-sm \${!isManualActive ? 'text-gray-500 line-through' : 'text-slate-800'}\`}>{cat.nombre}</h4>
                       <span className={\`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0
                         \${cat.canal === 'SALON' ? 'bg-emerald-100 text-emerald-700' : cat.canal === 'DELIVERY' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}
                       \`}>{cat.canal}</span>`;

code = code.replace(search3, replace3);

const search4 = `              <div className="pl-6">
                {cat.horario ? (
                  <p className="text-[10px] font-semibold text-indigo-600 flex items-center gap-1.5 bg-indigo-50 w-fit px-2 py-1 rounded">
                    <Clock size={12}/> {cat.horario.inicio} - {cat.horario.fin} ({cat.horario.dias.length} días)
                  </p>
                ) : (
                  <p className="text-[10px] font-medium text-gray-400 flex items-center gap-1.5 px-2 py-1">
                    <Clock size={12}/> Disponible 24/7
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between pl-6">
               <button onClick={() => handleOpenModal(cat)} className="text-[10px] font-bold text-indigo-600 hover:underline">Editar Reglas</button>
               
               {/* Custom Toggle */}
               <div 
                 onClick={() => handleToggleEstado(cat)}
                 className={\`relative w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors \${cat.estado === 'ACTIVA' ? 'bg-emerald-500' : 'bg-gray-300'}\`}
               >
                 <div className={\`w-3.5 h-3.5 bg-white rounded-full shadow-md transform transition-transform \${cat.estado === 'ACTIVA' ? 'translate-x-4.5' : 'translate-x-0'}\`} style={{ transform: cat.estado === 'ACTIVA' ? 'translateX(18px)' : 'translateX(0)' }}></div>
               </div>
            </div>
          </div>
        ))}
      </div>`;

const replace4 = `                    </div>
                 </div>
              </div>
              <div className="pl-6">
                {cat.horario ? (
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] font-semibold text-indigo-600 flex items-center gap-1.5 bg-indigo-50 w-fit px-2 py-1 rounded">
                      <Clock size={12}/> {cat.horario.inicio} - {cat.horario.fin} ({cat.horario.dias.length} días)
                    </p>
                    {isManualActive && !isScheduleActive && <span className="text-[9px] font-black bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded border border-yellow-200 flex items-center gap-1"><AlertTriangle size={10}/> Pausado por Horario</span>}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] font-medium text-gray-400 flex items-center gap-1.5 px-2 py-1">
                      <Clock size={12}/> Disponible 24/7
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between pl-6 relative">
               <button onClick={() => handleOpenModal(cat)} className="text-[10px] font-bold text-indigo-600 hover:underline">Editar Reglas</button>
               
               {/* Custom Toggle */}
               <div 
                 onClick={() => handleToggleEstado(cat)}
                 className={\`relative w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors \${cat.estado === 'ACTIVA' ? 'bg-emerald-500' : 'bg-gray-300'}\`}
                 title="Pausar manualmente para todo el mundo"
               >
                 <div className={\`w-3.5 h-3.5 bg-white rounded-full shadow-md transform transition-transform \${cat.estado === 'ACTIVA' ? 'translate-x-4.5' : 'translate-x-0'}\`} style={{ transform: cat.estado === 'ACTIVA' ? 'translateX(18px)' : 'translateX(0)' }}></div>
               </div>
            </div>
          </div>
          )
        })}
      </div>`;

code = code.replace(search4, replace4);

fs.writeFileSync('c:/Users/dayro/Desktop/Project # 3 Startup AI/RestPro AI/cartaya/dashboard.html', code);

console.log('Categories module updated successfully with Quick Scenarios and Real-time validation.');
