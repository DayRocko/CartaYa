const fs = require('fs');
let txt = fs.readFileSync('Avance2135.html', 'utf8');
const oldText = `                  <button onClick={handleDescargarDB} style={{padding:'8px 16px', fontSize:'13px', border:'none', borderRadius:'6px', background:'#8B5CF6', color:'white', cursor:'pointer', fontWeight:500}}>📊 Descargar Base de Datos</button>
              <button`;

const newText = `                  <button onClick={handleDescargarDB} style={{padding:'8px 16px', fontSize:'13px', border:'none', borderRadius:'6px', background:'#8B5CF6', color:'white', cursor:'pointer', fontWeight:500}}>📊 Descargar Base de Datos</button>
                </div>
              </div>
            </div>

            {/* ── ACORDEÓN 1: CATEGORÍAS ── */}
            <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden border-l-4 border-l-indigo-500">
              <button`;

if (txt.includes(oldText)) {
    txt = txt.replace(oldText, newText);
    fs.writeFileSync('Avance2135.html', txt);
    console.log('Successfully applied JSX fix');
} else {
    console.log('Exact snippet not found. Falling back to regex...');
    // Match the button then any whitespace followed by <button
    const regex = /<button onClick=\{handleDescargarDB\}[\s\S]*?<\/button>\s+<button/m;
    const match = txt.match(regex);
    if (match) {
        const replacement = `                  <button onClick={handleDescargarDB} style={{padding:'8px 16px', fontSize:'13px', border:'none', borderRadius:'6px', background:'#8B5CF6', color:'white', cursor:'pointer', fontWeight:500}}>📊 Descargar Base de Datos</button>
                </div>
              </div>
            </div>

            {/* ── ACORDEÓN 1: CATEGORÍAS ── */}
            <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden border-l-4 border-l-indigo-500">
              <button`;
        txt = txt.replace(regex, replacement);
        fs.writeFileSync('Avance2135.html', txt);
        console.log('Successfully applied JSX fix via Regex');
    } else {
        console.log('Failed to find snippet');
    }
}
