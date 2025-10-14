const express = require('express')

//Enrutador
const router = express.Router()

const docenteController = require('../controllers/docenteController')

//Definiendo las rutas

router.get('/', docenteController.obtenerDocentes)

module.exports = router
