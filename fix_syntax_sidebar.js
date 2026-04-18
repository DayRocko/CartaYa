const fs = require('fs');
const file = 'dashboard.html';
const lines = fs.readFileSync(file, 'utf8').split('\n');

// Line 542 (index 541) and 543 (index 542)
lines[541] = '            <NavItemDark icon={<span>▦</span>} label="Operaciones" isActive={activeTab === "operaciones"} onClick={() => setActiveTab("operaciones")} />';
lines[542] = '            <NavItemDark icon={<span>▤</span>} label="Inventario & Compras" isActive={activeTab === "inventario"} onClick={() => setActiveTab("inventario")} />';

fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('Fixed syntax error in sidebar icons.');
