let platosGuardados = [];
let ultimoPlatoIndex = -1;

// Referencias a elementos del DOM
const platoResultadoEl = document.getElementById("plato-resultado");
const etiquetasResultadoEl = document.getElementById("etiquetas-resultado");
const filtroCategoriaEl = document.getElementById("filtro-categoria");
const btnGenerarEl = document.getElementById("btn-generar");
const adminPanelEl = document.getElementById("admin-panel");
const formRecetaEl = document.getElementById("form-receta");
const btnGuardarEl = document.getElementById("btn-guardar");
const btnCancelarEl = document.getElementById("btn-cancelar");
const listaRecetasEl = document.getElementById("items-recetas");

let recetaEnEdicionId = null;

// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", async () => {
  // Mostrar módulo de administración si la URL contiene ?admin=true
  if (window.location.search.includes("admin=true")) {
    adminPanelEl.style.display = "block";
  }

  // Si la URL trae ?editar=<id>, preparar el formulario para editar la receta
  const params = new URLSearchParams(window.location.search);
  const editarId = params.get("editar");
  if (editarId) {
    await editarReceta(Number(editarId));
  }

  // Cargar datos y asignar eventos
  inicializarDatos();
  cargarListaRecetas();
  btnGenerarEl.addEventListener("click", generarComida);
  formRecetaEl.addEventListener("submit", manejarEnvioReceta);
  btnCancelarEl.addEventListener("click", cancelarEdicion);
});

async function inicializarDatos() {
  platoResultadoEl.innerText = "Cargando recetas...";
  const datos = await obtenerRecetasDB();

  if (datos === null) {
    platoResultadoEl.innerText = "Error de conexión con la nube.";
    return;
  }

  platosGuardados = datos;
  platoResultadoEl.innerText = "¡Listo! Pulsa para elegir.";
}

function generarComida() {
  if (platosGuardados.length === 0) return;

  const categoria = filtroCategoriaEl.value;

  // Filtrado de recetas
  const opciones = platosGuardados.filter((plato) => {
    const cumpleCategoria =
      categoria === "todas" || plato.categoria === categoria;
    return cumpleCategoria;
  });

  if (opciones.length === 0) {
    platoResultadoEl.innerText = "No hay platos con este filtro.";
    etiquetasResultadoEl.innerHTML = "";
    return;
  }

  // Selección aleatoria evitando repetir la última opción consecutiva
  let indiceRandom;
  do {
    indiceRandom = Math.floor(Math.random() * opciones.length);
  } while (
    opciones.length > 1 &&
    opciones[indiceRandom].id === ultimoPlatoIndex
  );

  const seleccion = opciones[indiceRandom];
  ultimoPlatoIndex = seleccion.id;

  // Renderizado en pantalla
  platoResultadoEl.innerText = seleccion.nombre;
}

// Refresca la lista de recetas guardadas en la nube (panel de administración)
async function cargarListaRecetas() {
  if (!listaRecetasEl) return;

  const datos = await obtenerRecetasDB();
  if (datos === null) return;

  listaRecetasEl.innerHTML = "";

  if (datos.length === 0) {
    listaRecetasEl.innerHTML = "<p>No hay recetas guardadas todavía.</p>";
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
    listaRecetasEl.appendChild(item);
  });
}

// Delegación de eventos para las acciones de la lista de recetas
if (listaRecetasEl) {
  listaRecetasEl.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const id = Number(btn.dataset.id);

    if (btn.classList.contains("btn-editar")) {
      await editarReceta(id);
    } else if (btn.classList.contains("btn-eliminar")) {
      await eliminarReceta(id);
    }
  });
}

// Rellena el formulario con los datos de una receta para editarla
async function editarReceta(id) {
  const datos = await obtenerRecetasDB();
  const plato = datos?.find((p) => p.id === id);

  if (!plato) {
    alert("No se encontró la receta.");
    return;
  }

  recetaEnEdicionId = id;
  document.getElementById("nuevo-nombre").value = plato.nombre;
  document.getElementById("nueva-categoria").value = plato.categoria;
  btnGuardarEl.innerText = "Actualizar Receta";
  formRecetaEl.scrollIntoView({ behavior: "smooth", block: "center" });
}

// Elimina una receta de la nube
async function eliminarReceta(id) {
  const confirmado = confirm("¿Seguro que quieres eliminar esta receta?");
  if (!confirmado) return;

  const exito = await eliminarRecetaDB(id);

  if (!exito) {
    alert("Ocurrió un error al eliminar la receta.");
    return;
  }

  if (recetaEnEdicionId === id) {
    cancelarEdicion();
  }

  await Promise.all([inicializarDatos(), cargarListaRecetas()]);
}

// Vacía el formulario y cancela la edición en curso
function cancelarEdicion() {
  recetaEnEdicionId = null;
  document.getElementById("id-receta").value = "";
  document.getElementById("nuevo-nombre").value = "";
  document.getElementById("nueva-categoria").value = "Legumbres";
  btnGuardarEl.innerText = "Guardar en la nube";
}

async function manejarEnvioReceta(e) {
  e.preventDefault();

  const nombre = document.getElementById("nuevo-nombre").value.trim();
  const categoria = document.getElementById("nueva-categoria").value;

  if (!nombre) return;

  const exito = recetaEnEdicionId
    ? await actualizarRecetaDB(recetaEnEdicionId, { nombre, categoria })
    : await insertarRecetaDB({ nombre, categoria });

  if (exito) {
    alert(recetaEnEdicionId ? "¡Receta actualizada!" : "¡Comida añadida a la nube!");
    cancelarEdicion();
    await Promise.all([inicializarDatos(), cargarListaRecetas()]);
  } else {
    alert("Ocurrió un error al guardar la receta.");
  }
}
