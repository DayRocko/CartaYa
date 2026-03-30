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
        const rows = db.prepare('SELECT * FROM platos_menu ORDER BY categoria_nombre, nombre').all();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(rows));
      } catch (err) {
        console.error('Error en /api/platos:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
      return;
    }

    // 3. Modificadores (Grupos con sus opciones anidadas)
    if (req.url === '/api/modificadores') {
      try {
        const grupos = db.prepare('SELECT * FROM grupos_modificadores ORDER BY nombre').all();
        const opciones = db.prepare('SELECT * FROM opciones_modificadores ORDER BY nombre_grupo, orden_en_grupo').all();
        
        // Agrupar opciones por nombre de grupo
        const result = grupos.map(grupo => ({
          ...grupo,
          opciones: opciones.filter(opt => opt.nombre_grupo === grupo.nombre)
        }));

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err) {
        console.error('Error en /api/modificadores:', err);
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
