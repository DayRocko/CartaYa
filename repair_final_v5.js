const fs = require('fs');
let html = fs.readFileSync('dashboard.html', 'utf8');

// 1. Agregar SheetJS en <head>
if (!html.includes('xlsx.full.min.js')) {
  html = html.replace('</head>', '  <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>\n</head>');
}

// 2. Arreglar App (Reemplazar WS)
const appIdx = html.indexOf('function App() {');
const wsStart = html.indexOf('  useEffect(() => {', appIdx);
const wsEnd = html.indexOf('  }, []);', wsStart) + 9;
if (wsStart > -1 && wsEnd > wsStart && wsStart < html.indexOf('return (', appIdx)) {
  html = html.substring(0, wsStart) + '  // WebSocket deshabilitado: modo cliente-side\n' + html.substring(wsEnd);
}

// 3,4,5. ViewMenu - Reconstruir contenido conflictivo
const viewMenuIdx = html.indexOf('function ViewMenu() {');
const endOfViewMenuFront = html.indexOf('return (', viewMenuIdx);

if (viewMenuIdx > -1) {
  // Vamos a reemplazar desde "function ViewMenu() {" hasta "return (" (o un lugar seguro)
  // Reconstruimos la cabecera de ViewMenu con los nuevos requerimientos
  const cleanHeader = `function ViewMenu() {
  const [menuTab, setMenuTab] = React.useState('configuracion');
  const [categorias, setCategorias] = React.useState([]);
  const [platos, setPlatos] = React.useState([]);
  const [recetas, setRecetas] = React.useState([]);
  const [inventario, setInventario] = React.useState([]);
  const [activeCatNames, setActiveCatNames] = React.useState([]);
  const [focusCatName, setFocusCatName] = React.useState(null);
  const [categoriasExpandidas, setCategoriasExpandidas] = React.useState([]);
  const platosRef = React.useRef(null);

  const handleLimpiarCarta = async () => {
    const confirmado = window.confirm(
      '¿Estás seguro? Esto eliminará todas las categorías, platos, modificadores y recetas. Esta acción no se puede deshacer.'
    );
    if (!confirmado) return;
    setCategorias([]);
    setPlatos([]);
    setRecetas([]);
    setInventario([]);
    setActiveCatNames([]);
    alert('Contenido limpiado correctamente. Ahora puedes subir una nueva plantilla.');
  };

  const fetchMenuData = async () => {};

  React.useEffect(() => {
    const handleWSMessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'import.completa') fetchMenuData();
      } catch (err) {}
    };
    window.addEventListener('message', handleWSMessage);
    return () => window.removeEventListener('message', handleWSMessage);
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Estados ficticios para UI loading
    setCategoriasExpandidas([]);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });

        const readSheet = (keyword) => {
          const match = workbook.SheetNames.find(n => 
            n.toUpperCase().replace(/[^A-Z0-9]/g, '').includes(
              keyword.toUpperCase().replace(/[^A-Z0-9]/g, '')
            )
          );
          if (!match) return [];
          return XLSX.utils.sheet_to_json(workbook.Sheets[match], { defval: '', range: 1 });
        };

        const catRows = readSheet('CATEGORIAS');
        const platoRows = readSheet('PLATOS');
        const recetaRows = readSheet('RECETAS');

        setCategorias(catRows);
        setPlatos(platoRows);
        setRecetas(recetaRows);
        setActiveCatNames(catRows.map(c => c.nombre || c.Nombre));
        setCategoriasExpandidas(catRows.map(c => c.nombre || c.Nombre));
        
        alert('Importación local exitosa usando SheetJS.');
      } catch (err) {
        alert("Error: " + err.message);
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = ''; // Reset
  };

  `;

  // Sustituir toda la cabecera vieja hasta `return (`
  html = html.substring(0, viewMenuIdx) + cleanHeader + html.substring(endOfViewMenuFront);
}

// 6. Eliminar código suelto (addEventListener fijos) y duplicación del final
const getTabIdx1 = html.indexOf('function getTabTitle(tab)');
const getTabIdx2 = html.indexOf('function getTabTitle(tab)', getTabIdx1 + 100);

if (getTabIdx2 > -1) {
    // Hay un clonado al fondo. Vamos a limpiar todo el fondo.
    // Retenemos html hasta getTabIdx1, y luego re-escribimos el final perfecto.
    const cleanTail = `function getTabTitle(tab) {
  const titles = {
    dashboard: 'Hola, Daniel 👋',
    ventas: 'Ventas Diarias',
    finanzas: 'Finanzas & Cumplimiento',
    operaciones: 'Operaciones de Salón', 
    inventario: 'Kardex & Proveedores',
    delivery: 'Hub de Domicilios',
    reservas: 'Reservas & VIP',
    marketing: 'Campañas & Marketing',
    fidelizacion: 'Club de Fidelización',
    eventos: 'Eventos & Catering',
    rrhh: 'Talento y RRHH',
    data: 'Data & Insights',
    restaurante: 'Perfil del Restaurante',
    menu: 'Carta & Menú (Laboratorio)',
    conectores: 'Directorio de Aplicaciones',
    billing: 'Configuración de Plan',
    brain: 'Brain IA (El Cerebro)'
  };
  return titles[tab] || 'Módulo Operativo';
}
      
      const root = ReactDOM.createRoot(document.getElementById("root"));
      root.render(<App />);
    </script>
</body>
</html>`;
    html = html.substring(0, getTabIdx1) + cleanTail;
} else if (getTabIdx1 > -1) {
    // Si no está duplicado, igual revisamos y reconstruimos la cola para asegurar que no hay sueltos
    const cleanTail = `function getTabTitle(tab) {
  const titles = {
    dashboard: 'Hola, Daniel 👋',
    ventas: 'Ventas Diarias',
    finanzas: 'Finanzas & Cumplimiento',
    operaciones: 'Operaciones de Salón', 
    inventario: 'Kardex & Proveedores',
    delivery: 'Hub de Domicilios',
    reservas: 'Reservas & VIP',
    marketing: 'Campañas & Marketing',
    fidelizacion: 'Club de Fidelización',
    eventos: 'Eventos & Catering',
    rrhh: 'Talento y RRHH',
    data: 'Data & Insights',
    restaurante: 'Perfil del Restaurante',
    menu: 'Carta & Menú (Laboratorio)',
    conectores: 'Directorio de Aplicaciones',
    billing: 'Configuración de Plan',
    brain: 'Brain IA (El Cerebro)'
  };
  return titles[tab] || 'Módulo Operativo';
}
      
      const root = ReactDOM.createRoot(document.getElementById("root"));
      root.render(<App />);
    </script>
</body>
</html>`;
    html = html.substring(0, getTabIdx1) + cleanTail;
}

// 7. MenuRecetasBlock necesita inventario={inventario}
html = html.replace(/<MenuRecetasBlock([^>]*)>/g, (match, attrs) => {
    if (!attrs.includes('inventario=')) {
        return `<MenuRecetasBlock${attrs} inventario={inventario}>`;
    }
    return match;
});

// 8. Reemplazar {loading ? <LoadingDisplay /> : <MenuCategoriasBlock ... />}
// En ViewMenu (y otros), cambiar loading condicional:
html = html.replace(/\{loading \? <LoadingDisplay \/> : \(\s*(<MenuCategoriasBlock[\s\S]*?)(\s*\)\s*\})/g, "{categorias.length === 0 ? <EmptyCategories /> : (\n$1$2");
// Si el usuario dijo explícitamente sin paréntesis:
html = html.replace(/\{loading \? <LoadingDisplay \/> :[\s\S]*?<MenuCategoriasBlock/g, "{categorias.length === 0 ? <EmptyCategories /> : <MenuCategoriasBlock");

// Reconstruir file
fs.writeFileSync('dashboard_2.html', html);
console.log('Restored dashboard_2.html length:', html.length);
