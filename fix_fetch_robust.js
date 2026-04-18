const fs = require('fs');
const path = 'c:\\Users\\dayro\\Desktop\\Project # 3 Startup AI\\RestPro AI\\cartaya\\dashboard_2.html';
let content = fs.readFileSync(path, 'utf8');

// 1. Inyectar MOCK_DATA globalmente
const MOCK_DATA_BLOCK = `
      // --- SISTEM DE MOCK / FALLBACK ---
      const MOCK_DATA = {
        restaurante: { nombre: "CartaYa Premium", ciudad: "Bogotá", eslogan: "Gastronomía Inteligente" },
        categorias: [
          { id: 1, nombre: "Pastas Artesanales", descripcion: "Hechas en casa diariamente", platos_count: 3, estado: 'activo' },
          { id: 2, nombre: "Pizzas al Horno", descripcion: "Masa madurada 48h", platos_count: 5, estado: 'activo' },
          { id: 3, nombre: "Antipasti", descripcion: "Entradas clásicas italianas", platos_count: 2, estado: 'activo' },
          { id: 4, nombre: "Postres Italianos", descripcion: "Dulce final tradicional", platos_count: 1, estado: 'activo' },
          { id: 5, nombre: "Bebidas y Vinos", descripcion: "Selección de la casa", platos_count: 1, estado: 'activo' }
        ],
        platos: [
          { id: 1, categoria_id: 1, nombre: "Fettuccine al Funghi", descripcion: "Pasta con champiñones y trufa", precio: 32000, estado: 'activo' },
          { id: 2, categoria_id: 1, nombre: "Lasagna della Nonna", descripcion: "Receta tradicional de 12 capas", precio: 28000, estado: 'activo' },
          { id: 3, categoria_id: 1, nombre: "Spaghetti Carbonara", descripcion: "Pecorino romano y guanciale", precio: 26000, estado: 'activo' },
          { id: 4, categoria_id: 2, nombre: "Pizza Diavola", descripcion: "Salami picante y pepperoncino", precio: 34000, estado: 'activo' },
          { id: 5, categoria_id: 2, nombre: "Pizza Margherita", descripcion: "Mozzarella di bufala y albahaca", precio: 28000, estado: 'activo' },
          { id: 6, categoria_id: 2, nombre: "Calzone di Napoli", descripcion: "Relleno de ricotta y jamón", precio: 30000, estado: 'activo' },
          { id: 7, categoria_id: 2, nombre: "Pizza Quattro Formaggi", descripcion: "Gorgonzola, Fontina, Parmigiano, Mozzarella", precio: 36000, estado: 'activo' },
          { id: 8, categoria_id: 2, nombre: "Pizza Funghi e Tartufo", descripcion: "Champiñones y aceite de trufa", precio: 38000, estado: 'activo' },
          { id: 9, categoria_id: 3, nombre: "Bruschettas al Pomodoro", descripcion: "Pan artesanal y tomate fresco", precio: 18000, estado: 'activo' },
          { id: 10, categoria_id: 3, nombre: "Burrata di Puglia", descripcion: "Sobre cama de rúcula y pesto", precio: 32000, estado: 'activo' },
          { id: 11, categoria_id: 4, nombre: "Tiramisú della Casa", descripcion: "Con mascarpone y café expreso", precio: 16000, estado: 'activo' },
          { id: 12, categoria_id: 5, nombre: "Copa de Chianti Classico", descripcion: "Vino tinto reserva italiana", precio: 22000, estado: 'activo' }
        ],
        modificadores: [
          { id: 1, nombre: "Tipo de pasta", seleccion_tipo: "UNICA", obligatorio: true, opciones: [
              { id: 1, nombre: "Fettuccine", precio: 0 },
              { id: 2, nombre: "Penne", precio: 0 },
              { id: 3, nombre: "Rigatoni", precio: 0 },
              { id: 4, nombre: "Spaghetti", precio: 0 }
            ] 
          },
          { id: 2, nombre: "Nivel de cocción pasta", seleccion_tipo: "UNICA", obligatorio: true, opciones: [
              { id: 5, nombre: "Al dente", precio: 0 },
              { id: 6, nombre: "Bien cocida", precio: 0 }
            ] 
          },
          { id: 3, nombre: "Adiciones a la pizza", seleccion_tipo: "MULTIPLE", obligatorio: false, opciones: [
              { id: 7, nombre: "Champiñones", precio: 3500 },
              { id: 8, nombre: "Prosciutto Di Parma", precio: 9500 },
              { id: 9, nombre: "Extra Queso", precio: 4500 },
              { id: 10, nombre: "Aceite de Trufa", precio: 6000 }
            ] 
          },
          { id: 4, nombre: "Sin estos ingredientes", seleccion_tipo: "MULTIPLE", obligatorio: false, opciones: [
              { id: 11, nombre: "Sin ajo", precio: 0 },
              { id: 12, nombre: "Sin cebolla", precio: 0 },
              { id: 13, nombre: "Sin albahaca", precio: 0 },
              { id: 14, nombre: "Sin gluten", precio: 0 }
            ] 
          },
          { id: 5, nombre: "Tamaño de pizza", seleccion_tipo: "UNICA", obligatorio: true, opciones: [
              { id: 15, nombre: "Personal 25cm", precio: 0 },
              { id: 16, nombre: "Familiar 35cm", precio: 12000 }
            ] 
          },
          { id: 6, nombre: "Maridaje recomendado", seleccion_tipo: "UNICA", obligatorio: false, opciones: [
              { id: 17, nombre: "Maridaje Chianti", precio: 18000 },
              { id: 18, nombre: "Maridaje Montepulciano", precio: 20000 },
              { id: 19, nombre: "Maridaje Pinot Grigio", precio: 16000 }
            ] 
          }
        ]
      };
`;

// Insertar al inicio del script type="babel"
content = content.replace('<script type="text/babel">', '<script type="text/babel">' + MOCK_DATA_BLOCK);

// 2. Reemplazar fetch(url) pattern en App (Perfil Restaurante)
content = content.replace(/\/\/ fetch removido\s+useEffect\(\(\) => \{[\s\S]+?\}, \[\]\);/, `
      useEffect(() => {
        const loadRestaurante = async () => {
          try {
            const resp = await fetch('/api/restaurante');
            if (!resp || !resp.ok) throw new Error('API restaurante no disponible');
            const d = await resp.json();
            setRestaurante(d);
          } catch (error) {
            console.warn('Usando Mock Restaurante:', error.message);
            setRestaurante(MOCK_DATA.restaurante);
          }
        };
        loadRestaurante();
      }, []);`);

// 3. Reemplazar fetch Modificadores
content = content.replace(/const fetchModificadores = async \(\) => \{[\s\S]+?const data = \[\];[\s\S]+?\};/, `
  const fetchModificadores = async () => {
    try {
      setLoading(true);
      const resp = await fetch('/api/modificadores');
      if (!resp || !resp.ok) throw new Error('API modificadores no disponible');
      const data = await resp.json();
      setGrupos(data || []);
    } catch (e) {
      console.error('Error cargando modificadores:', e);
      setGrupos(MOCK_DATA.modificadores);
    } finally {
      setLoading(false);
    }
  };`);

// 4. Reemplazar fetchMenuData (CATEGORIAS Y PLATOS)
content = content.replace(/const fetchMenuData = async \(\) => \{\};/, `
  const fetchMenuData = async () => {
    try {
      setLoading(true);
      const [catRes, dishRes] = await Promise.all([
        fetch('/api/categorias'),
        fetch('/api/platos')
      ]);

      if (!catRes.ok || !dishRes.ok) throw new Error('Error en la carga parcial del menú');

      const catData = await catRes.json();
      const dishData = await dishRes.json();

      setCategorias(catData || []);
      setPlatos(dishData || []);
    } catch (error) {
      console.warn('Fallback a Menu Mock:', error.message);
      setCategorias(MOCK_DATA.categorias);
      setPlatos(MOCK_DATA.platos);
    } finally {
      setLoading(false);
    }
  };`);

fs.writeFileSync(path, content, 'utf8');
console.log("Dashboard_2.html actualizado con patrón fetch robusto y mocks.");
