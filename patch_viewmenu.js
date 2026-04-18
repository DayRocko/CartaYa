const fs = require('fs');
let viewMenu = fs.readFileSync('tmp_viewmenu_full.txt', 'utf8');

// 1. fetchMenuData
viewMenu = viewMenu.replace(/const fetchMenuData = async \(\) => \{[\s\S]*?\}\s*catch[^{}]*\}[\s\S]*\}\s*;\s*/, "const fetchMenuData = async () => {};\n  ");

// 2. handleLimpiarCarta try/catch
viewMenu = viewMenu.replace(/try\s*\{[\s\S]*const res = await fetch\('\/api\/carta\/limpiar'[\s\S]*catch[ \t]*\([^\)]*\)[ \t]*\{[\s\S]*?\}\s*/, 
  "setCategorias([]);\n    setPlatos([]);\n    setRecetas([]);\n    setInventario([]);\n    setActiveCatNames([]);\n    alert('Contenido limpiado correctamente. Ahora puedes subir una nueva plantilla.');\n  ");

// 3. handleFileUpload
const newHandleFileUpload = `  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImporting(true);
    setImportError(null);
    setImportResult(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });

        const readSheet = (keyword) => {
          const match = workbook.SheetNames.find(n => 
            n.toUpperCase().replace(/[^A-Z0-9]/g, '').includes(
              keyword.toUpperCase().replace(/[^A-Z0-9]/g, '')
            )
          );
          if (!match) return [];
          return XLSX.utils.sheet_to_json(workbook.Sheets[match], { defval: '', range: 1 });
        };

        const catRows = readSheet('CATEGORIAS');
        const platoRows = readSheet('PLATOS');
        const recetaRows = readSheet('RECETAS');

        setCategorias(catRows);
        setPlatos(platoRows);
        setRecetas(recetaRows);
        setImportResult({ status: 'success', message: 'Importación local exitosa usando SheetJS.' });
      } catch (err) {
        setImportError(err.message);
      } finally {
        setImporting(false);
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = ''; // Reset
  };`;
viewMenu = viewMenu.replace(/const handleFileUpload = async \([^)]*\) => \{[\s\S]*?e\.target\.value = ''; \/\/ Reset\s*\n\s*\};/, newHandleFileUpload);

// 4. useEffect
const newUseEffect = `React.useEffect(() => {
    const handleWSMessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'import.completa') fetchMenuData();
      } catch (err) {}
    };
    window.addEventListener('message', handleWSMessage);
    return () => window.removeEventListener('message', handleWSMessage);
  }, []);`;
viewMenu = viewMenu.replace(/React\.useEffect\(\(\) => \{[\s\S]*?document\.removeEventListener\('cartaya:refresh', fetchMenuData\);\s*\}\s*;\s*\}, \[\]\);/, newUseEffect);

// 5. End tags
const endTagsNew = `                    </React.Fragment>
                 )}
               </div>
             )}
           </div>
        </div>
      )}

      {menuTab === 'laboratorio' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center py-20">
            <p className="text-gray-400 text-sm font-bold">Laboratorio de Optimización IA — próximamente</p>
          </div>
        </div>
      )}

    </div>
  );
}`;
viewMenu = viewMenu.replace(/Cerrar y ver mi carta[\s\S]*?\}\s*$/, 'Cerrar y ver mi carta\n                      </button>\n' + endTagsNew);

fs.writeFileSync('tmp_viewmenu_patched.txt', viewMenu);
console.log('Created tmp_viewmenu_patched.txt. Length:', viewMenu.length);
