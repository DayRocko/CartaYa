const fs = require('fs');
let html = fs.readFileSync('dashboard_2.html', 'utf8');

const regex = /<button className="mt-4 text-xs font-bold bg-slate-700 text-white px-5 py-2 rounded-full border border-slate-600">Seleccionar Archivo<\/button>\s*<\/div>[\s\S]*?const fetchModificadores = async \(\) => \{[\s\S]*?console\.error\('Error cargando modificadores:', err\);\s*setLoading\(false\);\s*\}\s*\};\s*/;

const replacement = `<button className="mt-4 text-xs font-bold bg-slate-700 text-white px-5 py-2 rounded-full border border-slate-600">Seleccionar Archivo</button>
                 </div>
              </div>

              <div className="text-xs text-slate-500 font-mono bg-black/30 p-3 rounded-lg border border-slate-800">
                <span className="text-emerald-500 font-bold">Respuesta esperada (Simulación):</span><br/>
                &#123; "creados": 47, "fallidos": 3, "errores": [...] &#125;
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- WIDGET: MODIFICADORES Y VARIANTES (PASO 3) ---
function MenuModificadoresBlock({ restauranteId, platos }) {
  // 1. Estado de la Base de Datos (DINÁMICO)
  const [grupos, setGrupos] = React.useState([]);
  const [opciones, setOpciones] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Carga inicial de datos
  React.useEffect(() => {
    fetchModificadores();
  }, []);

  const fetchModificadores = async () => {
    setGrupos([]);
    setLoading(false);
  };
`;

if (regex.test(html)) {
  html = html.replace(regex, replacement);
  fs.writeFileSync('dashboard_2.html', html);
  console.log('Restored missing component code and replaced fetchModificadores!');
} else {
  console.log('Regex did not match.');
}
