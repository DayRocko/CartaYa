const fs = require('fs');
const path = 'c:\\Users\\dayro\\Desktop\\Project # 3 Startup AI\\RestPro AI\\cartaya\\dashboard_2.html';
let content = fs.readFileSync(path, 'utf8');

// 1. Definición de la función loadMenuData robusta (según el usuario)
const LOAD_MENU_DATA_FUNCTION = \`
  // FUNCIÓN ROBUSTA DE CARGA DE DATOS DEL MENÚ
  async function loadMenuData() {
    const MOCK_DATA = [
      {
        id: 1,
        categoria: "Entradas",
        items: [
          { id: 101, nombre: "Bruschettas al Pomodoro", precio: 18000, descripcion: "Pan artesanal y tomate fresco", disponible: true },
          { id: 102, nombre: "Burrata di Puglia", precio: 32000, descripcion: "Sobre cama de rúcula y pesto", disponible: true }
        ]
      },
      {
        id: 2,
        categoria: "Platos Fuertes", 
        items: [
          { id: 201, nombre: "Fettuccine al Funghi", precio: 32000, descripcion: "Pasta con champiñones y trufa", disponible: true },
          { id: 202, nombre: "Pizza Margherita", precio: 28000, descripcion: "Mozzarella di bufala y albahaca", disponible: true },
          { id: 203, nombre: "Lasagna della Nonna", precio: 28000, descripcion: "Receta tradicional", disponible: true }
        ]
      },
      {
        id: 3,
        categoria: "Bebidas",
        items: [
          { id: 301, nombre: "Copa de Chianti", precio: 22000, descripcion: "Vino tinto", disponible: true },
          { id: 302, nombre: "Agua Pellegrino", precio: 9000, descripcion: "Agua mineral", disponible: true }
        ]
      }
    ];

    const menuApiUrl = '/api/platos'; // O la URL que corresponda
    const API_URL = typeof menuApiUrl !== 'undefined' ? menuApiUrl : null;
    
    if (!API_URL) {
      console.log('Sin API configurada — usando datos mock');
      return MOCK_DATA;
    }

    try {
      const response = await fetch(API_URL);
      if (!response) {
        throw new Error('fetch() retornó undefined');
      }
      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Fetch falló, usando datos mock:', error.message);
      return MOCK_DATA;
    }
  }
\`;

// 2. Inyectar al inicio de ViewMenu
content = content.replace('function ViewMenu() {', \`function ViewMenu() { \${LOAD_MENU_DATA_FUNCTION}\`);

// 3. Modificar fetchMenuData para usar loadMenuData (y transformar datos si es necesario)
content = content.replace(/const fetchMenuData = async \(\) => \{[\s\S]+?\};/, \`
  const fetchMenuData = async () => {
    try {
      setLoading(true);
      const data = await loadMenuData();
      
      // Transformar datos estructurados a los arrays planos que usa la App
      if (data && data[0] && data[0].items) {
        const flatCats = data.map(c => ({ id: \`cat-\${c.id}\`, nombre: c.categoria, estado: 'ACTIVA' }));
        const flatDishes = [];
        data.forEach(c => {
          c.items.forEach(i => {
            flatDishes.push({ 
              id: \`p-\${i.id}\`, 
              nombre: i.nombre, 
              precio_venta: i.precio, 
              categoria_id: \`cat-\${c.id}\`, 
              categoria_nombre: c.categoria, 
              estado: i.disponible ? 'DISPONIBLE' : 'AGOTADO',
              descripcion: i.descripcion 
            });
          });
        });
        setCategorias(flatCats);
        setPlatos(flatDishes);
      } else if (Array.isArray(data)) {
        // Asumimos que ya viene plano si no tiene .items
        setPlatos(data);
      }
    } catch (error) {
      console.error('Error final en fetchMenuData:', error);
    } finally {
      setLoading(false);
    }
  };\`);

// 4. Asegurar que useEffect de ViewMenu lo llame
content = content.replace(/React.useEffect\(\(\) => \{[\s\S]+?\}, \[\]\);/, \`
  React.useEffect(() => {
    fetchMenuData(); // Carga inicial robusta
  }, []);\`);

// 5. Aplicar patrón robusto a ViewMiRestaurante (Perfil)
content = content.replace(/React.useEffect\(\(\) => \{[\s\S]+?\}, \[\]\);/, \`
  React.useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const resp = await fetch('/api/restaurante');
        if (!resp || !resp.ok) throw new Error('Perfil no disponible');
        const d = await resp.json();
        if(d && Object.keys(d).length > 0) setFormData(d);
      } catch (err) {
        console.warn('Fallback Perfil:', err.message);
        setFormData(prev => ({ ...prev, ...MOCK_DATA.restaurante }));
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);\`);

fs.writeFileSync(path, content, 'utf8');
console.log("Dashboard_2.html actualizado con loadMenuData robusto y mocks.");
