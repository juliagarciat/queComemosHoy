let platosGuardados = [];
let ultimoPlatoIndex = -1;

// Referencias a elementos del DOM
const platoResultadoEl = document.getElementById('plato-resultado');
const etiquetasResultadoEl = document.getElementById('etiquetas-resultado');
const filtroCategoriaEl = document.getElementById('filtro-categoria');
const filtroPequeEl = document.getElementById('filtro-peque');
const btnGenerarEl = document.getElementById('btn-generar');
const adminPanelEl = document.getElementById('admin-panel');
const formRecetaEl = document.getElementById('form-receta');

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
  // Mostrar módulo de administración si la URL contiene ?admin=true
  if (window.location.search.includes('admin=true')) {
    adminPanelEl.style.display = 'block';
  }

  // Cargar datos y asignar eventos
  inicializarDatos();
  btnGenerarEl.addEventListener('click', generarComida);
  formRecetaEl.addEventListener('submit', manejarEnvioReceta);
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
  const soloPeque = filtroPequeEl.checked;

  // Filtrado de recetas
  const opciones = platosGuardados.filter(plato => {
    const cumpleCategoria = (categoria === 'todas' || plato.categoria === categoria);
    const cumplePeque = soloPeque ? plato.apto_peque === true : true;
    return cumpleCategoria && cumplePeque;
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
  } while (opciones.length > 1 && opciones[indiceRandom].id === ultimoPlatoIndex);

  const seleccion = opciones[indiceRandom];
  ultimoPlatoIndex = seleccion.id;

  // Renderizado en pantalla
  platoResultadoEl.innerText = seleccion.nombre;
  
  let htmlEtiquetas = `<span class="etiqueta">${seleccion.categoria}</span>`;
  if (seleccion.apto_peque) {
    htmlEtiquetas += ` <span class="etiqueta etiqueta-peque">Apto Peque</span>`;
  }
  etiquetasResultadoEl.innerHTML = htmlEtiquetas;
}

async function manejarEnvioReceta(e) {
  e.preventDefault();

  const nuevaReceta = {
    nombre: document.getElementById('nuevo-nombre').value.trim(),
    categoria: document.getElementById('nueva-categoria').value,
    apto_peque: document.getElementById('nuevo-peque').checked
  };

  const exito = await insertarRecetaDB(nuevaReceta);

  if (exito) {
    alert("¡Comida añadida a la nube!");
    formRecetaEl.reset();
    await inicializarDatos(); // Actualizar caché local
  } else {
    alert("Ocurrió un error al guardar la receta.");
  }
}