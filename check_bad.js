const fs = require('fs');
let content = fs.readFileSync('Avance2135.html', 'utf8');

const badText =   React.useEffect(() => {
    // No fetch al montar — los datos del estado inicial ya están listos.
    setLoading(false);
  }, []);

  const handleGuardarCambios = () => {
    alert('Cambios guardados exitosamente. Tu módulo de Carta & Menú está actualizado.');
  };

  const handleDescargarDB = () => {
    const formato = window.prompt("¿En qué formato deseas descargar? (Escribe 'CSV' o 'EXCEL')", "EXCEL");
    if (!formato) return;
    
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
      let csvContent = "data:text/csv;charset=utf-8,ID,Nombre,Categoria,Precio_Venta,Costo_Produccion,Canal,Estado\\n";
      exportData.forEach(p => {
        csvContent += \\,"\","\",\,\,"\","\"\\n\;
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

               <div style={{display:'flex', flexWrap:'wrap', gap:'8px'}}>
                 <button onClick={handleDescargarPlantilla} style={{padding:'8px 16px', fontSize:'13px', border:'0.5px solid #374151', borderRadius:'6px', background:'transparent', color:'white', cursor:'pointer'}}>1. Bajar Plantilla</button>
                 <button onClick={handleSubirArchivo} style={{padding:'8px 16px', fontSize:'13px', border:'none', borderRadius:'6px', background:'#00A066', color:'white', cursor:'pointer', fontWeight:500}}>2. Subir Archivo CSV</button>
                 <button onClick={handleGuardarCambios} style={{padding:'8px 16px', fontSize:'13px', border:'none', borderRadius:'6px', background:'#3B82F6', color:'white', cursor:'pointer', fontWeight:500}}>?? Guardar cambios</button>
                 <button onClick={handleDescargarDB} style={{padding:'8px 16px', fontSize:'13px', border:'none', borderRadius:'6px', background:'#8B5CF6', color:'white', cursor:'pointer', fontWeight:500}}>?? Descargar Base de Datos</button>
               </div>;

if (!content.includes(badText.trim().substring(0, 50))) {
  console.log('Bad text not found!');
} else {
  console.log('Found bad text.');
}
