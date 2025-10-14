const express = require('express')

//Enrutador
const router = express.Router()

const categoriaController = require('../controllers/categoriaController')

//Definiendo las rutas

router.get('/', categoriaController.obtenerCategorias)

module.exports = router
