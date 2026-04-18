const XLSX = require('xlsx');

/**
 * Parsea un archivo Excel/CSV y extrae las pestañas requeridas
 * @param {string} filePath Ruta del archivo temporal
 */
async function parseExcel(filePath) {
  try {
    const workbook = XLSX.readFile(filePath);
    const data = {};

    // Mapeo sugerido de palabras clave para identificar pestañas incluso con prefijos (ej: 1_CATEGORIAS)
    const mapping = {
      'categorias': ['categorias', 'category', '1_categorias'],
      'platos': ['platos', 'dishes', 'items', '2_platos'],
      'modificadores': ['modificadores', 'modifiers', 'extras', '3_modificadores'],
      'opciones': ['opciones', 'options', '4_opciones_mod'],
      'recetas': ['recetas', 'recipes', '5_recetas'],
      'inventario': ['inventario', 'insumos', 'inventory', '6_inventario']
    };

    workbook.SheetNames.forEach(sheetName => {
      const lowerSheetName = sheetName.toLowerCase();
      
      // Identificar a qué categoría pertenece la pestaña actual
      let targetKey = null;
      for (const [key, aliases] of Object.entries(mapping)) {
        if (aliases.some(alias => lowerSheetName.includes(alias))) {
          targetKey = key;
          break;
        }
      }

      if (targetKey) {
        // --- AJUSTE CRÍTICO: range: 1 ---
        // Ignora la Fila 1 (banner decorativo) y usa la Fila 2 como encabezado
        data[targetKey] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { range: 1 });
        
        if (data[targetKey].length > 0) {
          console.log(`[Parser] Detectada pestaña "${sheetName}" -> "${targetKey}"`);
          console.log(`[Parser] Columnas encontradas: ${Object.keys(data[targetKey][0]).join(', ')}`);
        }
        
        console.log(`[Parser] Total filas procesadas: ${data[targetKey].length}`);
      }
    });

    // Fallback: Si no se detectó nada por nombre, intentar con la primera hoja
    if (Object.keys(data).length === 0 && workbook.SheetNames.length > 0) {
      console.log('[Parser] Fallback: Usando primera hoja como "platos"');
      data['platos'] = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { range: 1 });
    }

    return data;
  } catch (err) {
    console.error('Error parseando Excel:', err);
    throw new Error('Archivo inválido. Asegúrese de usar .xlsx o .csv con la estructura correcta.');
  }
}

module.exports = { parseExcel };
