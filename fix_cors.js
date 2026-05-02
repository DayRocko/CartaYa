const fs = require('fs');
const content = fs.readFileSync('Avance2135.html', 'utf8');

// --- 1. Replace loadInitialData with offline-first version ---
const oldLoad = `  const loadInitialData = async () => {
    try {
      const [resPlatos, resCats, resRecetas, resInv] = await Promise.all([
        fetch('/api/platos').then(r => r.json()),
        fetch('/api/categorias').then(r => r.json()),
        fetch('/api/recetas').then(r => r.json()),
        fetch('/api/inventario').then(r => r.json())
      ]);
      setPlatos(resPlatos || []);
      setCategorias(resCats || []);
      setRecetas(resRecetas || []); // FIX: Array
      setInventario(resInv || []);
    } catch (err) {
      console.error("Error cargando datos:", err);
    }
  };`;

const newLoad = `  const loadInitialData = async () => {
    // Offline-first: try API, fall back to MOCK_DATA when running as file://
    const tryFetch = async (url, fallback) => {
      try {
        const r = await fetch(url);
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return await r.json();
      } catch (_) {
        return fallback;
      }
    };
    const [resPlatos, resCats, resRecetas, resInv] = await Promise.all([
      tryFetch('/api/platos',     MOCK_DATA.platos     || []),
      tryFetch('/api/categorias', MOCK_DATA.categorias || []),
      tryFetch('/api/recetas',    []),
      tryFetch('/api/inventario', {})
    ]);
    setPlatos(resPlatos     || MOCK_DATA.platos     || []);
    setCategorias(resCats   || MOCK_DATA.categorias || []);
    setRecetas(Array.isArray(resRecetas) ? resRecetas : []);
    setInventario(resInv    || {});
  };`;

// --- 2. Replace handleGuardarReceta with local-state version ---
const oldGuardar = `  // FLUJO 1: Carta & Menú Ã¢â€ â€™ Inventario (al guardar receta)
  const handleGuardarReceta = async (platoId, nuevosIngredientes) => {
    try {
      await fetch('/api/recetas/' + platoId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevosIngredientes)
      });
      loadInitialData();
    } catch (e) { console.error(e); }
  };`;

// We'll keep the same key but use a looser match
const newGuardar = `  // FLUJO 1: Carta & Menú → Inventario (al guardar receta)
  const handleGuardarReceta = async (platoId, nuevosIngredientes) => {
    // Update local state immediately; sync to API if available
    setRecetas(prev => {
      const next = Array.isArray(prev) ? [...prev] : [];
      const idx = next.findIndex(r => r.platoId === platoId);
      if (idx >= 0) next[idx] = { platoId, ingredientes: nuevosIngredientes };
      else next.push({ platoId, ingredientes: nuevosIngredientes });
      return next;
    });
    try {
      await fetch('/api/recetas/' + platoId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevosIngredientes)
      });
    } catch (_) { /* offline — local state already updated */ }
  };`;

// --- 3. Replace handleTogglePlato with local-state version ---
const oldToggle = `  const handleTogglePlato = async (platoId, activo) => {
    try {
      await fetch('/api/platos/' + platoId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo })
      });
      loadInitialData();
    } catch (e) { console.error(e); }
  };`;

const newToggle = `  const handleTogglePlato = async (platoId, activo) => {
    setPlatos(prev => prev.map(p => p.id === platoId ? { ...p, estado: activo ? 'activo' : 'inactivo' } : p));
    try {
      await fetch('/api/platos/' + platoId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo })
      });
    } catch (_) { /* offline — local state already updated */ }
  };`;

// --- 4. Replace handleConfirmarPedido with local-state version ---
const oldConfirmar = `  const handleConfirmarPedido = async (pedido) => {
    try {
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido)
      });
      if (res.ok) loadInitialData();
    } catch (e) { console.error(e); }
  };`;

const newConfirmar = `  const handleConfirmarPedido = async (pedido) => {
    // In offline mode, just log; in online mode sync to backend
    try {
      await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido)
      });
    } catch (_) { /* offline — order captured locally */ }
    console.log('[CartaYa] Pedido confirmado (local):', pedido);
  };`;

// --- 5. Fix the ViewMiRestaurante fetch to also be offline-safe ---
const oldRestFetch = `        const resp = await fetch('/api/restaurante');
        if (!resp) {
          throw new Error('fetch() para restaurante retornó undefined');
        }
        if (!resp.ok) {
          throw new Error(\`HTTP \${resp.status}: \${resp.statusText}\`);
        }
        const d = await resp.json();
        if(d && Object.keys(d).length > 0) setFormData(d);`;

const newRestFetch = `        let d = null;
        try {
          const resp = await fetch('/api/restaurante');
          if (resp && resp.ok) d = await resp.json();
        } catch (_) { /* offline */ }
        if (d && Object.keys(d).length > 0) setFormData(d);
        else if (typeof MOCK_DATA !== 'undefined' && MOCK_DATA.restaurante) {
          setFormData(prev => ({ ...prev, ...MOCK_DATA.restaurante }));
        }`;

let result = content;
result = result.replace(oldLoad, newLoad);
result = result.replace(oldGuardar, newGuardar);
result = result.replace(oldToggle, newToggle);
result = result.replace(oldConfirmar, newConfirmar);
result = result.replace(oldRestFetch, newRestFetch);

fs.writeFileSync('Avance2135.html', result, 'utf8');

// Verify replacements
const checks = [
  ['loadInitialData offline-first', 'tryFetch'],
  ['handleGuardarReceta local', 'offline — local state already updated'],
  ['handleTogglePlato local', 'setPlatos(prev => prev.map'],
  ['handleConfirmarPedido local', 'order captured locally'],
];
let ok = true;
for (const [label, check] of checks) {
  if (!result.includes(check)) {
    console.error('FAILED:', label, '— pattern not found:', check);
    ok = false;
  } else {
    console.log('OK:', label);
  }
}
if (ok) console.log('\nAll patches applied successfully.');
