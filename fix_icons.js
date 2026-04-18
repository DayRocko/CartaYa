const fs = require('fs');
const file = 'dashboard.html';
let content = fs.readFileSync(file, 'utf8');

// ICONS MAPPING
const mapping = [
  { icon: /<GripVertical\s+[^>]*\/>/g, unicodePath: '⠿' },
  { icon: /<Edit\s+[^>]*\/>/g, unicodePath: '✏' },
  { icon: /<Edit3\s+[^>]*\/>/g, unicodePath: '✏' },
  { icon: /<Trash2\s+[^>]*\/>/g, unicodePath: '✕' },
  { icon: /<List\s+[^>]*\/>/g, unicodePath: '≡' },
  { icon: /<Plus\s+[^>]*\/>/g, unicodePath: '+' },
  { icon: /<X\s+[^>]*\/>/g, unicodePath: '✕' },
  { icon: /<ChevronDown\s+[^>]*\/>/g, unicodePath: '▼' },
  { icon: /<ChevronUp\s+[^>]*\/>/g, unicodePath: '▲' },
  { icon: /<UploadCloud\s+[^>]*\/>/g, unicodePath: '☁' },
  { icon: /<Layers\s+[^>]*\/>/g, unicodePath: '⊞' },
  { icon: /<UtensilsCrossed\s+[^>]*\/>/g, unicodePath: '🍽' },
  { icon: /<Package\s+[^>]*\/>/g, unicodePath: '📦' },
  { icon: /<ImageIcon\s+[^>]*\/>/g, unicodePath: '🖼' },
  { icon: /<Sparkles\s+[^>]*\/>/g, unicodePath: '✨' },
  { icon: /<Database\s+[^>]*\/>/g, unicodePath: '🗄' },
  { icon: /<Network\s+[^>]*\/>/g, unicodePath: '🕸' },
  { icon: /<ClipboardList\s+[^>]*\/>/g, unicodePath: '📋' },
  { icon: /<Table\s+[^>]*\/>/g, unicodePath: '⊞' },
];

mapping.forEach(m => {
  content = content.replace(m.icon, m.unicodePath);
});

// Since the user wants to remove lucide-react mentions in ViewMenu, 
// I should check if there are any other icons not covered.
// For now, these were the ones I saw.

fs.writeFileSync(file, content, 'utf8');
console.log('Unicode icons applied to the entire file (as requested for icons found).');
