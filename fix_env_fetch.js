const fs = require('fs');
let content = fs.readFileSync('Avance2135.html', 'utf8');

// 1. Update tryFetch to check protocol
content = content.replace(
  /const tryFetch = async \(url, fallback\) => \{/g,
  `const tryFetch = async (url, fallback) => {
      if (window.location.protocol === 'file:') return fallback;`
);

// 2. Update individual fetch calls in handlers
const fetchHandlers = [
  'handleGuardarReceta',
  'handleTogglePlato',
  'handleConfirmarPedido'
];

fetchHandlers.forEach(handler => {
  // Use a regex to find the fetch call inside the handler and add a protocol check
  const regex = new RegExp(`const ${handler} = async \\(.*?\\) => \\{[\\s\\S]*?try \\{`, 'g');
  content = content.replace(regex, (match) => {
    return match + `\n      if (window.location.protocol === 'file:') return;`;
  });
});

// 3. Update ViewMiRestaurante fetch
content = content.replace(
  /try \{\s*const resp = await fetch\('\/api\/restaurante'\);/g,
  `try {
          if (window.location.protocol === 'file:') throw new Error('OFFLINE');
          const resp = await fetch('/api/restaurante');`
);

fs.writeFileSync('Avance2135.html', content, 'utf8');
console.log('Environment-aware fetch updates complete.');
