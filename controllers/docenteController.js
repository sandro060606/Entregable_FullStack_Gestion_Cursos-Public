const db = require("../config/db");

//Metodo minimo para Mostrar la Lista completa
//Listar
exports.obtenerDocentes = async (req, res) => {
  const sql =
    "SELECT id_docente, nombre_completo, email FROM docente";
  try {
    //Deserialización - PRIMER VALOR DEL ARREGLO
    const [docentes] = await db.query(sql);
    res.status(200).json(docentes);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};
