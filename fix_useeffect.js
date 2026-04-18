const fs = require('fs');
const path = 'Avance2135.html';
let content = fs.readFileSync(path, 'utf8');

console.log('Applying safe useEffect fix...');

// Fix the cost calculation useEffect to guard against undefined props
const oldUe = `  // --- EFECTO DE CALCULO DE COSTOS (Prioridad 3) ---
  React.useEffect(() => {
    // Evitar bucles: Solo ejecutar si hay cambios reales que procesar
    let cambios = false;
    const nuevosPlatos = (platos || []).map(plato => {
      // Filtrar ingredientes de la receta de este plato
      const ingredientes = (recetas || []).filter(r => 
        r.nombre_plato.toLowerCase().trim() === plato.nombre.toLowerCase().trim()
      );
      
      if (ingredientes.length === 0) return plato;

      // Calcular costo sumando (cantidad * precio_del_inventario)
      const nuevoCosto = ingredientes.reduce((acc, ing) => {
        const itemInv = (inventario || []).find(i => i.nombre.toLowerCase().trim() === ing.ingrediente_nombre.toLowerCase().trim());
        const costoUnitario = itemInv ? (itemInv.precio_por_unidad || 0) : (ing.costo_unitario || 0);
        return acc + (ing.cantidad * costoUnitario);
      }, 0);

      const roundedCosto = Math.round(nuevoCosto);
      
      if (plato.costo_produccion !== roundedCosto) {
        cambios = true;
        const nuevoMargen = plato.precio_venta > 0 
          ? Number((((plato.precio_venta - roundedCosto) / plato.precio_venta) * 100).toFixed(2))
          : 0;
        return { ...plato, costo_produccion: roundedCosto, margen_bruto: nuevoMargen };
      }
      return plato;
    });

    if (cambios) {
      setPlatos(nuevosPlatos);
    }
  }, [recetas, inventario]); // Solo depende de cambios en recetas o inventario`;

const newUe = `  // --- EFECTO DE CALCULO DE COSTOS (Prioridad 3) ---
  React.useEffect(() => {
    try {
      if (!platos || platos.length === 0) return;
      let cambios = false;
      const safeRecetas = recetas || [];
      const safeInventario = inventario || [];
      const nuevosPlatos = platos.map(plato => {
        if (!plato || !plato.nombre) return plato;
        const ingredientes = safeRecetas.filter(r =>
          r && r.nombre_plato &&
          r.nombre_plato.toLowerCase().trim() === plato.nombre.toLowerCase().trim()
        );
        if (ingredientes.length === 0) return plato;
        const nuevoCosto = ingredientes.reduce((acc, ing) => {
          const itemInv = safeInventario.find(i =>
            i && i.nombre && ing.ingrediente_nombre &&
            i.nombre.toLowerCase().trim() === ing.ingrediente_nombre.toLowerCase().trim()
          );
          const costoUnitario = itemInv ? (itemInv.precio_por_unidad || 0) : (ing.costo_unitario || 0);
          return acc + ((ing.cantidad || 0) * costoUnitario);
        }, 0);
        const roundedCosto = Math.round(nuevoCosto);
        if (plato.costo_produccion !== roundedCosto) {
          cambios = true;
          const nuevoMargen = plato.precio_venta > 0
            ? Number((((plato.precio_venta - roundedCosto) / plato.precio_venta) * 100).toFixed(2))
            : 0;
          return { ...plato, costo_produccion: roundedCosto, margen_bruto: nuevoMargen };
        }
        return plato;
      });
      if (cambios) setPlatos(nuevosPlatos);
    } catch(err) {
      console.warn('Error en cálculo de costos:', err);
    }
  }, [recetas, inventario]);`;

if (content.includes(oldUe)) {
    content = content.replace(oldUe, newUe);
    console.log('✅ Cost useEffect fixed.');
} else {
    console.log('❌ Cost useEffect NOT found — searching line by line...');
    // Try a regex approach
    const ueRegex = /\/\/ --- EFECTO DE CALCULO DE COSTOS[\s\S]+?}, \[recetas, inventario\]\);/;
    if (ueRegex.test(content)) {
        content = content.replace(ueRegex, newUe);
        console.log('✅ Cost useEffect fixed via regex.');
    } else {
        console.log('❌ Could not find cost useEffect.');
    }
}

fs.writeFileSync(path, content, 'utf8');
console.log('Done. File length:', content.length);
