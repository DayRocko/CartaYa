const fs = require('fs');

const file = 'Avance2135.html';
let content = fs.readFileSync(file, 'utf8');

const regex1 = /  \/\/ --- EFECTO DE CALCULO DE COSTOS \(Prioridad 3\) ---\s+<\/div>\s+<\/div>/;

const replacement1 = \  // --- EFECTO DE CALCULO DE COSTOS (Prioridad 3) ---
  React.useEffect(() => {
    // Evitar bucles: Solo ejecutar si hay cambios reales que procesar
    let cambios = false;
    const nuevosPlatos = (platos || []).map(plato => {
      // Filtrar ingredientes de la receta de este plato
      const ingredientes = (recetas || []).filter(r => 
        r.nombre_plato.toLowerCase().trim() === plato.nombre.toLowerCase().trim()
      );
      
      if (ingredientes.length === 0) return plato;

      // Calcular costo sumando (cantidad * precio_del_inventario)
      const nuevoCosto = ingredientes.reduce((acc, ing) => {
        const itemInv = (inventario || []).find(i => i.nombre.toLowerCase().trim() === ing.ingrediente_nombre.toLowerCase().trim());
        const costoUnitario = itemInv ? (itemInv.precio_por_unidad || 0) : (ing.costo_unitario || 0);
        return acc + (ing.cantidad * costoUnitario);
      }, 0);

      const roundedCosto = Math.round(nuevoCosto);
      
      if (plato.costo_produccion !== roundedCosto) {
        cambios = true;
        const nuevoMargen = plato.precio_venta > 0 
          ? Number((((plato.precio_venta - roundedCosto) / plato.precio_venta) * 100).toFixed(2))
          : 0;
        return { ...plato, costo_produccion: roundedCosto, margen_bruto: nuevoMargen };
      }
      return plato;
    });

    if (cambios) {
      setPlatos(nuevosPlatos);
    }
  }, [recetas, inventario]); // Solo depende de cambios en recetas o inventario

  const handleDescargarPlantilla = () => alert('Descargando plantilla de menú...');
  const handleSubirArchivo = () => fileInputRef.current?.click();

  const handleLimpiarCarta = async () => {
    const confirmado = window.confirm(
      '¿Estás seguro? Esto eliminará todas las categorías, platos, modificadores y recetas. Esta acción no se puede deshacer.'
    );
    if (!confirmado) return;
    setCategorias([]);
    setPlatos([]);
    setRecetas([]);
    setInventario([]);
    setActiveCatNames([]);
    alert('Contenido limpiado correctamente. Ahora puedes subir una nueva plantilla.');
  };

  const handleGuardarCambios = () => {
    alert('Cambios guardados exitosamente. Tu módulo de Carta & Menú está actualizado.');
  };

  const handleDescargarDB = () => {
    const formato = window.prompt("¿En qué formato deseas descargar? (Escribe 'CSV' o 'EXCEL')", "EXCEL");
    if (!formato) return;
    
    // Convertir platos a un array plano para el Excel/CSV
    const exportData = platos.map(p => ({
      ID: p.id || '',
      Nombre: p.nombre || '',
      Categoria: p.categoria_nombre || p.categoria || '',
      Precio_Venta: p.precio_venta || 0,
      Costo_Produccion: p.costo_produccion || 0,
      Canal: p.canal || 'AMBOS',
      Estado: p.estado || 'DISPONIBLE'
    }));

    if (formato.toUpperCase().trim() === 'EXCEL' && window.XLSX) {
      const ws = window.XLSX.utils.json_to_sheet(exportData);
      const wb = window.XLSX.utils.book_new();
      window.XLSX.utils.book_append_sheet(wb, ws, "BaseDatos_Menu");
      window.XLSX.writeFile(wb, "BaseDeDatos_Menu.xlsx");
    } else {
      let csvContent = "data:text/csv;charset=utf-8,ID,Nombre,Categoria,Precio_Venta,Costo_Produccion,Canal,Estado\\\\n";
      exportData.forEach(p => {
        csvContent += \\\\,"\","\",\,\,"\","\"\\\\n\\\;
      });
      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", formato.toUpperCase().trim() === 'EXCEL' ? "BaseDeDatos_Menu.xls" : "BaseDeDatos_Menu.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  
  // FUNCIÓN ROBUSTA DE CARGA DE DATOS DEL MENÚ
  async function loadMenuData() {
    // Sin servidor — retorna null para que fetchMenuData use los datos ya en estado
    return null;
  }

  const fetchMenuData = async () => {
    // Sin servidor — los datos iniciales ya están en el estado de React.
    // Esta función solo existe para el refresco post-importación.
    setLoading(false);
  };

  React.useEffect(() => {
    // No fetch al montar — los datos del estado inicial ya están listos.
    setLoading(false);
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImporting(true);
    setImportError(null);
    setImportResult(null);

    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const wb = window.XLSX.read(data, { type: 'array' });

        console.log('Hojas encontradas:', wb.SheetNames);

        const readSheet = (keyword, fallbackIndex = -1) => {
          const normalize = (s) => String(s).normalize('NFD').replace(/[\\\\u0300-\\\\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9]/g,'');
          const normKeyword = normalize(keyword);
          const match = wb.SheetNames.find(n => normalize(n).includes(normKeyword));
          const sheetName = match || (fallbackIndex >= 0 ? wb.SheetNames[fallbackIndex] : null);
          if (!sheetName) {
            console.warn('Hoja no encontrada para keyword:', keyword);
            return [];
          }
          console.log('Leyendo hoja:', sheetName);

          // Leer como array de arrays — ignora la fila de título
          const raw = window.XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { header: 1, defval: '' });
          if (!raw || raw.length < 2) return [];

          // Fila 0 = título descriptivo largo, Fila 1 = headers reales
          // Verificar: si fila 0 tiene solo 1 celda no vacía => es título, headers en fila 1
          const fila0 = raw[0] || [];
          const noVacios0 = fila0.filter(c => c !== '' && c !== null && c !== undefined);
          const esTitulo = noVacios0.length <= 2 && String(noVacios0[0] || '').length > 20;

          const headerRow = esTitulo ? (raw[1] || []) : fila0;
          const dataStart = esTitulo ? 2 : 1;

          const headers = headerRow.map(h => String(h || '').trim());
          console.log('Headers detectados:', headers.filter(Boolean));

          const dataRows = raw.slice(dataStart).filter(r =>
            Array.isArray(r) && r.some(c => c !== '' && c !== null && c !== undefined)
          );

          const mapped = dataRows.map(r =>
            Object.fromEntries(headers.map((h, i) => [h, r[i] !== undefined ? r[i] : '']))
          );

          console.log('Filas de datos:', mapped.length, mapped[0] || '(vacío)');
          return mapped;
        };

        const catRows = readSheet('CATEGORIAS');
        const cats = catRows
          .filter(r => r['nombre'] && String(r['nombre']).trim() !== '')
          .map((r, i) => ({
            id: 'cat-' + i,
            nombre: String(r['nombre']).trim(),
            canal: String(r['canal'] || 'AMBOS').toUpperCase(),
            orden: Number(r['orden']) || (i + 1),
            estado: String(r['activa'] || 'SI').toUpperCase() === 'NO' ? 'INACTIVA' : 'ACTIVA',
            horario: null
          }));

        const platoRows = readSheet('PLATOS');
        const pls = platoRows
          .filter(r => r['nombre'] && String(r['nombre']).trim() !== '')
          .map((r, i) => {
            const catNombre = String(r['categoria_nombre'] || '').trim();
            const catObj = cats.find(c => c.nombre.toLowerCase() === catNombre.toLowerCase());
            const precio = Number(r['precio_venta']) || 0;
            const costo = r['costo_produccion'] ? Number(r['costo_produccion']) : null;
            return {
              id: 'plato-' + i,
              nombre: String(r['nombre']).trim(),
              descripcion: String(r['descripcion_carta'] || ''),
              precio_venta: precio,
              costo_produccion: costo,
              margen_bruto: precio > 0 && costo ? Number((((precio - costo) / precio) * 100).toFixed(1)) : null,
              categoria_id: catObj ? catObj.id : (cats[0] ? cats[0].id : ''),
              categoria_nombre: catNombre,
              canal: String(r['canal'] || 'AMBOS').toUpperCase(),
              estado: String(r['estado_inicial'] || 'DISPONIBLE').toUpperCase(),
              iva_pct: 8,
              foto_url: null
            };
          });

        const recRows = readSheet('RECETAS');
        const recs = recRows
          .filter(r => r['nombre_plato'] && r['ingrediente_nombre'])
          .map((r, i) => ({
            id: 'rec-' + i,
            nombre_plato: String(r['nombre_plato']).trim(),
            ingrediente_nombre: String(r['ingrediente_nombre']).trim(),
            cantidad: Number(r['cantidad']) || 0,
            unidad_medida: String(r['unidad_medida'] || 'und'),
            costo_unitario: Number(r['costo_unitario']) || 0
          }));

        // Tu plantilla no tiene hoja de inventario — se construye desde recetas
        const invRows = [];
        console.log('Sin hoja de inventario — construyendo desde recetas');
        const inv = [];
        const invFinal = recs.length > 0 ? recs.map((r, i) => ({
          id: 'inv-auto-' + i,
          nombre: r.ingrediente_nombre,
          unidad_compra: r.unidad_medida,
          precio_por_unidad: r.costo_unitario || 0,
          stock_actual: 0,
          stock_minimo_alerta: 0,
          proveedor: ''
        })).filter((v, i, a) => a.findIndex(t => t.nombre === v.nombre) === i) : [];

        console.log('Resultado:', cats.length, 'cats,', pls.length, 'platos,', recs.length, 'recetas,', invFinal.length, 'insumos');

        setCategorias(cats);
        setPlatos(pls);
        setRecetas(recs);
        setInventario(invFinal);

        const activos = cats.filter(c => c.estado === 'ACTIVA').map(c => c.nombre);
        setActiveCatNames(activos);
        setCategoriasExpandidas(activos);

        setImportResult({ categorias: cats.length, platos: pls.length, recetas: recs.length, insumos: invFinal.length });

      } catch (err) {
        console.error('Error al parsear Excel:', err);
        setImportError('Error al leer el Excel: ' + err.message);
      } finally {
        setImporting(false);
        if (e.target) e.target.value = '';
      }
    };

    reader.onerror = () => {
      setImportError('No se pudo leer el archivo. Intenta de nuevo.');
      setImporting(false);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1200px] mx-auto pb-10">
      
      {/* Input de archivo oculto */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept=".csv, .xlsx" 
        className="hidden" 
      />

      {/* TABS HEADER COMPARTIDO */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-2 border-b border-gray-200 pb-6">
        <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="page-heading mb-1">Carta & Menú: <span>{menuTab === 'configuracion' ? 'El Origen de los Datos' : 'El Laboratorio Inteligente'}</span></div>
            <p className="text-gray-500 max-w-2xl text-sm">
              {menuTab === 'configuracion' 
                ? 'Punto de partida del sistema. Ningún módulo puede operar sin que existan platos y categorías configurados aquí.' 
                : 'Sube tu menú actual y deja que la IA convierta cada plato en un activo financiero. Descubre qué te hace ganar dinero y qué te retrasa.'}
            </p>
          </div>
          {menuTab === 'configuracion' && (
            <button
              onClick={handleLimpiarCarta}
              style={{
                padding:'8px 16px',
                background:'transparent',
                color:'#E24B4A',
                border:'1px solid #E24B4A',
                borderRadius:'8px',
                fontWeight:500,
                fontSize:'13px',
                cursor:'pointer',
                whiteSpace:'nowrap'
              }}
            >
              Limpiar contenido
            </button>
          )}
        </div>
        <div className="flex gap-2 bg-gray-100 p-1.5 rounded-xl shrink-0">
            <button 
              onClick={() => setMenuTab('configuracion')}
              className={\px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-all duration-300 flex items-center gap-2 \\}
            >
              ?? 1. Configuración Base
            </button>
            <button 
              onClick={() => setMenuTab('laboratorio')}
              className={\px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-all duration-300 flex items-center gap-2 \\}
            >
              ? 2. Optimización IA
            </button>
        </div>
      </div>
      {menuTab === 'configuracion' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
           
           <style dangerouslySetInnerHTML={{ __html: \
              :root {
                --color-background-primary: var(--surface);
                --color-border-tertiary: var(--gray-200);
                --color-text-secondary: var(--gray-500);
                --color-text-tertiary: var(--gray-300);
                --border-radius-lg: var(--r-lg);
              }
           \}} />

           {/* Context Banner */}
           <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">??</div>
              <div>
                 <h4 className="text-sm font-bold text-blue-900 mb-1">Activación en Cascada</h4>
                 <p className="text-xs text-blue-800/80 leading-relaxed max-w-4xl">
                   Al configurar este módulo alimentas automáticamente a toda la plataforma: <strong>Operaciones</strong> puede abrir mesas, <strong>Delivery</strong> obtiene su carta online, <strong>Inventario</strong> descuenta stock al vender, <strong>Ventas Hoy</strong> clasifica ingresos por categoría, <strong>Finanzas</strong> calcula márgenes y <strong>Brain IA</strong> obtiene datos para analizar.
                 </p>
              </div>
           </div>\
           
const target2Regex = /<div style={{display:'flex', gap:'8px'}}>\s*<button onClick={handleDescargarPlantilla}[^>]*>1\. Bajar Plantilla<\/button>\s*<button onClick={handleSubirArchivo}[^>]*>2\. Subir Archivo CSV<\/button>\s*<\/div>/;

const replacement2 = \               <div style={{display:'flex', flexWrap:'wrap', gap:'8px'}}>
                 <button onClick={handleDescargarPlantilla} style={{padding:'8px 16px', fontSize:'13px', border:'0.5px solid #374151', borderRadius:'6px', background:'transparent', color:'white', cursor:'pointer'}}>1. Bajar Plantilla</button>
                 <button onClick={handleSubirArchivo} style={{padding:'8px 16px', fontSize:'13px', border:'none', borderRadius:'6px', background:'#00A066', color:'white', cursor:'pointer', fontWeight:500}}>2. Subir Archivo CSV</button>
                 <button onClick={handleGuardarCambios} style={{padding:'8px 16px', fontSize:'13px', border:'none', borderRadius:'6px', background:'#3B82F6', color:'white', cursor:'pointer', fontWeight:500}}>?? Guardar cambios</button>
                 <button onClick={handleDescargarDB} style={{padding:'8px 16px', fontSize:'13px', border:'none', borderRadius:'6px', background:'#8B5CF6', color:'white', cursor:'pointer', fontWeight:500}}>?? Descargar Base de Datos</button>
               </div>\;

if (content.match(regex1)) {
    content = content.replace(regex1, replacement1);
    if (content.match(target2Regex)) {
        content = content.replace(target2Regex, replacement2);
        fs.writeFileSync(file, content);
        console.log("Successfully restored target 1 and replaced target 2.");
    } else {
        console.log("Target 2 not found!");
    }
} else {
    console.log("Target 1 not found!");
}
