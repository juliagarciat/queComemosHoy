// Obtiene el catálogo completo de comidas almacenado en la nube
async function obtenerRecetasDB() {
  const { data, error } = await dbClient
    .from('recetas')
    .select('*');

  if (error) {
    console.error('Error al consultar recetas:', error);
    return null;
  }
  return data;
}

// Inserta un nuevo registro desde el panel de administración
async function insertarRecetaDB(nuevaReceta) {
  const { data, error } = await dbClient
    .from('recetas')
    .insert([nuevaReceta]);

  if (error) {
    console.error('Error al insertar receta:', error);
    return false;
  }
  return true;
}