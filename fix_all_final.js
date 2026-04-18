const fs = require('fs');
const file = 'dashboard.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove Lucide block (using a robust regex)
const lucideBlockRegex = /\/\/ --- INYECCIN DEL SISTEMA DE DISEO ---/i;
const startMatch = content.indexOf('// Diagnóstico y carga robusta de Lucide');
const endMatch = content.indexOf('// --- INYECCIÓN DEL SISTEMA DE DISEÑO ---');

if (startMatch !== -1 && endMatch !== -1 && startMatch < endMatch) {
    content = content.slice(0, startMatch) + content.slice(endMatch);
    console.log('Removed Lucide library block.');
} else {
    // Alternative removal if comments were changed
    content = content.replace(/const getLucide = [\s\S]*?const ImageIcon = Image;/g, '');
}

// 2. Sidebar Icon Standard Replacement
const sidebarIcons = [
    { label: 'Dashboard', unicode: '🏠' },
    { label: 'Brain IA', unicode: '🧠' },
    { label: 'POS / Pedidos', unicode: '▧' },
    { label: 'Ventas', unicode: '📈' },
    { label: 'Finanzas', unicode: '🥧' },
    { label: 'Operaciones', unicode: '▦' },
    { label: 'Inventario & Compras', unicode: '▤' },
    { label: 'Delivery & Domicilios', unicode: '🛵' },
    { label: 'Reservas & CRM', unicode: '👥' },
    { label: 'Marketing', unicode: '📢' },
    { label: 'Fidelización', unicode: '🎁' },
    { label: 'Eventos & Catering', unicode: '🍷' },
    { label: 'Talento (RRHH)', unicode: '👥' },
    { label: 'Data & Insights', unicode: '📊' },
    { label: 'Mi Restaurante', unicode: '🏪' },
    { label: 'Carta & Menú', unicode: '📖' },
    { label: 'Integraciones', unicode: '🔌' },
    { label: 'Plan & Facturación', unicode: '💳' }
];

sidebarIcons.forEach(item => {
    const regex = new RegExp(`<NavItemDark icon={[^}]+} label="${item.label.replace('&', '&amp;')}"`, 'g');
    const replacement = `<NavItemDark icon={<span style={{fontSize:'15px', lineHeight:1}}>${item.unicode}</span>} label="${item.label}"`;
    content = content.replace(regex, replacement);
});

// 3. Global Icon Replacement (Common icons found in the file)
const mapping = {
    'LayoutDashboard': '🏠', 'BrainCircuit': '🧠', 'ShoppingCart': '▧', 'LineChart': '📈', 'PieChart': '🥧',
    'Bike': '🛵', 'UserCheck': '👥', 'Megaphone': '📢', 'Gift': '🎁', 'GlassWater': '🍷', 'Users': '👥',
    'BarChart4': '📊', 'Store': '🏪', 'BookOpen': '📖', 'PlugZap': '🔌', 'CreditCard': '💳', 'Settings': '⚙',
    'Plus': '+', 'X': '✕', 'Edit': '✏', 'Edit3': '✏', 'Trash2': '✕', 'List': '≡', 'ChevronDown': '▼',
    'ChevronUp': '▲', 'UploadCloud': '☁', 'Layers': '⊞', 'UtensilsCrossed': '🍽', 'Package': '📦',
    'ImageIcon': '🖼', 'Sparkles': '✨', 'Database': '🗄', 'Network': '🕸', 'ClipboardList': '📋',
    'Table': '⊞', 'AlertTriangle': '⚠️', 'CheckCircle2': '✅', 'Beaker': '🧪', 'ChefHat': '👨‍🍳',
    'Search': '🔍', 'Download': '📥', 'Printer': '🖨', 'Calculator': '🧮', 'RefreshCw': '🔄',
    'FileText': '📄', 'TrendingUp': '📈', 'Lightbulb': '💡', 'Search': '🔍', 'ArrowRight': '→', 'ArrowLeft': '←',
    'Send': '📤', 'AlertOctagon': '🛑', 'CloudSun': '⛅', 'MapPin': '📍', 'Target': '🎯', 'Camera': '📷',
    'Video': '🎥', 'Radar': '📡', 'ThumbsUp': '👍', 'ThumbsDown': '👎', 'Wand2': '🪄', 'ArrowDownRight': '↘'
};

Object.keys(mapping).forEach(icon => {
    const regex = new RegExp(`<${icon}\\s*[^>]*\\/>`, 'g');
    const replacement = `<span style={{fontSize:'15px', lineHeight:1}}>${mapping[icon]}</span>`;
    content = content.replace(regex, replacement);
});

// 4. Fix line 2758 (??? invalid character)
content = content.replace(/ : \?\?\?\}/g, ' : null}');

fs.writeFileSync(file, content, 'utf8');
console.log('Processed all icon and syntax fixes.');
