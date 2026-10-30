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

    item.appendChild(info);
    contenedor.appendChild(item);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  cargarRecetasPagina();
});
