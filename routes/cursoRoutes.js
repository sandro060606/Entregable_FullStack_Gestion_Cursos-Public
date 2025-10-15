const express = require('express')

//Enrutador
const router = express.Router()

const cursoController = require('../controllers/cursoController')

//Definiendo las rutas
router.post('/', cursoController.registrarCurso)
router.get('/', cursoController.obtenerCursos)
router.get('/:id_curso', cursoController.obtenerCursoPorId)
router.put('/:id_curso', cursoController.actualizarCurso)
router.delete('/:id_curso', cursoController.eliminarCurso)

module.exports = router