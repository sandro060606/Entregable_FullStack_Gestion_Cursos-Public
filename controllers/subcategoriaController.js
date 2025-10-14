const db = require("../config/db");

//Metodo minimo para Mostrar la Lista completa
//Listar
exports.obtenerSubcategorias = async (req, res) => {
  const sql =
    "SELECT id_subcategoria, nombre, id_categoria FROM subcategoria";
  try {
    //Deserialización - PRIMER VALOR DEL ARREGLO
    const [subcategorias] = await db.query(sql);
    res.status(200).json(subcategorias);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};
