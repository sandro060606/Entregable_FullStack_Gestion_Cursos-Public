const pool = require("../config/db");

exports.registrarCurso = async (req, res) => {
  const {
    titulo,
    descripcion,
    fecha_inicio,
    fecha_fin,
    duracion_horas,
    precio,
    id_subcategoria,
    id_docente,
  } = req.body;

  if (
    !titulo ||
    !descripcion ||
    !fecha_inicio ||
    !fecha_fin ||
    !duracion_horas ||
    !precio ||
    !id_subcategoria ||
    !id_docente
  ) {
    return res.status(400).json({
      mensaje: "Datos para Registrar el Curso incompletos o inválidos.",
    });
  }
  const sql =
    "INSERT INTO curso (titulo, descripcion, fecha_inicio, fecha_fin, duracion_horas, precio, id_subcategoria, id_docente) VALUES (?,?,?,?,?,?,?,?)";
  try {
    //Ejecutamos consulta
    const [result] = await pool.query(sql, [
      titulo,
      descripcion,
      fecha_inicio,
      fecha_fin,
      duracion_horas,
      precio,
      id_subcategoria,
      id_docente,
    ]);
    res.status(201).json({
      id: result.insertId,
      mensaje: "Curso Registrado correctamente",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

exports.obtenerCursos = async (req, res) => {
  const sql = `
        SELECT 
          cur.id_curso,
          cur.titulo,
          cur.descripcion,
          cat.nombre AS categoria_nombre,
          sub.nombre AS subcategoria_nombre,
          doc.nombre_completo AS docente_nombre,
          cur.fecha_inicio,
          cur.fecha_fin,
          cur.duracion_horas,
          cur.precio
        FROM 
          curso cur
        JOIN 
          subcategoria sub 
          ON cur.id_subcategoria = sub.id_subcategoria
        JOIN 
          categoria cat 
          ON sub.id_categoria = cat.id_categoria
        JOIN 
          docente doc 
          ON cur.id_docente = doc.id_docente
        ORDER BY 
          cur.id_curso DESC
        `;

  try {
    // Ejecutamos la consulta usando el pool
    const [cursos] = await pool.query(sql);
    res.status(200).json(cursos);
  } catch (e) {
    console.error("Error al obtener los Cursos:", e);
    res
      .status(500)
      .json({ mensaje: "Error interno del servidor al listar Cursos." });
  }
};

//Buscar por ID
exports.obtenerCursoPorId = async (req, res) => {
  const { id_curso } = req.params;

  const sql =
    "SELECT id_curso, titulo, descripcion, fecha_inicio, fecha_fin, duracion_horas, precio, id_subcategoria, id_docente FROM curso WHERE id_curso = ?";

  try {
    //Deserialización - PRIMER VALOR DEL ARREGLO
    const [cursos] = await pool.query(sql, [id_curso]);

    if (cursos.length == 0) {
      return res.status(404).json({ mensaje: "No encontramos el Curso" });
    }
    res.status(200).json(cursos[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

//Actualizar
exports.actualizarCurso = async (req, res) => {
  //Necesitamos un parametro
  const { id_curso } = req.params;
  const {
    titulo,
    descripcion,
    fecha_inicio,
    fecha_fin,
    duracion_horas,
    precio,
    id_subcategoria,
    id_docente,
  } = req.body; //Validación => ES OBLIGATORIO QUE ALMENOS UNO TENGA DATOS

  if (
    !id_curso &&
    !titulo &&
    !descripcion &&
    !fecha_inicio &&
    !fecha_fin &&
    !duracion_horas &&
    !precio &&
    !id_subcategoria &&
    !id_docente
  ) {
    return res.status(400).json({ mensaje: "Falta completar los campos" });
  }

  let sqlParts = []; //campos que sufrirá actualización
  let values = []; //valores de los campos

  if (titulo) {
    sqlParts.push("titulo = ?");
    values.push(titulo);
  }
  if (descripcion) {
    sqlParts.push("descripcion = ?");
    values.push(descripcion);
  }
  if (fecha_inicio) {
    sqlParts.push("fecha_inicio = ?");
    values.push(fecha_inicio);
  }
  if (fecha_fin) {
    sqlParts.push("fecha_fin = ?");
    values.push(fecha_fin);
  }
  if (duracion_horas) {
    sqlParts.push("duracion_horas = ?");
    values.push(duracion_horas);
  }
  if (precio) {
    sqlParts.push("precio = ?");
    values.push(precio);
  }
  if (id_subcategoria) {
    sqlParts.push("id_subcategoria = ?");
    values.push(id_subcategoria);
  }
  if (id_docente) {
    sqlParts.push("id_docente = ?");
    values.push(id_docente);
  }
  if (sqlParts.length == 0) {
    return res.status(400).json({ mensaje: "No hay datos por actualizar" });
  } //Construir de manera dinámica la consulta

  values.push(id_curso);
  const sql = `UPDATE curso SET ${sqlParts.join(", ")} WHERE id_curso = ?`;
  try {
    const [result] = await pool.query(sql, values);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ mensaje: "No encontramos el curso con el ID" });
    }
    res.status(200).json({ mensaje: "Actualizado correctamente" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno en el servidor" });
  }
};

//Eliminar
exports.eliminarCurso = async (req, res) => {
  const { id_curso } = req.params;
  const sql = "DELETE FROM curso WHERE id_curso = ?";
  try {
    const [result] = await pool.query(sql, [id_curso]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ mensaje: "Curso no encontrado para eliminar" });
    }

    res.status(200).json({ mensaje: "Curso Eliminado correctamente" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};
