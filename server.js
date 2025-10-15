const express = require('express')

const cors = require('cors')
const path = require('path')

const categoriaRoutes = require('./routes/categoriaRoutes')
const subcategoriaRoutes = require('./routes/subcategoriaRoutes')
const docenteRoutes = require('./routes/docenteRoutes')
const cursoRouter = require('./routes/cursoRoutes')

const app = express()
const PORT = process.env.PORT || 3000 //Puerto de la App

app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}))

//Comunicación se realizará JSON
app.use(express.json())

//Servir los documentos HTML, CSS, JS
app.use(express.static(path.join(__dirname, 'public')))
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cursos.html'))
})

//Rutas
app.use('/api/categorias', categoriaRoutes)
app.use('/api/subcategorias', subcategoriaRoutes)
app.use('/api/docentes', docenteRoutes)
app.use('/api/cursos', cursoRouter)

//Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado http://localhost:${PORT}`)
})
