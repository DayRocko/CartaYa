const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// NUEVA RUTA: cartaya/data/cartaya.db
const dataDir = path.join(__dirname, '..', 'data');
const dbPath = path.join(dataDir, 'cartaya.db');

// Asegurar que el directorio data existe
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

/**
 * Inicializa las tablas con los nuevos nombres estándar.
 */
function initDB() {
  console.log('--- Estandarizando Base de Datos SQLite ---');

  // TABLA: Categorías
  db.prepare(`
    CREATE TABLE IF NOT EXISTS categorias_menu (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT UNIQUE NOT NULL,
      canal TEXT,
      disponible_24h TEXT,
      hora_inicio TEXT,
      hora_fin TEXT,
      dias_activos TEXT,
      orden INTEGER,
      activa TEXT,
      descripcion TEXT,
      color_hex TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // TABLA: Platos
  db.prepare(`
    CREATE TABLE IF NOT EXISTS platos_menu (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT UNIQUE NOT NULL,
      categoria_nombre TEXT,
      precio_venta REAL,
      canal TEXT,
      estado_inicial TEXT,
      descripcion_carta TEXT,
      foto_url TEXT,
      es_destacado TEXT,
      tiempo_prep_min INTEGER,
      iva_aplica TEXT,
      impuesto_consumo REAL,
      calorias INTEGER,
      tags TEXT,
      orden_en_categoria INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // TABLA: Grupos Modificadores
  db.prepare(`
    CREATE TABLE IF NOT EXISTS grupos_modificadores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT UNIQUE NOT NULL,
      tipo_seleccion TEXT,
      obligatorio TEXT,
      min_opciones INTEGER,
      max_opciones INTEGER,
      activo TEXT,
      descripcion TEXT,
      aplica_a_platos TEXT,
      orden_en_plato INTEGER,
      visible_en_delivery TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // TABLA: Opciones Modificadores
  db.prepare(`
    CREATE TABLE IF NOT EXISTS opciones_modificadores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre_grupo TEXT,
      nombre TEXT NOT NULL,
      precio_adicional REAL,
      disponible TEXT,
      es_agotado TEXT,
      descripcion TEXT,
      orden_en_grupo INTEGER,
      foto_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(nombre_grupo, nombre)
    )
  `).run();

  // TABLA: Recetas e Ingredientes
  db.prepare(`
    CREATE TABLE IF NOT EXISTS recetas_ingredientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre_plato TEXT,
      ingrediente_nombre TEXT,
      cantidad REAL,
      unidad_medida TEXT,
      costo_unitario REAL,
      proveedor TEXT,
      es_critico TEXT,
      stock_minimo REAL,
      notas TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(nombre_plato, ingrediente_nombre)
    )
  `).run();

  // TABLA: Inventario de Insumos
  db.prepare(`
    CREATE TABLE IF NOT EXISTS inventario_insumos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT UNIQUE NOT NULL,
      unidad_compra TEXT NOT NULL,
      precio_por_unidad REAL DEFAULT 0,
      proveedor TEXT,
      stock_actual REAL DEFAULT 0,
      stock_minimo_alerta REAL DEFAULT 0,
      estado TEXT DEFAULT 'ACTIVO',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  console.log(`[DB] Base de datos lista en: ${dbPath}`);
}

module.exports = { db, initDB };
