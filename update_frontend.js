const fs = require('fs');
let code = fs.readFileSync('c:/Users/dayro/Desktop/Project # 3 Startup AI/RestPro AI/cartaya/dashboard.html', 'utf8');

// 1. Add states and handleFileUpload function
const search1 = `  const [formError, setFormError] = useState('');
  
  // 3. Formulario`;

const replace1 = `  const [formError, setFormError] = useState('');
  
  // Estados para Importación
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = React.useRef ? React.useRef(null) : useRef(null);
  
  // 3. Formulario`;

code = code.replace(search1, replace1);

const search2 = `  const formatCOP = (val) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(val);

  // --- LÓGICA CRUD & REGLAS DE NEGOCIO ---`;

const replace2 = `  const formatCOP = (val) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(val);

  const handleFileUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');
    setUploadResult(null);

    const fd = new FormData();
    fd.append('file', file);

    try {
      const resp = await fetch('http://localhost:8001/api/import', {
        method: 'POST',
        body: fd
      });
      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.error || 'Error en la importación');
      }

      setUploadResult(data);
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const closeImportModal = () => {
    setShowImportModal(false);
    setUploadResult(null);
    setUploadError('');
    setIsUploading(false);
    if(uploadResult) window.location.reload(); // Recargar tras importar exitosamente
  };

  // --- LÓGICA CRUD & REGLAS DE NEGOCIO ---`;

code = code.replace(search2, replace2);

// 2. Modify the modal JSX
const searchModal = `            <div className="p-6 relative z-10 space-y-6">
              <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl space-y-3">
                 <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2"><ArrowRight size={14} className="text-emerald-500"/> Paso 1: Prepara tus datos</h4>
                 <p className="text-xs text-slate-400 leading-relaxed">Descarga la plantilla obligatoria. Modifica el archivo Excel o Google Sheets asegurándote de no borrar los encabezados, y guárdalo en formato <b>.CSV (Valores separados por comas)</b>.</p>
                 <button className="text-xs font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-4 py-2 rounded-lg hover:bg-emerald-400/20 transition-colors flex items-center gap-2">
                   <Download size={14}/> Bajar plantilla_platos.csv
                 </button>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl space-y-3">
                 <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2"><ArrowRight size={14} className="text-emerald-500"/> Paso 2: Sube el archivo</h4>
                 <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-800 transition-colors cursor-pointer group">
                    <UploadCloud size={32} className="text-slate-500 mb-3 group-hover:text-emerald-400 transition-colors"/>
                    <p className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">Arrastra tu archivo .CSV aquí</p>
                    <p className="text-[10px] text-slate-500 mt-1">Máximo 500 filas por importación (2MB max).</p>
                    <button className="mt-4 text-xs font-bold bg-slate-700 text-white px-5 py-2 rounded-full border border-slate-600">Seleccionar Archivo</button>
                 </div>
              </div>

              <div className="text-xs text-slate-500 font-mono bg-black/30 p-3 rounded-lg border border-slate-800">
                <span className="text-emerald-500 font-bold">Respuesta esperada (Simulación):</span><br/>
                &#123; "creados": 47, "fallidos": 3, "errores": [...] &#125;
              </div>
            </div>`;

const replaceModal = `            <div className="p-6 relative z-10 space-y-6">
              {uploadResult ? (
                 <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-xl text-center space-y-4 animate-in zoom-in-95 duration-300">
                    <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-emerald-500/30">
                       <Check size={40}/>
                    </div>
                    <h4 className="text-xl font-black text-white">¡Importación Exitosa!</h4>
                    <p className="text-sm text-slate-400">{uploadResult.message}</p>
                    
                    <div className="grid grid-cols-2 gap-3 mt-6 text-left max-w-sm mx-auto">
                       <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl flex justify-between items-center">
                          <span className="text-xs text-slate-400 font-bold uppercase">Categorías</span>
                          <span className="text-lg font-black text-emerald-400">{uploadResult.counts?.categorias || 0}</span>
                       </div>
                       <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl flex justify-between items-center">
                          <span className="text-xs text-slate-400 font-bold uppercase">Platos</span>
                          <span className="text-lg font-black text-emerald-400">{uploadResult.counts?.platos || 0}</span>
                       </div>
                       <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl flex justify-between items-center">
                          <span className="text-xs text-slate-400 font-bold uppercase">Recetas</span>
                          <span className="text-lg font-black text-emerald-400">{uploadResult.counts?.recetas || 0}</span>
                       </div>
                       <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl flex justify-between items-center">
                          <span className="text-xs text-slate-400 font-bold uppercase">Modificadores</span>
                          <span className="text-lg font-black text-emerald-400">{uploadResult.counts?.modificadores || 0} + {uploadResult.counts?.opciones || 0}</span>
                       </div>
                    </div>
                    <button onClick={closeImportModal} className="mt-6 w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/50 transition-all">
                       Aceptar y Recargar
                    </button>
                 </div>
              ) : isUploading ? (
                 <div className="bg-slate-800/50 border border-slate-700 p-12 rounded-xl text-center space-y-4">
                    <RefreshCw size={48} className="text-emerald-400 animate-spin mx-auto"/>
                    <h4 className="text-lg font-bold text-white">Procesando Archivo...</h4>
                    <p className="text-xs text-slate-400">Validando datos e insertando en base de datos.</p>
                 </div>
              ) : (
                 <>
                    {uploadError && (
                       <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm font-bold">
                          Error: {uploadError}
                       </div>
                    )}
                    <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl space-y-3">
                       <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2"><ArrowRight size={14} className="text-emerald-500"/> Paso 1: Prepara tus datos</h4>
                       <p className="text-xs text-slate-400 leading-relaxed">Descarga la plantilla obligatoria. Modifica el archivo Excel asegurándote de no borrar los encabezados, y guárdalo en formato <b>.XLSX o .CSV</b>.</p>
                       <button className="text-xs font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-4 py-2 rounded-lg hover:bg-emerald-400/20 transition-colors flex items-center gap-2">
                         <Download size={14}/> Bajar plantilla_platos.csv
                       </button>
                    </div>

                    <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl space-y-3">
                       <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2"><ArrowRight size={14} className="text-emerald-500"/> Paso 2: Sube el archivo</h4>
                       <div 
                          className="border-2 border-dashed border-slate-600 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-800 transition-colors cursor-pointer group"
                          onClick={() => fileInputRef.current?.click()}
                       >
                          <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                          <UploadCloud size={32} className="text-slate-500 mb-3 group-hover:text-emerald-400 transition-colors"/>
                          <p className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">Haz clic aquí para seleccionar tu archivo Excel/CSV</p>
                          <p className="text-[10px] text-slate-500 mt-1">Máximo 500 filas por importación (2MB max).</p>
                          <button className="mt-4 text-xs font-bold bg-slate-700 text-white px-5 py-2 rounded-full border border-slate-600">Seleccionar Archivo</button>
                       </div>
                    </div>
                 </>
              )}
            </div>`;

code = code.replace(searchModal, replaceModal);

// Also fix close modal X button on line 1957
code = code.replace(
  '<button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-lg border border-slate-700 transition-colors"><X size={18}/></button>',
  '<button onClick={closeImportModal} className="text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-lg border border-slate-700 transition-colors"><X size={18}/></button>'
);

fs.writeFileSync('c:/Users/dayro/Desktop/Project # 3 Startup AI/RestPro AI/cartaya/dashboard.html', code);

console.log('Frontend dashboard.html updated successfully.');
