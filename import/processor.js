const { parseExcel } = require('./parser');
const { validateData } = require('./validator');
const { insertToDB } = require('./db');

/**
 * Procesa la importación en 6 pasos (según requerimiento)
 * @param {string} tempPath Ruta del archivo temporal
 * @param {Function} broadcast Función para enviar eventos WS
 */
async function processImport(tempPath, broadcast) {
  console.log('--- Iniciando Flujo de Importación (6 Pasos) ---');

  // PASO 1: Subida del archivo (ejecutado en server.js)
  broadcast({ type: 'import.status', step: 1, message: 'Archivo recibido correctamente.' });

  // PASO 2: Procesamiento del archivo (Parser)
  broadcast({ type: 'import.status', step: 2, message: 'Parseando datos de Excel/CSV...' });
  const rawData = await parseExcel(tempPath);
  
  // PASO 3: Validación (Validator)
  broadcast({ type: 'import.status', step: 3, message: 'Validando estructura y consistencia...' });
  const validatedData = await validateData(rawData);
  
  if (!validatedData.success) {
    throw new Error(`Error de validación: ${validatedData.errors.join(', ')}`);
  }

  // PASO 4: Inserción en DB (DB)
  broadcast({ type: 'import.status', step: 4, message: 'Insertando datos en la base de datos (Aditivo)...' });
  const dbResult = await insertToDB(validatedData.data);
  
  // PASO 5: Actualización Universal (Eventos WS en cascada)
  broadcast({ type: 'import.status', step: 5, message: 'Actualizando Dashboard y Módulos...' });
  
  // Simular eventos en cascada para Ventas, Finanzas, Operaciones e IA
  broadcast({ type: 'dashboard.refresh', module: 'sales', message: 'Nuevos platos disponibles.' });
  broadcast({ type: 'dashboard.refresh', module: 'finance', message: 'Márgenes recalculados.' });
  broadcast({ type: 'dashboard.refresh', module: 'operations', message: 'KDS sincronizado.' });
  broadcast({ type: 'dashboard.refresh', module: 'brain', message: 'IA analizando rentabilidad.' });

  // PASO 6: Finalización
  broadcast({ type: 'import.completa', result: dbResult });
  console.log('--- Importación Completa ✅ ---');

  return {
    count: dbResult.insertedCount,
    existing: dbResult.skippedCount,
    message: 'Importación exitosa'
  };
}

module.exports = { processImport };
