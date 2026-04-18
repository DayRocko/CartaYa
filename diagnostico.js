const fs = require('fs');
const c = fs.readFileSync('dashboard_2.html', 'utf8');
const lines = c.split('\n');

console.log('=== DIAGNÓSTICO COMPLETO ===');
console.log('Total líneas:', lines.length);

// Buscar problemas críticos
const problems = [];
lines.forEach((l, i) => {
  const lineNum = i + 1;
  const t = l.trim();
  
  // fetch reales (no comentarios)
  if (t.includes('fetch(') && !t.startsWith('//') && !t.includes('fetchModificadores') && !t.includes('fetchMenuData')) {
    problems.push(`FETCH: ${lineNum}: ${t.substring(0,100)}`);
  }
  // WebSocket
  if (t.includes('new WebSocket') && !t.startsWith('//')) {
    problems.push(`WEBSOCKET: ${lineNum}: ${t.substring(0,100)}`);
  }
  // .json() real
  if (t.includes('.json()') && !t.startsWith('//')) {
    problems.push(`JSON: ${lineNum}: ${t.substring(0,100)}`);
  }
  // addEventListener suelto (fuera de return)
  if (t.includes('window.addEventListener') && !t.startsWith('//')) {
    problems.push(`EVENTLISTENER: ${lineNum}: ${t.substring(0,100)}`);
  }
  // handleWSMessage sin definir
  if (t.includes('handleWSMessage') && !t.startsWith('//')) {
    problems.push(`HANDLEWS: ${lineNum}: ${t.substring(0,100)}`);
  }
});

if (problems.length === 0) {
  console.log('\n✅ ARCHIVO LIMPIO — sin fetch, WebSocket ni .json()');
} else {
  console.log('\n❌ PROBLEMAS ENCONTRADOS:');
  problems.forEach(p => console.log(p));
}

// Verificar XLSX
const xlsxCount = (c.match(/xlsx@0\.18\.5/g) || []).length;
console.log('\nXLSX CDN encontrado:', xlsxCount, 'vez(ces)');

// Verificar useEffect del menu
const weIdx = c.indexOf('WebSocket deshabilitado');
if (weIdx > -1) {
  const lineNum = c.substring(0, weIdx).split('\n').length;
  console.log('useEffect limpio en línea:', lineNum);
}

// Verificar handleFileUpload
const hfIdx = c.indexOf('const handleFileUpload');
if (hfIdx > -1) {
  const lineNum = c.substring(0, hfIdx).split('\n').length;
  const snippet = c.substring(hfIdx, hfIdx + 200);
  console.log('\nhandleFileUpload en línea:', lineNum);
  console.log(snippet.split('\n').slice(0,8).join('\n'));
}

// Buscar syntax issues: return suelto
const orphanReturn = lines.findIndex((l, i) => {
  return l.trim().startsWith('return () =>') && 
    (i === 0 || !lines[i-1].trim().startsWith('useEffect'));
});
if (orphanReturn > -1) {
  console.log('\n❌ RETURN HUÉRFANO en línea:', orphanReturn + 1);
} else {
  console.log('\n✅ Sin return huérfano');
}
