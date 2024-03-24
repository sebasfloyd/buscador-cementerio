const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const helmet = require('helmet');
const app = express();
const port = process.env.PORT || 3009;

app.use(helmet()); // Añade Helmet para mejorar la seguridad

// Conectar a la base de datos SQLite
const db = new sqlite3.Database('./database.sqlite', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos SQLite:', err.message);
        process.exit(1); // Termina el proceso con un error
    }
});

// Crear tabla si no existe al inicio del servidor
db.run(`CREATE TABLE IF NOT EXISTS fallecidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    apellido TEXT,
    direccion TEXT
)`);

// Middleware para parsear el cuerpo de las solicitudes POST y para servir archivos estáticos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta raíz para servir el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Controlador para manejar las solicitudes POST en la ruta '/agregar'
app.post('/agregar', (req, res) => {
    const { nombre, apellido, direccion } = req.body;
    // Validación básica de entrada
    if (!nombre || !apellido || !direccion) {
        return res.status(400).json({ error: 'Faltan datos para agregar al fallecido.' });
    }
    db.run('INSERT INTO fallecidos (nombre, apellido, direccion) VALUES (?, ?, ?)', [nombre, apellido, direccion], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Error al agregar en la base de datos' });
        } else {
            res.status(200).json({ id: this.lastID });
        }
    });
});

// Controlador para manejar las solicitudes GET en la ruta '/buscar'
app.get('/buscar', (req, res) => {
    const { apellido } = req.query;
    // Validación básica de entrada
    if (!apellido) {
        return res.status(400).json({ error: 'Falta el apellido para realizar la búsqueda.' });
    }
    db.all('SELECT * FROM fallecidos WHERE apellido LIKE ?', [`%${apellido}%`], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Error al buscar en la base de datos' });
        } else {
            res.status(200).json(rows);
        }
    });
});

// Middleware para manejar errores 404
app.use((req, res, next) => {
    res.status(404).send('Lo sentimos, no podemos encontrar eso!');
});

// Middleware para manejar errores 500
app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).send('Algo salió mal!');
});

// Inicia el servidor y maneja errores de base de datos
app.listen(port, () => {
    console.log(`Servidor en ejecución en http://localhost:${port}`);
}).on('error', (err) => {
    console.error('Error al iniciar el servidor:', err.message);
    process.exit(1); // Termina el proceso con un error
});

// Asegurarse de cerrar la base de datos cuando el proceso termina
process.on('SIGINT', () => {
    db.close(() => {
        console.log('Base de datos cerrada debido a la terminación del servidor');
        process.exit(0);
    });
});
