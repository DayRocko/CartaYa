const fs = require('fs');
const file = 'dashboard.html';
let content = fs.readFileSync(file, 'utf8');

const target = 'setRecetas(recData);';
const injection = `
      setPlatos(platoData);
      setRecetas(recData);
      console.log('Platos cargados:', platoData);
      console.log('Categorías cargadas:', catData);
`;

if (content.includes(target)) {
    // Replace the specific line with itself plus the logs
    content = content.replace('setPlatos(platoData);', ''); // Clean to avoid duplicates if partial success happened before
    content = content.replace(target, injection);
    fs.writeFileSync(file, content);
    console.log('Injected console.log into fetchMenuData.');
} else {
    console.log('Target not found.');
}
