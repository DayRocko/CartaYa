const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Avance2135.html');
let content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
console.log(`Total lines: ${lines.length}`);

// We know:
// - Line 776 (0-indexed) is the broken "return Object.fromEntries(" inside insumosActivos
// - The corrupt duplicate block starts at line 777 (0-indexed) "  const [restaurante..."
// - Line 967 (0-indexed) is the second clean "const insumosActivos = React.useMemo..."
// - The second getTabTitle ends somewhere after line 978

// Find the end of the SECOND getTabTitle (the one that's good and should stay)
let getTabTitleEndLine = -1;
for (let i = 967; i < Math.min(lines.length, 1010); i++) {
  if (lines[i].includes("return titles[tab] || 'Módulo CartaYa'")) {
    // next non-empty line with "};"
    for (let j = i + 1; j < i + 5; j++) {
      if (lines[j] && lines[j].trim() === '};') {
        getTabTitleEndLine = j;
        console.log(`getTabTitle ends at line ${j + 1}: "${lines[j]}"`);
        break;
      }
    }
    break;
  }
}

console.log(`Corrupt block: lines 777 to ${getTabTitleEndLine + 1} (1-indexed)`);
console.log(`Line 777: "${lines[776]}"`);
console.log(`Line ${getTabTitleEndLine + 1}: "${lines[getTabTitleEndLine]}"`);

if (getTabTitleEndLine === -1) {
  console.log('ERROR: could not find getTabTitle end');
  process.exit(1);
}

// Replace lines 776..getTabTitleEndLine (0-indexed) with the clean content
// Line 776 is "    return Object.fromEntries(" - keep until including it
// Then we need to close the useMemo properly and add getTabTitle once

const cleanReplacement = `    return Object.fromEntries(
      [...ids].map(id => [id, inventario[id]])
    );
  }, [platos, recetas, inventario]);

  const getTabTitle = (tab) => {
    const titles = {
      dashboard: 'Dashboard Principal',
      brain: 'Cerebro IA',
      pos: 'POS / Pedidos',
      'ventas-finanzas': 'Ventas & Finanzas',
      operaciones: 'Gestión Operativa',
      inventario: 'Inventario y Compras',
      delivery: 'Delivery y Domicilios',
      reservas: 'Reservas y CRM',
      'marketing-fidelizacion': 'Marketing & Fidelización',
      eventos: 'Eventos y Catering',
      rrhh: 'Gestión de Talento',
      data: 'Data & Insights',
      restaurante: 'Configuración Restaurante',
      menu: 'Gestión de Carta & Menú',
      conectores: 'Integraciones',
      billing: 'Plan & Facturación'
    };
    return titles[tab] || 'Módulo CartaYa';
  };`;

// lines 0..775 = keep (everything before the broken "return Object.fromEntries(")
// lines 776..getTabTitleEndLine = replace with cleanReplacement
// lines getTabTitleEndLine+1..end = keep

const before = lines.slice(0, 776); // lines 0 to 775
const after = lines.slice(getTabTitleEndLine + 1); // lines after the second getTabTitle

const newContent = [...before, cleanReplacement, ...after].join('\n');
fs.writeFileSync(filePath, newContent, 'utf8');

const newLines = newContent.split('\n');
console.log(`SUCCESS! File fixed.`);
console.log(`Lines before: ${lines.length}, Lines after: ${newLines.length}`);
console.log(`Removed ${lines.length - newLines.length} duplicate lines`);
