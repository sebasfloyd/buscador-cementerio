const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const helmet = require('helmet');
const app = express();
const port = process.env.PORT || 3009;

// Middleware de Helmet para la seguridad de la aplicación
app.use(helmet());

// Middleware para analizar cuerpos de solicitud en formato JSON
app.use(express.json());

// Middleware para analizar cuerpos de solicitud en formato x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a la base de datos SQLite
const db = new sqlite3.Database('./database.sqlite', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos SQLite:', err.message);
        process.exit(1); // Si hay un error al conectar, termina el proceso
    } else {
        console.log('Conectado a la base de datos SQLite.');
        // Creación de la tabla 'fallecidos' si no existe
        db.run(`CREATE TABLE IF NOT EXISTS fallecidos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT,
            apellido TEXT,
            direccion TEXT
        )`);
    }
});

// Rutas para la API
// Ruta POST para agregar un fallecido
app.post('/agregar', (req, res) => {
    const { nombre, apellido, direccion } = req.body;
    if (!nombre || !apellido || !direccion) {
        return res.status(400).json({ error: 'Faltan datos para agregar al fallecido.' });
    }
    db.run('INSERT INTO fallecidos (nombre, apellido, direccion) VALUES (?, ?, ?)', 
        [nombre, apellido, direccion], 
        function(err) {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Error al agregar en la base de datos' });
            } else {
                res.status(200).json({ id: this.lastID });
            }
    });
});

// Ruta GET para buscar fallecidos por apellido
app.get('/buscar', (req, res) => {
    const { apellido } = req.query;
    if (!apellido) {
        return res.status(400).json({ error: 'Falta el apellido para realizar la búsqueda.' });
    }
    db.all('SELECT * FROM fallecidos WHERE apellido LIKE ?', [`%${apellido}%`], 
        (err, rows) => {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Error al buscar en la base de datos' });
            } else {
                res.status(200).json(rows);
            }
    });
});

// Middleware para manejo de errores 404 - recurso no encontrado
app.use((req, res, next) => {
    res.status(404).send('Recurso no encontrado.');
});

// Middleware para manejo de errores 500 - error interno del servidor
app.use((error, req, res, next) => {
    console.error('Error interno del servidor:', error.stack);
    res.status(500).send('Algo salió mal.');
});

// Iniciar el servidor Express
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
}).on('error', (err) => {
    console.error('Error al iniciar el servidor:', err.message);
    process.exit(1);
});

// Cierre de la base de datos cuando el proceso termina
process.on('SIGINT', () => {
    db.close(() => {
        console.log('La base de datos se ha cerrado debido a la terminación del servidor');
        process.exit(0);
    });
});
