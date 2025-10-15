# Sistema de Gestión de Cursos Full Stack (CRUD)

Este proyecto implementa una solución para la gestión de cursos, docentes, categorías y subcategorías, utilizando una arquitectura Full Stack con Node.js/Express en el backend y HTML/JavaScript en el frontend.

## ⚙️ Procedimientos de Configuración
Sigue estos pasos para poner en marcha el proyecto:

### 1. 👝 Clonar Repositorio
Abre tu terminal y descarga el proyecto:
```
git clone (https://github.com/sandro060606/Entregable_FullStack_Gestion_Cursos-Public.git)
```

### 2. ⛏️ Configuración de la Base de Datos (MySQL)
Debes crear la base de datos y las tablas relacionales (`categoria`, `subcategoria`, `docente`) y la tabla principal (`curso`) / Ademas de Registros de Prueba con sus consultas
```sql
CREATE DATABASE entregable_fullstack;
USE entregable_fullstack;
-- 1. Crear la tabla CATEGORÍA
CREATE TABLE categoria(
    id_categoria 	INT PRIMARY KEY AUTO_INCREMENT,
    nombre 		VARCHAR(100) NOT NULL UNIQUE
)ENGINE=INNODB;

INSERT INTO categoria (nombre) VALUES
('Informática'),
('Matemáticas'),
('Negocios');
SELECT * FROM categoria;

-- 2. Crear la tabla SUBCATEGORÍA
CREATE TABLE subcategoria (
    id_subcategoria 	INTEGER PRIMARY KEY AUTO_INCREMENT,
    nombre 		VARCHAR(100) NOT NULL,
    id_categoria 	INTEGER NOT NULL,
    FOREIGN KEY (id_categoria) REFERENCES Categoria(id_categoria)
)ENGINE=INNODB;

INSERT INTO subcategoria (nombre, id_categoria) VALUES
('Lenguajes de Programación', 1),
('Bases de Datos', 1),
('Geometría Analítica', 2),
('Estadística Aplicada', 2),
('Marketing Digital', 3);
SELECT * FROM subcategoria;

-- 3. Crear la tabla DOCENTE (Tabla de apoyo para la FK del curso)
CREATE TABLE docente (
    id_docente 		INTEGER PRIMARY KEY AUTO_INCREMENT,
    nombre_completo 	VARCHAR(255) NOT NULL,
    email 		VARCHAR(100) UNIQUE
)ENGINE=INNODB;

INSERT INTO docente (nombre_completo, email) VALUES
('Ana Torres', 'ana.torres@academia.com'),
('Juan Pérez', 'juan.perez@academia.com'),
('Maria López', 'maria.lopez@academia.com');
SELECT*FROM docente;

-- 4. Crear la tabla CURSO
CREATE TABLE curso (
    id_curso 		INTEGER PRIMARY KEY AUTO_INCREMENT,
    titulo 		VARCHAR(255) NOT NULL,
    descripcion 	TEXT,
    fecha_inicio 	DATE NOT NULL,
    fecha_fin 		DATE NOT NULL,
    duracion_horas 	INTEGER NOT NULL,
    precio 		DECIMAL(10, 2) NOT NULL,
    id_subcategoria 	INTEGER NOT NULL,
    id_docente 		INTEGER NOT NULL,  
    FOREIGN KEY (id_subcategoria) REFERENCES Subcategoria(id_subcategoria) ON DELETE RESTRICT,
    FOREIGN KEY (id_docente) REFERENCES Docente(id_docente) ON DELETE RESTRICT
)ENGINE=INNODB;

INSERT INTO curso (titulo, descripcion, fecha_inicio, fecha_fin, duracion_horas, precio, id_subcategoria, id_docente) VALUES
('Python Básico', 'Fundamentos Python y estructuras de datos.', '2025-11-01', '2025-11-30', 40, 99.99, 1, 1),
('SQL Avanzado', 'Optimización de consultas y gestión de BBDD relacionales.', '2025-12-05', '2025-12-20', 30, 149.50, 2, 2),
('E-Commerce Estratégico', 'Diseño de tiendas virtuales y gestión de ventas online.', '2026-01-10', '2026-02-10', 60, 199.00, 5, 3);

SELECT * FROM curso;

-- Consulta para mostrar todos los cursos con sus detalles de clasificación y docente
SELECT 
    cur.id_curso,
    cur.titulo,
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
    cur.id_curso DESC;
    

```
### 3. 🔑 Crear y Configurar el Archivo .env
Este archivo contiene las credenciales de la base de datos y la configuración del servidor. Crea un archivo llamado .env en la raíz del proyecto y rellena los valores:

```
DB_HOST=localhost
DB_USER=[RELLENAR: Usuario de MySQL, ej: root]
DB_PASSWORD=[RELLENAR: Contraseña de MySQL o Si no tienes deja sin rellenar]
DB_DATABASE=[RELLENAR: El nombre de tu BD, ej: entregable_fullstack]
DB_PORT=3306
```

### 4. 📋 Instalar Dependencias
Abre la terminal de tu proyecto (en la carpeta del backend) y ejecuta el siguiente comando para instalar las librerías necesarias:

```
npm install
```

### 5. ▶️ Ejecutar el Servidor
Inicia el servidor Node.js con nodemon:

```
nodemon server
```

### 6. 🌐 Acceder a la Interfaz
Una vez que el servidor esté corriendo, abre tu navegador y accede a la interfaz de gestión:

```
Gestión de Cursos: http://localhost:3000/cursos.html
```
## 🧪 Endpoints de la API
La aplicación se comunica a través de estos endpoints RESTful:

### 1. Gestión de Cursos (CRUD Completo)

```
🔍 Listar Cursos
Método: GET
Descripción: Muestra una lista completa de todos los cursos con detalles de Categoría, Subcategoría y Docente

➕ Crear Curso (POST)
Método: POST
Descripción: Registra un nuevo curso. Requiere enviar un objeto JSON en el body.

✏️ Actualizar Curso Existente (PUT)
Método: PUT
Descripción: Modifica los datos de un curso específico. El :id_curso debe ser el ID del artículo.

🗑️ Eliminar Curso(DELETE)
Método: PUT
Descripción: Elimina el registro de un curso por su ID.
```
### 2. Endpoints de Apoyo (Selects Dinámicos)

```
🔍 Listar Categorías (GET)
Método: GET
Descripcion: Obtiene la lista para llenar el selector principal.

🔍 Listar Subcategorías por Categoría (GET)
Método: GET
Descripcion: Filtra y obtiene las subcategorías relacionadas con el ID de la categoría seleccionada.

🔍 Listar Docentes (GET)
Método: GET
Descripcion: Obtiene la lista de docentes disponibles.

```