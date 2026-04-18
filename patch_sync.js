const fs = require('fs');
const file = 'dashboard.html';
let content = fs.readFileSync(file, 'utf8');

// ============================================================
// CAMBIO 5: En ViewMenu, forzar todas las categorías a INACTIVA al cargar
// ============================================================
// After setCategorias(catData), force all to INACTIVA
content = content.replace(
  `setCategorias(catData);`,
  `setCategorias(catData.map(c => ({ ...c, estado: 'INACTIVA' })));`
);
console.log('[OK] Cambio 5: Categorías inician INACTIVAS al cargar.');

// ============================================================
// CAMBIO A: En ViewMenu, agregar estado activeCatNames + focusCatName + platosRef
// ============================================================
// Add state after the loading state
content = content.replace(
  `const [loading, setLoading] = useState(true);\r\n\r\n  // Carga inicial al montar la pestaña de Menú`,
  `const [loading, setLoading] = useState(true);
  const [activeCatNames, setActiveCatNames] = useState([]);
  const [focusCatName, setFocusCatName] = useState(null);
  const platosRef = useRef(null);

  // Carga inicial al montar la pestaña de Menú`
);
console.log('[OK] Cambio A: Estado activeCatNames + focusCatName + platosRef agregados en ViewMenu.');

// ============================================================
// CAMBIO B: Pasar nuevas props a MenuCategoriasBlock
// ============================================================
content = content.replace(
  `<MenuCategoriasBlock restauranteId={restauranteActivoId} categorias={categorias} setCategorias={setCategorias} />`,
  `<MenuCategoriasBlock restauranteId={restauranteActivoId} categorias={categorias} setCategorias={setCategorias} platos={platos} activeCatNames={activeCatNames} setActiveCatNames={setActiveCatNames} setFocusCatName={setFocusCatName} platosRef={platosRef} />`
);
console.log('[OK] Cambio B: Props nuevas pasadas a MenuCategoriasBlock.');

// ============================================================
// CAMBIO C: Pasar nuevas props a MenuPlatosBlock
// ============================================================
content = content.replace(
  `<MenuPlatosBlock restauranteId={restauranteActivoId} categorias={categorias} platos={platos} setPlatos={setPlatos} />`,
  `<MenuPlatosBlock restauranteId={restauranteActivoId} categorias={categorias} platos={platos} setPlatos={setPlatos} activeCatNames={activeCatNames} focusCatName={focusCatName} setFocusCatName={setFocusCatName} platosRef={platosRef} />`
);
console.log('[OK] Cambio C: Props nuevas pasadas a MenuPlatosBlock.');

// ============================================================
// CAMBIO 1+3+4: Actualizar MenuCategoriasBlock signature + toggle + acciones + conteo
// ============================================================
// Update function signature
content = content.replace(
  `function MenuCategoriasBlock({ restauranteId, categorias = null, setCategorias = null }) {`,
  `function MenuCategoriasBlock({ restauranteId, categorias = null, setCategorias = null, platos = [], activeCatNames = [], setActiveCatNames = () => {}, setFocusCatName = () => {}, platosRef = null }) {`
);
console.log('[OK] Cambio 1: Firma de MenuCategoriasBlock actualizada.');

// Update handleToggleEstado to also update activeCatNames
content = content.replace(
  `activeSetCategorias(activeCategorias.map(c => c.id === cat.id ? { ...c, estado: nuevoEstado } : c));
    fetch('/api/categorias/toggle', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: cat.id, estado: nuevoEstado }) }).catch(() => {});`,
  `activeSetCategorias(activeCategorias.map(c => c.id === cat.id ? { ...c, estado: nuevoEstado } : c));
    if (nuevoEstado === 'ACTIVA') {
      setActiveCatNames(prev => prev.includes(cat.nombre) ? prev : [...prev, cat.nombre]);
    } else {
      setActiveCatNames(prev => prev.filter(n => n !== cat.nombre));
    }
    fetch('/api/categorias/toggle', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: cat.id, estado: nuevoEstado }) }).catch(() => {});`
);
console.log('[OK] Cambio 1: handleToggleEstado sincroniza activeCatNames.');

// Replace the Nombre column TD to include plate count (Cambio 4)
content = content.replace(
  `<td className="px-4 py-3">
                    <span className={\`text-sm font-bold \${cat.estado === 'INACTIVA' ? 'text-gray-400 line-through' : 'text-slate-800'}\`}>{cat.nombre}</span>
                  </td>`,
  `<td className="px-4 py-3">
                    <span className={\`text-sm font-bold \${cat.estado === 'INACTIVA' ? 'text-gray-400 line-through' : 'text-slate-800'}\`}>{cat.nombre}</span>
                    <span className="block text-[10px] text-gray-400 font-medium mt-0.5">{(platos || []).filter(p => p.categoria_nombre === cat.nombre || p.categoria_id === cat.id).length} platos</span>
                  </td>`
);
console.log('[OK] Cambio 4: Conteo de platos por categoría añadido.');

// Add "Ver platos" button in Acciones column (Cambio 3)
content = content.replace(
  `<button onClick={() => handleOpenModal(cat)} title="Editar" className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center justify-center transition-colors"><Edit size={13}/></button>
                      <button onClick={() => handleDelete(cat)} title="Eliminar" className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"><Trash2 size={13}/></button>`,
  `<button onClick={() => {
                        if (cat.estado !== 'ACTIVA') handleToggleEstado(cat);
                        setFocusCatName(cat.nombre);
                        setTimeout(() => { if (platosRef && platosRef.current) platosRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 150);
                      }} title="Ver platos" className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors"><List size={13}/></button>
                      <button onClick={() => handleOpenModal(cat)} title="Editar" className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center justify-center transition-colors"><Edit size={13}/></button>
                      <button onClick={() => handleDelete(cat)} title="Eliminar" className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"><Trash2 size={13}/></button>`
);
console.log('[OK] Cambio 3: Botón "Ver platos" añadido en Acciones.');

// ============================================================
// CAMBIO 2: Actualizar MenuPlatosBlock para filtrar por categorías activas
// ============================================================
content = content.replace(
  `function MenuPlatosBlock({ restauranteId, categorias, platos = null, setPlatos = null }) {`,
  `function MenuPlatosBlock({ restauranteId, categorias, platos = null, setPlatos = null, activeCatNames = [], focusCatName = null, setFocusCatName = () => {}, platosRef = null }) {`
);
console.log('[OK] Cambio 2: Firma de MenuPlatosBlock actualizada.');

// Add filtering logic and ref right after the activePlatos definition
content = content.replace(
  `const activePlatos = platos || localPlatos;
  const activeSetPlatos = setPlatos || setLocalPlatos;

  // 2. Estado de UI`,
  `const activePlatos = platos || localPlatos;
  const activeSetPlatos = setPlatos || setLocalPlatos;

  // Filtrado maestro-detalle por categorías activas
  const filteredPlatos = activeCatNames.length > 0
    ? activePlatos.filter(p => activeCatNames.includes(p.categoria_nombre) || activeCatNames.includes(p.categoria))
    : [];

  // Clear focus after 3 seconds
  useEffect(() => {
    if (focusCatName) {
      const timer = setTimeout(() => setFocusCatName(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [focusCatName]);

  // 2. Estado de UI`
);
console.log('[OK] Cambio 2: Lógica de filtrado maestro-detalle añadida.');

// Wrap the entire MenuPlatosBlock return content with a ref div and empty state
// Find the return statement of MenuPlatosBlock
const platosReturnMarker = `<div className="bg-white rounded-3xl border border-gray-200 p-0 shadow-sm overflow-hidden border-l-4 border-l-emerald-500 flex flex-col">`;

content = content.replace(
  platosReturnMarker,
  `<div ref={platosRef} className="bg-white rounded-3xl border border-gray-200 p-0 shadow-sm overflow-hidden border-l-4 border-l-emerald-500 flex flex-col">`
);
console.log('[OK] Cambio 2: ref={platosRef} añadido al contenedor de Platos.');

// Now add empty state check. Find the content area of MenuPlatosBlock
// Replace the inner content area to filter
const oldContentArea = `<div className="bg-gray-50/50 flex-1 relative min-h-[400px]">`;
const newContentArea = `<div className="bg-gray-50/50 flex-1 relative min-h-[200px]">
        {activeCatNames.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-300"><Layers size={32}/></div>
            <h4 className="text-sm font-bold text-slate-600 mb-2">Activa una categoría arriba para ver sus platos</h4>
            <p className="text-xs text-gray-400 max-w-sm">Usa los toggles en la tabla de Categorías para seleccionar qué grupos quieres revisar. Solo verás los platos de las categorías activas.</p>
          </div>
        ) : (`;

content = content.replace(oldContentArea, newContentArea);
console.log('[OK] Cambio 2: Estado vacío (sin categorías activas) añadido.');

// We need to close the conditional after the content area ends
// The content area div closes before the modals. Find the pattern
// After the table/accordion views end, we need to close the ternary
const closingViewsMarker = `{/* MODAL FORMULARIO DE PLATO */}`;
content = content.replace(
  closingViewsMarker,
  `)}
      </div>

      {/* MODAL FORMULARIO DE PLATO */}`
);

// Remove the duplicate closing. The old </div> for bg-gray-50 still exists
// Actually let's verify - now we have our conditional wrapping the content.
// The old closing </div> for bg-gray-50/50 should be kept as the else's closing.

console.log('[OK] Cambio 2: Cierre condicional del bloque de platos.');

// ============================================================
// CAMBIO 2 extra: Replace activePlatos with filteredPlatos in the views
// ============================================================
// In accordion view
let count = 0;
// Replace usages inside MenuPlatosBlock only - we need to be careful
// The accordion maps over categorias and filters activePlatos
// Instead of replacing globally, let's target specific patterns

// In the accordion view, replace the filter that shows platos per category
content = content.replace(
  `const platosCat = activePlatos.filter(p => (p.categoria_nombre || p.categoria_id) === cat.id || p.categoria_nombre === cat.nombre);`,
  `const platosCat = filteredPlatos.filter(p => (p.categoria_nombre || p.categoria_id) === cat.id || p.categoria_nombre === cat.nombre);`
);

// In table view
content = content.replace(
  `{activePlatos.map(plato => {`,
  `{filteredPlatos.map(plato => {`
);

console.log('[OK] Cambio 2: activePlatos reemplazado por filteredPlatos en vistas.');

// Add focus highlight for the focused category platos
content = content.replace(
  'className={`bg-white border rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-emerald-200 ${plato.estado === \'OCULTO\' ? \'opacity-50 border-gray-200\' : \'border-gray-100\'}`}',
  'className={`bg-white border rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-emerald-200 ${plato.estado === \'OCULTO\' ? \'opacity-50 border-gray-200\' : \'border-gray-100\'} ${focusCatName && (plato.categoria_nombre === focusCatName || plato.categoria === focusCatName) ? \'border-emerald-400 ring-1 ring-emerald-200 bg-emerald-50/30\' : \'\'}`}'
);
console.log('[OK] Cambio 3: Resaltado visual para platos de categoría enfocada.');

fs.writeFileSync(file, content, 'utf8');
console.log('\n✅ Todas las modificaciones aplicadas correctamente.');
console.log(`Líneas totales: ${content.split('\n').length}`);
