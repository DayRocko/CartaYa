const { db, initDB } = require('../db/schema');

// Inicializar la base de datos al cargar el módulo
initDB();

/**
 * Inserta datos de forma aditiva (real) en las nuevas tablas estandarizadas
 * @param {object} data Datos validados por pestañas
 */
async function insertToDB(data) {
  console.log('--- Inserción Real en SQLite (Estandarizada) ---');

  let insertedCount = 0;
  let skippedCount = 0;

  try {
    const transaction = db.transaction(() => {
      // 1. CATEGORÍAS
      if (data.categorias) {
        const insertCat = db.prepare(`
          INSERT OR IGNORE INTO categorias_menu (
            nombre, canal, disponible_24h, hora_inicio, hora_fin, dias_activos, orden, activa, descripcion, color_hex
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        data.categorias.forEach(cat => {
          const result = insertCat.run(
            cat.nombre, cat.canal, cat.disponible_24h, cat.hora_inicio,
            cat.hora_fin, cat.dias_activos, cat.orden, cat.activa,
            cat.descripcion, cat.color_hex
          );
          if (result.changes > 0) insertedCount++;
          else skippedCount++;
        });
      }

      // 2. PLATOS
      if (data.platos) {
        const insertPlato = db.prepare(`
          INSERT OR IGNORE INTO platos_menu (
            nombre, categoria_nombre, precio_venta, canal, estado_inicial, 
            descripcion_carta, foto_url, es_destacado, tiempo_prep_min, 
            iva_aplica, impuesto_consumo, calorias, tags, orden_en_categoria
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        data.platos.forEach(p => {
          const result = insertPlato.run(
            p.nombre, p.categoria_nombre, p.precio_venta, p.canal, p.estado_inicial,
            p.descripcion_carta, p.foto_url, p.es_destacado, p.tiempo_prep_min,
            p.iva_aplica, p.impuesto_consumo, p.calorias, p.tags, p.orden_en_categoria
          );
          if (result.changes > 0) insertedCount++;
          else skippedCount++;
        });
      }

      // 3. GRUPOS MODIFICADORES
      if (data.modificadores) {
        const insertMod = db.prepare(`
          INSERT OR IGNORE INTO grupos_modificadores (
            nombre, tipo_seleccion, obligatorio, min_opciones, max_opciones, 
            activo, descripcion, aplica_a_platos, orden_en_plato, visible_en_delivery
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        data.modificadores.forEach(m => {
          const result = insertMod.run(
            m.nombre, m.tipo_seleccion, m.obligatorio, m.min_opciones,
            m.max_opciones, m.activo, m.descripcion, m.aplica_a_platos,
            m.orden_en_plato, m.visible_en_delivery
          );
          if (result.changes > 0) insertedCount++;
          else skippedCount++;
        });
      }

      // 4. OPCIONES MODIFICADORES
      if (data.opciones) {
        const insertOption = db.prepare(`
          INSERT OR IGNORE INTO opciones_modificadores (
            nombre_grupo, nombre, precio_adicional, disponible, es_agotado, 
            descripcion, orden_en_grupo, foto_url
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        data.opciones.forEach(o => {
          const result = insertOption.run(
            o.nombre_grupo, o.nombre, o.precio_adicional, o.disponible,
            o.es_agotado, o.descripcion, o.orden_en_grupo, o.foto_url
          );
          if (result.changes > 0) insertedCount++;
          else skippedCount++;
        });
      }

      // 5. RECETAS E INGREDIENTES
      if (data.recetas) {
        const insertReceta = db.prepare(`
          INSERT OR IGNORE INTO recetas_ingredientes (
            nombre_plato, ingrediente_nombre, cantidad, unidad_medida, 
            costo_unitario, proveedor, es_critico, stock_minimo, notas
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        data.recetas.forEach(r => {
          const result = insertReceta.run(
            r.nombre_plato, r.ingrediente_nombre, r.cantidad, r.unidad_medida,
            r.costo_unitario, r.proveedor, r.es_critico, r.stock_minimo, r.notas
          );
          if (result.changes > 0) insertedCount++;
          else skippedCount++;
        });
      }
    });

    // Ejecutar la transacción
    transaction();

    return {
      success: true,
      insertedCount,
      skippedCount,
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    console.error('[DB Error] Causa:', err);
    throw new Error(`Fallo en la base de datos: ${err.message}`);
  }
}

module.exports = { insertToDB };
