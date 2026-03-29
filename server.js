const http = require('http');
const fs = require('fs');
const path = require('path');

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

  let filePath = path.join(__dirname, req.url === '/' ? 'dashboard.html' : req.url);
  
  // Normalizar rutas para Windows
  const normalizedPath = path.normalize(filePath);
  const normalizedDir = path.normalize(__dirname);

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
      if (err.code !== 'ENOENT') {
        console.error('Error al leer archivo:', err);
      }
      res.writeHead(404);
      res.end('Archivo no encontrado');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`\n🚀 Servidor iniciado exitosamente!`);
  console.log(`📁 Directorio: ${__dirname}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📄 Dashboard: http://localhost:${PORT}/dashboard.html`);
  console.log(`\n⏹️  Presiona Ctrl+C para detener el servidor\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`❌ El puerto ${PORT} ya está en uso`);
    console.log(`🔧 Intenta: netstat -ano | findstr :${PORT}`);
  } else {
    console.log('❌ Error al iniciar servidor:', err);
  }
});
