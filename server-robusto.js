const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'text/plain';
}

function sendFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.log(`Error leyendo archivo: ${filePath}`, err.message);
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Archivo no encontrado');
      return;
    }
    
    const contentType = getContentType(filePath);
    res.writeHead(200, { 
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  // Manejar CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;
  
  // Normalizar la ruta
  if (pathname === '/') {
    pathname = '/dashboard.html';
  }
  
  // Remover query parameters
  pathname = pathname.split('?')[0];
  
  // Construir la ruta del archivo
  const filePath = path.join(__dirname, pathname);
  
  // Verificar que el archivo esté dentro del directorio del proyecto
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Acceso denegado');
    return;
  }
  
  console.log(`Solicitando: ${req.method} ${pathname} -> ${filePath}`);
  
  sendFile(res, filePath);
});

const PORT = 8000;
server.listen(PORT, '0.0.0.0', () => {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 SERVIDOR INICIADO EXITOSAMENTE');
  console.log('='.repeat(50));
  console.log(`📁 Directorio: ${__dirname}`);
  console.log(`🌐 URL Principal: http://localhost:${PORT}`);
  console.log(`📄 Dashboard: http://localhost:${PORT}/dashboard.html`);
  console.log(`🔗 Alternativa: http://127.0.0.1:${PORT}/dashboard.html`);
  console.log('='.repeat(50));
  console.log('⏹️  Presiona Ctrl+C para detener el servidor');
  console.log('='.repeat(50) + '\n');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`\n❌ ERROR: El puerto ${PORT} ya está en uso`);
    console.log(`🔧 Solución: Cierra otros programas usando el puerto ${PORT}`);
    console.log(`📋 Comando para verificar: netstat -ano | findstr :${PORT}`);
  } else {
    console.log(`\n❌ ERROR al iniciar servidor: ${err.message}`);
  }
  process.exit(1);
});

// Manejar cierre graceful
process.on('SIGINT', () => {
  console.log('\n🛑 Deteniendo servidor...');
  server.close(() => {
    console.log('✅ Servidor detenido correctamente');
    process.exit(0);
  });
});
