const express = require('express')

//Enrutador
const router = express.Router()

const subcategoriaController = require('../controllers/subcategoriaController')

//Definiendo las rutas

router.get('/', subcategoriaController.obtenerSubcategorias)

module.exports = router
