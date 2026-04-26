const fs = require('fs');
const filePath = 'dashboard.html';
const lines = fs.readFileSync(filePath, 'utf8').split('\n');

// Lines 1272-1565 (1-indexed) → indices 1271 to 1564
const START = 1271; // inclusive (0-indexed)
const END = 1564;   // inclusive (0-indexed)

const newBlock = ` function MenuCategoriasBlock({ restauranteId, categorias = null, setCategorias = null }) {
  const [localCats, setLocalCats] = useState([
    { id: 'uuid-1', nombre: 'Entradas', canal: 'AMBOS', orden: 1, estado: 'ACTIVA', horario: null },
    { id: 'uuid-2', nombre: 'Almuerzos Ejecutivos', canal: 'SALON', orden: 2, estado: 'ACTIVA', horario: { inicio: '12:00', fin: '15:00', dias: ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'] } },
    { id: 'uuid-3', nombre: 'Pizzas Premium', canal: 'DELIVERY', orden: 3, estado: 'INACTIVA', horario: null }
  ]);

  const categorias = categorias || localCats;
  const setCategorias = setCategorias || setLocalCats;

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formError, setFormError] = useState('');
  const defaultForm = { nombre: '', canal: 'AMBOS', estado: 'ACTIVA', hasHorario: false, hora_inicio: '07:00', hora_fin: '22:00', dias: ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'] };
  const [formData, setFormData] = useState({ ...defaultForm });
  const dragItem = useRef();
  const dragOverItem = useRef();
  const [expandedSchedule, setExpandedSchedule] = useState(null);
  const [inlineHorario, setInlineHorario] = useState({});

  const DIAS_SEMANA = [{ id: 'LUNES', lbl: 'L' }, { id: 'MARTES', lbl: 'M' }, { id: 'MIERCOLES', lbl: 'X' }, { id: 'JUEVES', lbl: 'J' }, { id: 'VIERNES', lbl: 'V' }, { id: 'SABADO', lbl: 'S' }, { id: 'DOMINGO', lbl: 'D' }];

  const handleOpenModal = (cat = null) => {
    setFormError('');
    if (cat) {
      setEditingCategory(cat);
      setFormData({ nombre: cat.nombre, canal: cat.canal, estado: cat.estado, hasHorario: cat.horario !== null, hora_inicio: cat.horario?.inicio || '07:00', hora_fin: cat.horario?.fin || '22:00', dias: cat.horario?.dias || ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'] });
    } else {
      setEditingCategory(null);
      setFormData({ ...defaultForm });
    }
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setFormError('');
    const nombreLimpio = formData.nombre.trim();
    if (!nombreLimpio) return setFormError('El nombre de la categoría es obligatorio.');
    const isDuplicate = categorias.some(c => c.nombre.toLowerCase() === nombreLimpio.toLowerCase() && c.id !== editingCategory?.id);
    if (isDuplicate) return setFormError('Ya existe una categoría con este nombre (Error 409).');
    const nuevaCategoria = {
      id: editingCategory ? editingCategory.id : \`uuid-\${Date.now()}\`,
      nombre: nombreLimpio, canal: formData.canal,
      orden: editingCategory ? editingCategory.orden : (categorias.length > 0 ? Math.max(...categorias.map(c => c.orden)) + 1 : 1),
      estado: formData.estado,
      horario: formData.hasHorario ? { inicio: formData.hora_inicio, fin: formData.hora_fin, dias: formData.dias } : null
    };
    if (editingCategory) {
      setCategorias(categorias.map(c => c.id === editingCategory.id ? nuevaCategoria : c));
    } else {
      setCategorias([...categorias, nuevaCategoria]);
    }
    setShowModal(false);
  };

  const handleToggleEstado = (cat) => {
    const nuevoEstado = cat.estado === 'ACTIVA' ? 'INACTIVA' : 'ACTIVA';
    if (nuevoEstado === 'INACTIVA') {
      const ok = window.confirm(\`⚠️ Al desactivar "\${cat.nombre}" sus platos dejarán de aparecer en la carta.\\n\\n¿Continuar?\`);
      if (!ok) return;
    }
    setCategorias(categorias.map(c => c.id === cat.id ? { ...c, estado: nuevoEstado } : c));
    fetch('/api/categorias/toggle', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: cat.id, estado: nuevoEstado }) }).catch(() => {});
  };

  const handleDelete = (cat) => {
    const ok = window.confirm(\`🗑️ ¿Eliminar la categoría "\${cat.nombre}"?\\n\\nEsta acción es irreversible.\`);
    if (!ok) return;
    setCategorias(categorias.filter(c => c.id !== cat.id));
  };

  const handleDragStart = (e, position) => { dragItem.current = position; };
  const handleDragEnter = (e, position) => { dragOverItem.current = position; };
  const handleDragEnd = () => {
    const copy = [...categorias];
    const dragged = copy[dragItem.current];
    copy.splice(dragItem.current, 1);
    copy.splice(dragOverItem.current, 0, dragged);
    setCategorias(copy.map((c, i) => ({ ...c, orden: i + 1 })));
    dragItem.current = null; dragOverItem.current = null;
  };

  const handleToggleScheduleActive = (cat) => {
    if (cat.horario) {
      setCategorias(categorias.map(c => c.id === cat.id ? { ...c, horario: null } : c));
      setExpandedSchedule(null);
    } else {
      setInlineHorario(prev => ({ ...prev, [cat.id]: { inicio: '07:00', fin: '22:00', dias: ['LUNES','MARTES','MIERCOLES','JUEVES','VIERNES','SABADO','DOMINGO'] } }));
      setExpandedSchedule(cat.id);
    }
  };

  const toggleScheduleRow = (catId, currentHorario) => {
    if (expandedSchedule === catId) { setExpandedSchedule(null); return; }
    setInlineHorario(prev => ({ ...prev, [catId]: { inicio: currentHorario?.inicio || '07:00', fin: currentHorario?.fin || '22:00', dias: currentHorario?.dias || ['LUNES','MARTES','MIERCOLES','JUEVES','VIERNES','SABADO','DOMINGO'] } }));
    setExpandedSchedule(catId);
  };

  const handleInlineDayToggle = (catId, day) => {
    setInlineHorario(prev => {
      const dias = prev[catId]?.dias || [];
      return { ...prev, [catId]: { ...prev[catId], dias: dias.includes(day) ? dias.filter(d => d !== day) : [...dias, day] } };
    });
  };

  const handleSaveInlineSchedule = (cat) => {
    const h = inlineHorario[cat.id];
    if (!h || h.dias.length === 0) return;
    setCategorias(categorias.map(c => c.id === cat.id ? { ...c, horario: { inicio: h.inicio, fin: h.fin, dias: h.dias } } : c));
    setExpandedSchedule(null);
  };

  const toggleDay = (day) => {
    setFormData(f => ({ ...f, dias: f.dias.includes(day) ? f.dias.filter(d => d !== day) : [...f.dias, day] }));
  };

  const canalBadge = (canal) => {
    if (canal === 'SALON') return React.createElement('span', { className: 'text-[9px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 uppercase tracking-wide' }, 'Salón');
    if (canal === 'DELIVERY') return React.createElement('span', { className: 'text-[9px] font-black px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 uppercase tracking-wide' }, 'Delivery');
    return React.createElement('span', { className: 'text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 uppercase tracking-wide' }, 'Ambos');
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 border-b border-gray-100 gap-3">
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
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-3 py-2.5 w-8"></th>
              <th className="px-4 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nombre de la Categoría</th>
              <th className="px-4 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Canal Disponible</th>
              <th className="px-4 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Estado Inicial</th>
              <th className="px-4 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Restricción de Horario</th>
              <th className="px-4 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {[...categorias].sort((a,b) => a.orden - b.orden).map((cat, index) => (
              <React.Fragment key={cat.id}>
                <tr
                  draggable onDragStart={(e) => handleDragStart(e, index)} onDragEnter={(e) => handleDragEnter(e, index)}
                  onDragEnd={handleDragEnd} onDragOver={(e) => e.preventDefault()}
                  className={\`border-b border-gray-100 transition-colors cursor-grab active:cursor-grabbing hover:bg-slate-50 \${index % 2 === 1 ? 'bg-gray-50/40' : 'bg-white'} \${cat.estado === 'INACTIVA' ? 'opacity-55' : ''}\`}
                >
                  <td className="px-3 py-3 text-gray-300 hover:text-indigo-400"><GripVertical size={15}/></td>
                  <td className="px-4 py-3">
                    <span className={\`text-sm font-bold \${cat.estado === 'INACTIVA' ? 'text-gray-400 line-through' : 'text-slate-800'}\`}>{cat.nombre}</span>
                  </td>
                  <td className="px-4 py-3 text-center">{canalBadge(cat.canal)}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-col items-center gap-0.5">
                      <div onClick={() => handleToggleEstado(cat)} className={\`relative w-9 h-5 flex items-center rounded-full px-0.5 cursor-pointer transition-colors \${cat.estado === 'ACTIVA' ? 'bg-emerald-500' : 'bg-gray-300'}\`}>
                        <div className="w-3.5 h-3.5 bg-white rounded-full shadow-md transition-transform" style={{ transform: cat.estado === 'ACTIVA' ? 'translateX(16px)' : 'translateX(0)' }}></div>
                      </div>
                      <span className={\`text-[9px] font-bold \${cat.estado === 'ACTIVA' ? 'text-emerald-600' : 'text-gray-400'}\`}>{cat.estado === 'ACTIVA' ? 'Activa' : 'Inactiva'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-col items-center gap-0.5">
                      <div onClick={() => handleToggleScheduleActive(cat)} className={\`relative w-9 h-5 flex items-center rounded-full px-0.5 cursor-pointer transition-colors \${cat.horario ? 'bg-indigo-500' : 'bg-gray-300'}\`}>
                        <div className="w-3.5 h-3.5 bg-white rounded-full shadow-md transition-transform" style={{ transform: cat.horario ? 'translateX(16px)' : 'translateX(0)' }}></div>
                      </div>
                      {cat.horario
                        ? <button onClick={() => toggleScheduleRow(cat.id, cat.horario)} className="text-[9px] font-bold text-indigo-600 hover:underline mt-0.5">{cat.horario.inicio} – {cat.horario.fin}</button>
                        : <span className="text-[9px] font-medium text-gray-400">24/7</span>
                      }
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => handleOpenModal(cat)} title="Editar" className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center justify-center transition-colors"><Edit size={13}/></button>
                      <button onClick={() => handleDelete(cat)} title="Eliminar" className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"><Trash2 size={13}/></button>
                    </div>
                  </td>
                </tr>
                {expandedSchedule === cat.id && (
                  <tr className="bg-indigo-50/60 border-b border-indigo-100">
                    <td colSpan={6} className="px-6 py-4">
                      <div className="flex flex-wrap items-end gap-4">
                        <div>
                          <label className="text-[10px] font-black text-indigo-700 uppercase tracking-widest block mb-1">Inicio</label>
                          <input type="time" value={inlineHorario[cat.id]?.inicio || '07:00'} onChange={e => setInlineHorario(p => ({ ...p, [cat.id]: { ...p[cat.id], inicio: e.target.value } }))} className="border border-indigo-200 rounded-lg p-1.5 text-sm font-medium outline-none"/>
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-indigo-700 uppercase tracking-widest block mb-1">Fin</label>
                          <input type="time" value={inlineHorario[cat.id]?.fin || '22:00'} onChange={e => setInlineHorario(p => ({ ...p, [cat.id]: { ...p[cat.id], fin: e.target.value } }))} className="border border-indigo-200 rounded-lg p-1.5 text-sm font-medium outline-none"/>
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-indigo-700 uppercase tracking-widest block mb-1">Días Activos</label>
                          <div className="flex gap-1">
                            {DIAS_SEMANA.map(d => {
                              const sel = (inlineHorario[cat.id]?.dias || []).includes(d.id);
                              return <button key={d.id} onClick={() => handleInlineDayToggle(cat.id, d.id)} className={\`w-7 h-7 rounded-lg text-[11px] font-black transition-all \${sel ? 'bg-indigo-600 text-white' : 'bg-white text-gray-400 border border-gray-200 hover:border-indigo-300'}\`}>{d.lbl}</button>;
                            })}
                          </div>
                        </div>
                        <button onClick={() => handleSaveInlineSchedule(cat)} className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">Guardar</button>
                        <button onClick={() => setExpandedSchedule(null)} className="bg-white text-gray-500 text-xs font-bold px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">Cancelar</button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {categorias.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">No hay categorías. Crea la primera con "+ Nueva Categoría".</td></tr>
            )}
          </tbody>
        </table>
      </div>`;

// Also keep the modal and closing unchanged (lines 1460-1565 = indices 1459-1564)
// Identify end of old block: closing </div> and } of MenuCategoriasBlock
// We only replace up to (not including) the modal comment line

// Find line index of modal comment to keep modal intact
let modalStart = -1;
for (let i = START; i <= END; i++) {
  if (lines[i] && lines[i].includes('MODAL FORMULARIO DE CATEGORÍA')) {
    modalStart = i;
    break;
  }
}

if (modalStart === -1) {
  console.error('Could not find modal comment line. Aborting.');
  process.exit(1);
}

// Rebuild:
const before = lines.slice(0, START);                    // lines[0..1270]
const modal  = lines.slice(modalStart, END + 1);          // modal + closing of MenuCategoriasBlock
const after  = lines.slice(END + 1);                      // everything after MenuCategoriasBlock

const newContent = [...before, newBlock, ...modal, ...after].join('\n');
fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Done! Replaced MenuCategoriasBlock body (before modal). Modal + closing kept intact.');
console.log(`Total lines: ${newContent.split('\n').length}`);
