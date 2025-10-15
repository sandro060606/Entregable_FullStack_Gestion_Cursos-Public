const API_URL = "http://localhost:3000/api/cursos";

const formularioCurso = document.getElementById("from-curso");
const tablaCursos = document.querySelector("#tabla-cursos tbody");

const idcurso = document.getElementById("idcurso");

const listaCategorias = document.getElementById("lista-categorias");
const listaSubcategorias = document.getElementById("lista-subcategorias");
const listaDocentes = document.getElementById("lista-docentes");
const titulo = document.getElementById("titulo");
const descripcion = document.getElementById("descripcion");
const fechaInicio = document.getElementById("fechaInicio");
const fechaFin = document.getElementById("fechaFin");
const precio = document.getElementById("precio");
const duracionHoras = document.getElementById("duracionHoras");

const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");

const API_URL_CATEGORIAS = "http://localhost:3000/api/categorias";
const API_URL_SUBCATEGORIAS = "http://localhost:3000/api/subcategorias";
const API_URL_DOCENTES = "http://localhost:3000/api/docentes";

// Formatea la fecha de YYYY-MM-DD a DD/MM/YYYY para la tabla
function formatDate(dateString) {
  if (!dateString) return "N/A";
  const cleanDate = dateString.substring(0, 10);
  const parts = cleanDate.split("-");

  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateString;
}

let todasLasCategorias = [];
let todasLasSubcategorias = [];
let todosLosDocentes = [];

async function obtenerCategorias() {
  const response = await fetch(API_URL_CATEGORIAS, { method: "get" });
  const categorias = await response.json();

  todasLasCategorias = categorias;

  categorias.forEach((item) => {
    const tagOption = document.createElement("option");
    tagOption.textContent = item.nombre;
    tagOption.value = item.id_categoria;
    listaCategorias.appendChild(tagOption);
  });
}

async function obtenerTodasLasSubcategorias() {
  const response = await fetch(API_URL_SUBCATEGORIAS, { method: "get" });
  const subcategorias = await response.json();

  todasLasSubcategorias = subcategorias;
}

function actualizarSubcategorias() {
  const categoriaId = listaCategorias.value;

  const subcategoriasFiltradas = todasLasSubcategorias.filter(
    (item) => String(item.id_categoria) === categoriaId
  );

  subcategoriasFiltradas.forEach((item) => {
    const tagOption = document.createElement("option");
    tagOption.textContent = item.nombre;
    tagOption.value = item.id_subcategoria;
    listaSubcategorias.appendChild(tagOption);
  });
}

async function obtenerDocentes() {
  const response = await fetch(API_URL_DOCENTES, { method: "get" });
  const docentes = await response.json();

  todosLosDocentes = docentes;

  docentes.forEach((item) => {
    const tagOption = document.createElement("option");
    tagOption.innerHTML = item.nombre_completo;
    tagOption.value = item.id_docente;
    listaDocentes.appendChild(tagOption);
  });
}

async function obtenerCursos() {
  try {
    const response = await fetch(API_URL, { method: "get" });
    if (!response.ok) {
      throw new Error(
        `Error en la API: ${response.status} ${response.statusText}`
      );
    }
    const cursos = await response.json();

    tablaCursos.innerHTML = "";

    cursos.forEach((curso) => {
      const row = tablaCursos.insertRow();

      row.insertCell().textContent = curso.id_curso;
      row.insertCell().textContent = curso.titulo;
      row.insertCell().textContent = curso.categoria_nombre;
      row.insertCell().textContent = curso.subcategoria_nombre;
      row.insertCell().textContent = curso.docente_nombre;
      row.insertCell().textContent = formatDate(curso.fecha_inicio);
      row.insertCell().textContent = formatDate(curso.fecha_fin);
      row.insertCell().textContent = curso.duracion_horas;
      row.insertCell().textContent = parseFloat(curso.precio).toFixed(2);

      const actionCell = row.insertCell();

      const editButton = document.createElement("button");
      editButton.textContent = "Editar";
      editButton.classList.add("btn", "btn-info", "btn-sm", "me-2");
      editButton.onclick = () => cargarParaEdicion(curso);

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Eliminar";
      deleteButton.classList.add("btn", "btn-danger", "btn-sm");
      deleteButton.onclick = () => eliminarCurso(curso.id_curso, curso.titulo);

      actionCell.appendChild(editButton);
      actionCell.appendChild(deleteButton);
    });
  } catch (e) {
    console.error("Error al obtener cursos:", e);
  }
}

async function cargarParaEdicion(curso) {
    idcurso.value = curso.id_curso;
    titulo.value = curso.titulo;
    descripcion.value = curso.descripcion;
    duracionHoras.value = curso.duracion_horas;
    precio.value = curso.precio;
    fechaInicio.value = curso.fecha_inicio.substring(0, 10); 
    fechaFin.value = curso.fecha_fin.substring(0, 10);

    const subcategoriaEncontrada = todasLasSubcategorias.find(
        (sub) => sub.id_subcategoria === curso.id_subcategoria
    );

    if (subcategoriaEncontrada) {
        listaCategorias.value = subcategoriaEncontrada.id_categoria;
        actualizarSubcategorias();
    }
    
    listaSubcategorias.value = curso.id_subcategoria;
    listaDocentes.value = curso.id_docente; 
    btnGuardar.innerText = "Actualizar";
}

async function eliminarCurso(id, tituloCurso) {
    if (confirm(`¿Está seguro de eliminar DEFINITIVAMENTE el curso: ${tituloCurso}?`) ) {
    try {
        const response = await fetch(API_URL + `/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`Error al eliminar el curso: ${tituloCurso}`);
        }

        const result = await response.json();
        console.log(result);
        obtenerCursos();
    } catch (e) {
        console.error(e);
        alert(`Ocurrió un error al intentar eliminar el curso.`);
    }
  }
}

formularioCurso.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = {
    titulo: titulo.value,
    descripcion: descripcion.value,
    fecha_inicio: fechaInicio.value,
    fecha_fin: fechaFin.value,
    duracion_horas: parseInt(duracionHoras.value),
    precio: parseFloat(precio.value),
    id_subcategoria: parseInt(listaSubcategorias.value),
    id_docente: parseInt(listaDocentes.value),
  };

  try {
    let response = null;

    if (idcurso.value == "") {
      // REGISTRAR (POST)
      response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      // ACTUALIZAR (PUT)
      response = await fetch(API_URL + `/${idcurso.value}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }

    if (!response.ok) {
      throw new Error(
        `Error en la operación: ${response.status} ${response.statusText}`
      );
    }
    btnGuardar.innerText = "Guardar";
    formularioCurso.reset();
    idcurso.value = "";
    obtenerCursos();
  } catch (e) {
    console.error(e);
    alert("Ocurrió un error al guardar o actualizar el curso.");
  }
});

btnCancelar.addEventListener("click", () => {
  idcurso.value = "";
  btnGuardar.innerText = "Guardar";
});

document.addEventListener("DOMContentLoaded", async () => {
  await obtenerTodasLasSubcategorias();
  obtenerDocentes();
  await obtenerCategorias();
  obtenerCursos();
  listaCategorias.addEventListener("change", actualizarSubcategorias);
});
