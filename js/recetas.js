// Muestra las recetas guardadas en la nube en la página de recetas
async function cargarRecetasPagina() {
  const datos = await obtenerRecetasDB();
  const contenedor = document.getElementById("items-recetas");

  contenedor.innerHTML = "";

  if (datos === null) {
    contenedor.innerHTML = "<p>Error de conexión con la nube.</p>";
    return;
  }

  if (datos.length === 0) {
    contenedor.innerHTML = "<p>No hay recetas guardadas todavía.</p>";
    return;
  }

  datos.forEach((plato) => {
    const item = document.createElement("div");
    item.className = "item-receta";

    const info = document.createElement("span");
    info.className = "info-receta";
    info.innerText = `${plato.nombre} · ${plato.categoria}`;

    const btnEditar = document.createElement("button");
    btnEditar.type = "button";
    btnEditar.className = "btn-editar";
    btnEditar.innerText = "Editar";
    btnEditar.dataset.id = plato.id;

    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.className = "btn-eliminar";
    btnEliminar.innerText = "Eliminar";
    btnEliminar.dataset.id = plato.id;

    item.appendChild(info);
    item.appendChild(btnEditar);
    item.appendChild(btnEliminar);
    contenedor.appendChild(item);
  });
}

// Delegación de eventos para las acciones de la página de recetas
document.getElementById("items-recetas").addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const id = Number(btn.dataset.id);

  if (btn.classList.contains("btn-editar")) {
    // El edit se gestiona desde el panel de administración con ?editar=<id>
    window.location.href = `index.html?admin=true&editar=${id}`;
    return;
  }

  if (btn.classList.contains("btn-eliminar")) {
    const confirmado = confirm("¿Seguro que quieres eliminar esta receta?");
    if (!confirmado) return;

    const exito = await eliminarRecetaDB(id);
    if (!exito) {
      alert("Ocurrió un error al eliminar la receta.");
      return;
    }

    await cargarRecetasPagina();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  cargarRecetasPagina();
});
