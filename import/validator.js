/**
 * Valida la estructura y contenido de los datos parseados
 * @param {object} data Datos parseados (pestañas: categorias, platos, etc.)
 */
async function validateData(data) {
  const errors = [];
  const validated = { success: true, errors: [], data };

  // Validaciones mínimas: debe haber categorías o platos
  if (!data.categorias && !data.platos) {
    errors.push('El archivo debe tener pestañas llamadas "categorias" o "platos".');
  }

  // Validación básica de columnas en platos
  if (data.platos) {
    const requiredPlatosProps = ['nombre', 'precio_venta'];
    data.platos.forEach((plato, idx) => {
      requiredPlatosProps.forEach(prop => {
        if (!plato[prop]) errors.push(`Plato fila ${idx + 2}: Falta "${prop}"`);
      });
    });
  }

  // Validación básica de columnas en categorias
  if (data.categorias) {
    const requiredCategoriasProps = ['nombre'];
    data.categorias.forEach((cat, idx) => {
      requiredCategoriasProps.forEach(prop => {
        if (!cat[prop]) errors.push(`Categoría fila ${idx + 2}: Falta "${prop}"`);
      });
    });
  }

  if (errors.length > 0) {
    validated.success = false;
    validated.errors = errors;
  }

  return validated;
}

module.exports = { validateData };
