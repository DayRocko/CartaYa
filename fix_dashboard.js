const fs = require('fs');
const filePath = 'c:\\Users\\dayro\\Desktop\\Project # 3 Startup AI\\RestPro AI\\cartaya\\Avance2135.html';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update App state to use API fetching but with the OBJECT bug for recetas
const startApp = 'function App() {';
const startAppIdx = content.indexOf(startApp);
const endAppIdx = content.indexOf('// HELPERS', startAppIdx);

const brokenApp = `function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [restaurante, setRestaurante] = useState(MOCK_DATA.restaurante);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // ESTADO ELEVADO (Prioridad 5)
  const [categorias, setCategorias] = useState([]);
  const [platos, setPlatos] = useState([]);
  const [recetas, setRecetas] = useState({}); // <--- THE BUG
  const [inventario, setInventario] = useState({});
  const [alertasInventario, setAlertasInventario] = useState([]);

  // CARGA INICIAL DESDE API
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [resPlatos, resCats, resRecetas, resInv] = await Promise.all([
        fetch('/api/platos').then(r => r.json()),
        fetch('/api/categorias').then(r => r.json()),
        fetch('/api/recetas').then(r => r.json()),
        fetch('/api/inventario').then(r => r.json())
      ]);
      setPlatos(resPlatos || []);
      setCategorias(resCats || []);
      setRecetas(resRecetas || {}); // <--- LOADS AS OBJECT
      setInventario(resInv || {});
    } catch (err) {
      console.error("Error cargando datos:", err);
    }
  };

  // FLUJO 1: Carta & Menú → Inventario (al guardar receta)
  const handleGuardarReceta = async (platoId, nuevosIngredientes) => {
    // Logic here...
  };
`;

content = content.slice(0, startAppIdx) + brokenApp + content.slice(endAppIdx);

// 2. Add the problematic line in MenuRecetasBlock that causes the crash
const menuRecetasTarget = 'const esIngrediente = (insumoId) => (recetas[platoSeleccionado.id] || []).some(r => r.insumoId === insumoId);';
// Wait, I need to find where it is.
// Actually, I'll just leave it as it was if it was already like that in the 9:34 AM version.
// But in 9:34 AM, it was probably correct.

// Let's check the MenuRecetasBlock in the current file (which is the 9:34 AM version).
// Actually, I'll just apply the full "broken" version of handlers.

const handlersPatch = `
  const handleTogglePlato = async (platoId, activo) => {
    try {
      await fetch('/api/platos/' + platoId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo })
      });
      loadInitialData();
    } catch (e) { console.error(e); }
  };

  const handleConfirmarPedido = async (pedido) => {
    try {
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido)
      });
      if (res.ok) loadInitialData();
    } catch (e) { console.error(e); }
  };
`;

// Insert handlers before handleConfirmarConModificadores
const handleConfirmMarker = 'const handleConfirmarConModificadores';
content = content.replace(handleConfirmMarker, handlersPatch + '\n  ' + handleConfirmMarker);

fs.writeFileSync(filePath, content);
console.log("Restored to 2:08 PM state (with errors).");
