const fs = require('fs');
const file = 'dashboard.html';
let content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

let startIdx = -1;
let endIdx = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('function MenuPlatosBlock')) {
        startIdx = i;
    }
    if (startIdx !== -1 && lines[i].includes('function MenuModificadoresBlock')) {
        endIdx = i;
        break;
    }
}

if (startIdx !== -1 && endIdx !== -1) {
    const newComponent = `// --- WIDGET: PLATOS E ÍTEMS DEL MENÚ (PASO 2) ---
function MenuPlatosBlock({ restauranteId, categorias, platos = null, setPlatos = null, activeCatNames = [], focusCatName = null, setFocusCatName = () => {}, platosRef = null }) {
  const [localPlatos, setLocalPlatos] = React.useState([
    { id: 'p-1', categoria_id: 'uuid-1', nombre: 'Empanadas (x3)', descripcion: 'Crujientes de carne desmechada', precio_venta: 12000, costo_produccion: 4000, canal: 'AMBOS', estado: 'DISPONIBLE', iva_pct: 8, margen_bruto: 66.67, foto_url: null },
    { id: 'p-2', categoria_id: 'uuid-1', nombre: 'Ceviche de Chicharrón', descripcion: '', precio_venta: 22000, costo_produccion: 8000, canal: 'SALON', estado: 'DISPONIBLE', iva_pct: 8, margen_bruto: 63.64, foto_url: null }
  ]);

  const activePlatos = platos || localPlatos;
  const activeSetPlatos = setPlatos || setLocalPlatos;

  const [viewMode, setViewMode] = React.useState('accordion'); 
  const [expandedCats, setExpandedCats] = React.useState(['uuid-1', 'uuid-2']); 
  const [showFormModal, setShowFormModal] = React.useState(false);
  const [showImportModal, setShowImportModal] = React.useState(false);
  const [editingPlato, setEditingPlato] = React.useState(null);
  const [formError, setFormError] = React.useState('');
  
  const defaultForm = { nombre: '', descripcion: '', precio_venta: '', costo_produccion: '', categoria_id: '', canal: 'AMBOS', estado: 'DISPONIBLE', iva_pct: '8' };
  const [formData, setFormData] = React.useState({ ...defaultForm });

  const formatCOP = (val) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(val);

  const handleOpenForm = (plato = null) => {
    setFormError('');
    if (plato) {
      setEditingPlato(plato);
      setFormData({ ...plato });
    } else {
      setEditingPlato(null);
      const primeraActiva = categorias.find(c => c.estado === 'ACTIVA');
      setFormData({ ...defaultForm, categoria_id: primeraActiva ? primeraActiva.id : '' });
    }
    setShowFormModal(true);
  };

  const handleSavePlato = (e) => {
    e.preventDefault();
    setFormError('');
    const catPadre = categorias.find(c => c.id === formData.categoria_id);
    if (!catPadre) return setFormError('Debes seleccionar una categoría.');
    if (catPadre.estado !== 'ACTIVA') return setFormError('Error 400: La categoría seleccionada está inactiva.');
    const nombreLimpio = formData.nombre.trim();
    if (!nombreLimpio) return setFormError('El nombre del plato es obligatorio.');
    const precio = Number(formData.precio_venta);
    if (!Number.isInteger(precio) || precio <= 0) return setFormError('El precio de venta debe ser un número entero positivo.');
    const nuevoPlato = { ...formData, id: editingPlato ? editingPlato.id : \`plato-\${Date.now()}\`, nombre: nombreLimpio, precio_venta: precio };
    if (editingPlato) {
      activeSetPlatos(activePlatos.map(p => p.id === editingPlato.id ? nuevoPlato : p));
    } else {
      activeSetPlatos([...activePlatos, nuevoPlato]);
    }
    setShowFormModal(false);
  };

  const handleToggleEstado = (plato, nuevoEstado) => {
    activeSetPlatos(activePlatos.map(p => p.id === plato.id ? { ...p, estado: nuevoEstado } : p));
  };

  const categoriasConPlatos = categorias.filter(c => activeCatNames.includes(c.nombre));
  const filteredPlatos = activePlatos.filter(p => activeCatNames.length === 0 || categoriasConPlatos.some(c => c.id === p.categoria_id));

  return (
    <div ref={platosRef} className="bg-white rounded-3xl border border-gray-200 p-0 shadow-sm overflow-hidden border-l-4 border-l-emerald-500 flex flex-col">
      <div className="p-6 border-b border-gray-100 bg-white relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">🍽</div>
            <div>
              <h3 className="text-lg font-black text-slate-800 tracking-tight">2. Platos e Ítems (El Core)</h3>
              <p className="text-xs text-gray-500">Agrega el producto que venderás.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-gray-100 p-1 rounded-lg flex items-center mr-2">
              <button onClick={() => setViewMode('accordion')} className={\`p-1.5 rounded transition-colors \${viewMode === 'accordion' ? 'bg-white shadow-sm text-slate-800' : 'text-gray-400 hover:text-slate-600'}\`}>≡</button>
              <button onClick={() => setViewMode('table')} className={\`p-1.5 rounded transition-colors \${viewMode === 'table' ? 'bg-white shadow-sm text-slate-800' : 'text-gray-400 hover:text-slate-600'}\`}>⊞</button>
            </div>
            <button onClick={() => setShowImportModal(true)} className="btn bg-gray-100 text-gray-600 hover:bg-gray-200 py-2 px-3 text-xs shadow-sm">☁ Importar CSV</button>
            <button onClick={() => handleOpenForm()} className="btn bg-emerald-500 text-white hover:bg-emerald-600 py-2 px-4 text-xs shadow-md shadow-emerald-500/20">+ Agregar Plato</button>
          </div>
        </div>
      </div>

      <div className="bg-gray-50/50 flex-1 relative min-h-[200px]">
        {activeCatNames.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-300">⊞</div>
            <h4 className="text-sm font-bold text-slate-600 mb-2">Activa una categoría arriba para ver sus platos</h4>
          </div>
        ) : (
          <React.Fragment>
            {viewMode === 'accordion' && (
              <div className="p-6 space-y-4">
                {categoriasConPlatos.map(cat => (
                  <div key={cat.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50">
                      <h4 className="font-bold text-sm text-slate-800">{cat.nombre}</h4>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {viewMode === 'table' && (
              <div className="overflow-x-auto p-0">
                <table className="w-full bg-white text-xs">
                  <thead className="bg-gray-50">
                    <tr><th className="px-4 py-2">Plato</th><th className="px-4 py-2">Precio</th><th className="px-4 py-2 text-right">Acciones</th></tr>
                  </thead>
                  <tbody>
                    {filteredPlatos.map(plato => (
                      <tr key={plato.id} className="border-b">
                        <td className="px-4 py-2 font-bold">{plato.nombre}</td>
                        <td className="px-4 py-2">{formatCOP(plato.precio_venta)}</td>
                        <td className="px-4 py-2 text-right">
                          <button onClick={() => handleOpenForm(plato)} className="text-indigo-600 font-bold">Editar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </React.Fragment>
        )}
      </div>

      {showFormModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl p-6">
            <h3 className="font-black text-slate-800 mb-4">{editingPlato ? 'Editar Plato' : 'Nuevo Plato'}</h3>
            <form onSubmit={handleSavePlato} className="space-y-4">
              <input type="text" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} placeholder="Nombre" className="w-full p-3 border rounded-xl" required />
              <input type="number" value={formData.precio_venta} onChange={(e) => setFormData({...formData, precio_venta: e.target.value})} placeholder="Precio" className="w-full p-3 border rounded-xl" required />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowFormModal(false)} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold">Cancelar</button>
                <button type="submit" className="flex-[2] py-3 bg-emerald-600 text-white rounded-xl font-bold">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showImportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 text-white rounded-3xl w-full max-w-xl p-8 border border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-lg">Importación CSV</h3>
              <button onClick={() => setShowImportModal(false)}>✕</button>
            </div>
            <div className="border-2 border-dashed border-slate-600 rounded-xl p-10 text-center">
              <p className="text-sm font-bold text-slate-300">Arrastra tu archivo .CSV aquí</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

`;
    lines.splice(startIdx, endIdx - startIdx, newComponent);
    fs.writeFileSync(file, lines.join('\n'), 'utf8');
    console.log('Successfully restored MenuPlatosBlock.');
} else {
    console.error('Start or End markers not found.');
}
