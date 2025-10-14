const db = require("../config/db");

//Metodo minimo para Mostrar la Lista completa
//Listar
exports.obtenerCategorias = async (req, res) => {
  const sql =
    "SELECT id_categoria, nombre FROM categoria";
  try {
    //Deserialización - PRIMER VALOR DEL ARREGLO
    const [categorias] = await db.query(sql);
    res.status(200).json(categorias);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};
