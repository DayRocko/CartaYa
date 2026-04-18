const http = require('http');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const WebSocket = require('ws');
const { db, initDB } = require('./db/schema'); // Importar DB y función de inicio
initDB(); // Asegurar que las tablas existan al arrancar

// --- CONFIGURACIÓN DEL SERVIDOR ---
const PORT = 8001;

const server = http.createServer((req, res) => {
  // Habilitar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.url === '/favicon.ico') {
    res.writeHead(204);
    res.end();
    return;
  }

  // --- LOG DE ACCESO PARA DEBUGGING ---
  console.log(`[${new Date().toLocaleTimeString()}] HTTP ${req.method} ${req.url}`);

  // --- ENDPOINTS API GET (NUEVOS REQUERIMIENTOS) ---
  
  if (req.method === 'GET') {
    // 1. Categorías
    if (req.url === '/api/categorias') {
      try {
        const rows = db.prepare('SELECT * FROM categorias_menu ORDER BY orden ASC').all();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(rows));
      } catch (err) {
        console.error('Error en /api/categorias:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }

    // 2. Platos
    if (req.url === '/api/platos') {
      try {
        const rows = db.prepare(`
          SELECT 
            p.*, 
            c.nombre as categoria
          FROM platos_menu p
          LEFT JOIN categorias_menu c ON p.categoria_nombre = c.nombre
          ORDER BY p.categoria_nombre, p.nombre
        `).all();

        const recetas = db.prepare('SELECT nombre_plato, ingrediente_nombre, cantidad, unidad_medida FROM recetas_ingredientes').all();
        const insumos = db.prepare('SELECT nombre, precio_por_unidad, unidad_compra FROM inventario_insumos').all();

        // Calcular costo y margen en JavaScript
        const platosConMargen = rows.map(plato => {
          let costoTotal = 0;
          const platoRecetas = recetas.filter(r => r.nombre_plato === plato.nombre);
          
          platoRecetas.forEach(rec => {
            const insumo = insumos.find(i => i.nombre === rec.ingrediente_nombre);
            if (insumo && insumo.precio_por_unidad) {
              let multiplicador = 1;
              // Conversión básica de unidades si son diferentes (ej. kg a g)
              if (insumo.unidad_compra === 'kg' && rec.unidad_medida === 'g') multiplicador = 0.001;
              else if (insumo.unidad_compra === 'g' && rec.unidad_medida === 'kg') multiplicador = 1000;
              else if (insumo.unidad_compra === 'litro' && rec.unidad_medida === 'ml') multiplicador = 0.001;
              else if (insumo.unidad_compra === 'ml' && rec.unidad_medida === 'litro') multiplicador = 1000;
              // Si la conversión no está cubierta, se asume 1 y luego el usuario puede ajustarlo, pero esto cubre lo del documento
              
              costoTotal += rec.cantidad * (insumo.precio_por_unidad * multiplicador);
            }
          });

          let margen = '100.00%';
          if (costoTotal > 0 && plato.precio_venta > 0) {
            margen = ((plato.precio_venta - costoTotal) / plato.precio_venta * 100).toFixed(2) + '%';
          } else if (plato.precio_venta === 0) {
            margen = '0.00%';
          }
          return {
            ...plato,
            costo_produccion: costoTotal,
            margen_bruto: margen
          };
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(platosConMargen));
      } catch (err) {
        console.error('Error en /api/platos:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }

    if (req.url === '/api/modificadores' && req.method === 'GET') {
      try {
        const grupos = db.prepare('SELECT * FROM grupos_modificadores').all();
        const resultado = grupos.map(grupo => {
          const opciones = db.prepare(
            'SELECT * FROM opciones_modificadores WHERE nombre_grupo = ?'
          ).all(grupo.nombre);
          return { ...grupo, opciones };
        });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(resultado));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }

    // 4. Recetas e Ingredientes
    if (req.url === '/api/recetas') {
      try {
        const rows = db.prepare('SELECT * FROM recetas_ingredientes ORDER BY nombre_plato').all();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(rows));
      } catch (err) {
        console.error('Error en /api/recetas:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }

    // 5. Inventario de Insumos
    if (req.url === '/api/inventario') {
      try {
        const rows = db.prepare('SELECT * FROM inventario_insumos ORDER BY nombre').all();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(rows));
      } catch (err) {
        console.error('Error en /api/inventario:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }
  }

  // POST: Toggle estado de categoría
  if (req.url === '/api/categorias/toggle' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const { id, estado } = JSON.parse(body);
        db.prepare('UPDATE categorias_menu SET estado = ? WHERE id = ?').run(estado === 'ACTIVA' ? 'ACTIVA' : 'INACTIVA', id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', id, estado }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // --- ENDPOINT DE IMPORTACIÓN (POST) ---
  if (req.url === '/api/import' && req.method === 'POST') {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, 'tmp');
    form.keepExtensions = true;

    if (!fs.existsSync(form.uploadDir)) {
      fs.mkdirSync(form.uploadDir, { recursive: true });
    }

    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', message: 'Error al procesar el archivo' }));
        return;
      }

      const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;
      if (!uploadedFile) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', message: 'No se subió ningún archivo' }));
        return;
      }

      const tempPath = uploadedFile.filepath;
      try {
        const { processImport } = require('./import/processor');
        const result = await processImport(tempPath, broadcast);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'success', ...result }));

        setTimeout(() => {
          if (fs.existsSync(tempPath)) fs.unlink(tempPath, () => {});
        }, 10000);
      } catch (procErr) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', message: procErr.message }));
      }
    });
    return;
  }

  // 9. Configuración de Mi Restaurante
  if (req.url === '/api/restaurante' && req.method === 'GET') {
    const configPath = path.join(__dirname, 'data', 'restaurante.json');
    try {
      if (fs.existsSync(configPath)) {
        const data = fs.readFileSync(configPath, 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({}));
      }
    } catch (err) {
      console.error('Error leyendo config restaurante:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (req.url === '/api/restaurante' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const dataPath = path.join(__dirname, 'data');
        if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath, { recursive: true });
        
        fs.writeFileSync(path.join(dataPath, 'restaurante.json'), JSON.stringify(payload, null, 2));
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'success' }));
      } catch (err) {
        console.error('Error guardando config restaurante:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', message: err.message }));
      }
    });
    return;
  }
  
  if (req.url === '/api/inventario' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const { id, precio_por_unidad, stock_actual } = JSON.parse(body);
        const stmt = db.prepare('UPDATE inventario_insumos SET precio_por_unidad = ?, stock_actual = ? WHERE id = ?');
        const info = stmt.run(precio_por_unidad, stock_actual, id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'success', changes: info.changes }));
      } catch (err) {
        console.error('Error en POST /api/inventario:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  if (req.url === '/api/categorias/toggle' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const { nombre, activa } = JSON.parse(body);
        const stmt = db.prepare('UPDATE categorias_menu SET activa = ? WHERE nombre = ?');
        const info = stmt.run(activa ? 1 : 0, nombre);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'success', nombre, activa, changes: info.changes }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  
  if (req.url === '/api/carta/limpiar' && req.method === 'DELETE') {
    try {
      db.prepare('DELETE FROM recetas_ingredientes').run();
      db.prepare('DELETE FROM opciones_modificadores').run();
      db.prepare('DELETE FROM grupos_modificadores').run();
      db.prepare('DELETE FROM platos_menu').run();
      db.prepare('DELETE FROM categorias_menu').run();
      if (typeof broadcast === 'function') {
        broadcast({ type: 'carta.limpiada', message: 'Contenido de Carta & Menú eliminado' });
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'success', message: 'Carta limpiada correctamente' }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // --- SERVIDOR DE ARCHIVOS ESTÁTICOS ---
  let filePath = path.join(__dirname, req.url === '/' ? 'dashboard.html' : req.url);
  const ext = path.extname(filePath);
  let contentType = 'text/plain; charset=utf-8';
  
  switch (ext) {
    case '.html': contentType = 'text/html; charset=utf-8'; break;
    case '.css': contentType = 'text/css; charset=utf-8'; break;
    case '.js': contentType = 'application/javascript; charset=utf-8'; break;
    case '.json': contentType = 'application/json; charset=utf-8'; break;
    case '.png': contentType = 'image/png'; break;
    case '.jpg': case '.jpeg': contentType = 'image/jpeg'; break;
    case '.svg': contentType = 'image/svg+xml'; break;
    case '.ico': contentType = 'image/x-icon'; break;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Archivo no encontrado');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

// --- CONFIGURACIÓN WEBSOCKET ---
const wss = new WebSocket.Server({ server });

function broadcast(data) {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'connected', message: 'Conexión CartaYa Server Lista' }));
});

// --- INICIO DEL SERVIDOR ---
server.listen(PORT, () => {
  console.log(`\n🚀 CartaYa Backend en línea!`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📂 Directorio: ${__dirname}\n`);
});
