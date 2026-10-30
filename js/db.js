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

// Actualiza un registro existente en la nube (edición de recetas)
async function actualizarRecetaDB(id, cambios) {
  const { error } = await dbClient
    .from('recetas')
    .update(cambios)
    .eq('id', id);

  if (error) {
    console.error('Error al actualizar la receta:', error);
    return false;
  }
  return true;
}

// Elimina un registro de la nube (borrado de recetas)
async function eliminarRecetaDB(id) {
  const { error } = await dbClient
    .from('recetas')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error al eliminar la receta:', error);
    return false;
  }
  return true;
}