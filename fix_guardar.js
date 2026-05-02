const fs = require('fs');
let content = fs.readFileSync('Avance2135.html', 'utf8');

// Fix handleGuardarReceta - the arrow character is corrupted so we match by pattern
content = content.replace(
  /const handleGuardarReceta = async \(platoId, nuevosIngredientes\) => \{\s*try \{\s*await fetch\('\/api\/recetas\/' \+ platoId,[\s\S]*?loadInitialData\(\);\s*\} catch \(e\) \{ console\.error\(e\); \}\s*\};/,
  `const handleGuardarReceta = async (platoId, nuevosIngredientes) => {
    // Update local state immediately; sync to API when backend is available
    setRecetas(prev => {
      const next = Array.isArray(prev) ? [...prev] : [];
      const idx = next.findIndex(r => r.platoId === platoId);
      if (idx >= 0) next[idx] = { platoId, ingredientes: nuevosIngredientes };
      else next.push({ platoId, ingredientes: nuevosIngredientes });
      return next;
    });
    try {
      await fetch('/api/recetas/' + platoId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevosIngredientes)
      });
    } catch (_) { /* offline — local state already updated */ }
  };`
);

// Also fix the remaining loadInitialData() call in the catch (line 629 area)
// Just verify it was replaced
if (content.includes('setRecetas(prev => {')) {
  console.log('OK: handleGuardarReceta patched to offline-first');
} else {
  console.error('FAILED: handleGuardarReceta not patched');
}

fs.writeFileSync('Avance2135.html', content, 'utf8');
console.log('Done.');
