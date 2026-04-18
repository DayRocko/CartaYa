const fs = require('fs');

let content = fs.readFileSync('dashboard_2.html', 'utf8');

// 1. fetch calls a /api/... y 2. .json()
// Any fetch('/api/...
content = content.replace(/fetch\('\/api\/restaurante'\)\.then\(r => r\.json\(\)\)\.then\(d => \{([\s\S]*?)\}\)\.catch\(e => setLoading\(false\)\);/g, 
`// fetch removido
if(false) {
  $1
}
setLoading(false);`);

content = content.replace(/const res = await fetch\('\/api\/restaurante', \{[\s\S]*?body: JSON\.stringify\(formData\)[\s\S]*?\}\);/g, 
`const res = {ok: true}; // fetch removido`);

content = content.replace(/fetch\('\/api\/categorias\/toggle', \{ method: 'POST', headers: \{ 'Content-Type': 'application\/json' \}, body: JSON\.stringify\(\{ id: cat\.id, estado: nuevoEstado \}\) \}\)\.catch\(\(\) => \{\}\);/g, 
`// fetch toggle removido`);

content = content.replace(/const resp = await fetch\('\/api\/modificadores'\);\s*const data = await resp\.json\(\);/g, 
`const data = []; // fetch modificadores removido`);

content = content.replace(/\.json\(\)/g, "/* .json() eliminado */");

// 3. Cualquier new WebSocket( -> // WebSocket deshabilitado: modo cliente-side
// Although I didn't see new WebSocket in the snippet, just in case:
content = content.replace(/new WebSocket\([^)]+\)/g, "// WebSocket deshabilitado: modo cliente-side");

// 4. handleFileUpload structure
const oldFileUploadStart = content.indexOf('const handleFileUpload = async (e) => {');
const oldFileUploadEnd = content.indexOf('return () => {', oldFileUploadStart);

if (oldFileUploadStart > -1 && oldFileUploadEnd > -1) {
    let before = content.substring(0, oldFileUploadStart);
    // Find the React.useEffect that comes after it or the return
    // Let's replace the whole handleFileUpload specifically
    let handleFileUploadText = content.substring(oldFileUploadStart, oldFileUploadEnd);
    
    // Check if it has XLSX.read
    const newHandleFileUpload = `const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (evt) => {
      const wb = XLSX.read(new Uint8Array(evt.target.result), { type: 'array' });
      // leer hojas con XLSX.utils.sheet_to_json(wb.Sheets[nombre], { defval: '', range: 1 })
    };
  };

  `;
    
    content = content.replace(handleFileUploadText, newHandleFileUpload);
}

// 5. Verifica que el useEffect en el componente App NO contenga new WebSocket / window.addEventListener
// I will replace that specific useEffect (lines 2706-2715)
const useEffectToReplace = `React.useEffect(() => {
    const handleWSMessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'import.completa') fetchMenuData();
      } catch (err) {}
    };
    window.addEventListener('message', handleWSMessage);
    return () => window.removeEventListener('message', handleWSMessage);
  }, []);`;

content = content.replace(useEffectToReplace, `React.useEffect(() => {\n    // WebSocket deshabilitado: modo cliente-side\n  }, []);`);

// also document.removeEventListener('cartaya:refresh', fetchMenuData);
content = content.replace(/document\.removeEventListener\('cartaya:refresh', fetchMenuData\);/g, '');

// 6. Duplicate functions
content = content.replace(/function getTabTitle\(tab\) \{[\s\S]*?\}\s*function getTabTitle\(tab\) \{[\s\S]*?\}/g, function(match) {
    // If it literally appears twice sequentially, remove the second
    let single = match.substring(0, match.length / 2);
    // But it's separated by something else probably. Let's just do:
    return match;
});

let firstGetTabTitle = content.indexOf('function getTabTitle(tab)');
let secondGetTabTitle = content.indexOf('function getTabTitle(tab)', firstGetTabTitle + 1);

if (secondGetTabTitle > -1) {
    let endOfSecond = content.indexOf('}', secondGetTabTitle);
    // find matching brace
    let braceCount = 0;
    for(let i = secondGetTabTitle; i < content.length; i++) {
        if (content[i] === '{') braceCount++;
        if (content[i] === '}') {
            braceCount--;
            if (braceCount === 0) {
                endOfSecond = i;
                break;
            }
        }
    }
    content = content.substring(0, secondGetTabTitle) + content.substring(endOfSecond + 1);
}

let firstRoot = content.indexOf('const root = ReactDOM.createRoot(document.getElementById("root"));');
let secondRoot = content.indexOf('const root = ReactDOM.createRoot(document.getElementById("root"));', firstRoot + 1);

if (secondRoot > -1) {
    // remove everything from second root to the end except the closing tags
    let toRemove = content.substring(secondRoot, content.indexOf('</script>', secondRoot));
    content = content.replace(toRemove, '');
}

// 7. JSX comments outside JSX
// Replace them with // if they begin a line
content = content.replace(/^\s*\{\/\* ========================================================= \*\/\}/gm, '      // =========================================================');
content = content.replace(/^\s*\{\/\* PESTAÑA 1: NUEVA CONFIGURACIÓN BASE \(LOS 5 BLOQUES\)       \*\/\}/gm, '      // PESTAÑA 1: NUEVA CONFIGURACIÓN BASE (LOS 5 BLOQUES)');
content = content.replace(/^\s*\{\/\* PESTAÑA 2: LABORATORIO Y OPTIMIZACIÓN \(CÓDIGO ANTERIOR\)    \*\/\}/gm, '      // PESTAÑA 2: LABORATORIO Y OPTIMIZACIÓN (CÓDIGO ANTERIOR)');

content = content.replace(/<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>/, `<script src="https://cdn.tailwindcss.com"></script>\n  <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>`);
// make sure we don't have multiple
let xlsxCount = content.split('xlsx@0.18.5/dist/xlsx.full.min.js').length - 1;
if(xlsxCount > 1) {
    // Remove the one we just added if it was already there (line 12 had it).
    content = content.replace(`<script src="https://cdn.tailwindcss.com"></script>\n  <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>`, `<script src="https://cdn.tailwindcss.com"></script>`);
}

fs.writeFileSync('dashboard_2_fixed.html', content);
