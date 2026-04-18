const fs = require('fs');
const path = 'c:/Users/dayro/Desktop/Project # 3 Startup AI/RestPro AI/cartaya/dashboard_2.html';
let content = fs.readFileSync(path, 'utf8');

// 1. Update opciones and loading
const searchOpciones = /const \[opciones, setOpciones\] = React\.useState\(\[\]\);\s+const \[loading, setLoading\] = React\.useState\(true\);/;
const replaceOpciones = `const [opciones, setOpciones] = React.useState([
    { id: 'o-1', grupo_id: 'g-1', nombre: 'Fettuccine', precio_adicional: 0, estado: 'DISPONIBLE', orden: 1 },
    { id: 'o-2', grupo_id: 'g-1', nombre: 'Penne', precio_adicional: 0, estado: 'DISPONIBLE', orden: 2 },
    { id: 'o-3', grupo_id: 'g-1', nombre: 'Rigatoni', precio_adicional: 0, estado: 'DISPONIBLE', orden: 3 },
    { id: 'o-4', grupo_id: 'g-1', nombre: 'Spaghetti', precio_adicional: 0, estado: 'DISPONIBLE', orden: 4 },
    { id: 'o-5', grupo_id: 'g-2', nombre: 'Al dente', precio_adicional: 0, estado: 'DISPONIBLE', orden: 1 },
    { id: 'o-6', grupo_id: 'g-2', nombre: 'Bien cocida', precio_adicional: 0, estado: 'DISPONIBLE', orden: 2 },
    { id: 'o-7', grupo_id: 'g-3', nombre: 'Champiñones extra', precio_adicional: 3000, estado: 'DISPONIBLE', orden: 1 },
    { id: 'o-8', grupo_id: 'g-3', nombre: 'Huevo al centro', precio_adicional: 2500, estado: 'DISPONIBLE', orden: 2 },
    { id: 'o-9', grupo_id: 'g-3', nombre: 'Prosciutto crudo', precio_adicional: 5000, estado: 'DISPONIBLE', orden: 3 },
    { id: 'o-10', grupo_id: 'g-3', nombre: 'Rúgula fresca', precio_adicional: 2000, estado: 'DISPONIBLE', orden: 4 },
    { id: 'o-11', grupo_id: 'g-3', nombre: 'Trufa negra rallada', precio_adicional: 8000, estado: 'DISPONIBLE', orden: 5 },
    { id: 'o-12', grupo_id: 'g-4', nombre: 'Sin ajo', precio_adicional: 0, estado: 'DISPONIBLE', orden: 1 },
    { id: 'o-13', grupo_id: 'g-4', nombre: 'Sin cebolla', precio_adicional: 0, estado: 'DISPONIBLE', orden: 2 },
    { id: 'o-14', grupo_id: 'g-4', nombre: 'Sin gluten', precio_adicional: 0, estado: 'DISPONIBLE', orden: 3 },
    { id: 'o-15', grupo_id: 'g-5', nombre: 'Personal 25cm', precio_adicional: 0, estado: 'DISPONIBLE', orden: 1 },
    { id: 'o-16', grupo_id: 'g-5', nombre: 'Familiar 35cm', precio_adicional: 12000, estado: 'DISPONIBLE', orden: 2 },
    { id: 'o-17', grupo_id: 'g-6', nombre: 'Chianti Classico', precio_adicional: 18000, estado: 'DISPONIBLE', orden: 1 },
    { id: 'o-18', grupo_id: 'g-6', nombre: 'Montepulciano', precio_adicional: 14000, estado: 'DISPONIBLE', orden: 2 },
    { id: 'o-19', grupo_id: 'g-6', nombre: 'Pinot Grigio', precio_adicional: 16000, estado: 'DISPONIBLE', orden: 3 }
  ]);
  const [loading, setLoading] = React.useState(false);`;

content = content.replace(searchOpciones, replaceOpciones);

// 2. Disable useEffect
const searchEffect = /React\.useEffect\(\(\) => \{\s+fetchModificadores\(\);\s+\}, \[\]\);/;
const replaceEffect = `React.useEffect(() => {
    // Carga inicial deshabilitada (offline/static)
  }, []);`;
content = content.replace(searchEffect, replaceEffect);

// 3. Update vinculos
const searchVinculos = /const \[vinculos, setVinculos\] = React\.useState\(\[\s+\{ plato_id: 'p-3', grupo_id: 'g-2', orden_en_plato: 1 \},\s+\]\);/;
const replaceVinculos = `const [vinculos, setVinculos] = React.useState([
    { plato_id: 'p-1', grupo_id: 'g-1', orden_en_plato: 1 },
    { plato_id: 'p-1', grupo_id: 'g-2', orden_en_plato: 2 },
    { plato_id: 'p-1', grupo_id: 'g-4', orden_en_plato: 3 },
    { plato_id: 'p-2', grupo_id: 'g-1', orden_en_plato: 1 },
    { plato_id: 'p-2', grupo_id: 'g-2', orden_en_plato: 2 },
    { plato_id: 'p-2', grupo_id: 'g-4', orden_en_plato: 3 },
    { plato_id: 'p-2', grupo_id: 'g-6', orden_en_plato: 4 },
    { plato_id: 'p-3', grupo_id: 'g-1', orden_en_plato: 1 },
    { plato_id: 'p-3', grupo_id: 'g-2', orden_en_plato: 2 },
    { plato_id: 'p-3', grupo_id: 'g-4', orden_en_plato: 3 },
    { plato_id: 'p-4', grupo_id: 'g-1', orden_en_plato: 1 },
    { plato_id: 'p-4', grupo_id: 'g-2', orden_en_plato: 2 },
    { plato_id: 'p-4', grupo_id: 'g-4', orden_en_plato: 3 },
    { plato_id: 'p-4', grupo_id: 'g-6', orden_en_plato: 4 },
    { plato_id: 'p-5', grupo_id: 'g-3', orden_en_plato: 1 },
    { plato_id: 'p-5', grupo_id: 'g-5', orden_en_plato: 2 },
    { plato_id: 'p-5', grupo_id: 'g-4', orden_en_plato: 3 },
    { plato_id: 'p-6', grupo_id: 'g-3', orden_en_plato: 1 },
    { plato_id: 'p-6', grupo_id: 'g-5', orden_en_plato: 2 },
    { plato_id: 'p-6', grupo_id: 'g-4', orden_en_plato: 3 },
    { plato_id: 'p-7', grupo_id: 'g-3', orden_en_plato: 1 },
    { plato_id: 'p-7', grupo_id: 'g-5', orden_en_plato: 2 },
    { plato_id: 'p-7', grupo_id: 'g-4', orden_en_plato: 3 },
    { plato_id: 'p-7', grupo_id: 'g-6', orden_en_plato: 4 }
  ]);`;
content = content.replace(searchVinculos, replaceVinculos);

fs.writeFileSync(path, content);
console.log('dashboard_2.html updated successfully with node script.');
