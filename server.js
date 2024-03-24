const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = process.env.PORT || 3009;

// Conectar a la base de datos SQLite
const db = new sqlite3.Database('./database.sqlite', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos SQLite:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
        db.run(`CREATE TABLE IF NOT EXISTS fallecidos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT,
            apellido TEXT,
            direccion TEXT
        )`);
    }
});

// Middleware para parsear el cuerpo de las solicitudes POST y para servir archivos estáticos
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para parsear application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, 'public')));

// Ruta raíz para servir el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Controlador para manejar las solicitudes POST en la ruta '/agregar'
app.post('/agregar', (req, res) => {
    const { nombre, apellido, direccion } = req.body;
    db.run('INSERT INTO fallecidos (nombre, apellido, direccion) VALUES (?, ?, ?)', [nombre, apellido, direccion], function(err) {
        if (err) {
            res.status(500).json({ error: 'Error al agregar en la base de datos' });
            console.error(err.message);
        } else {
            res.status(200).json({ id: this.lastID });
        }
    });
});

// Controlador para manejar las solicitudes GET en la ruta '/buscar'
app.get('/buscar', (req, res) => {
    const { apellido } = req.query;
    db.all('SELECT * FROM fallecidos WHERE apellido LIKE ?', [`%${apellido}%`], (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Error al buscar en la base de datos' });
            console.error(err.message);
        } else {
            res.status(200).json(rows);
        }
    });
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor en ejecución en http://localhost:${port}`);
});
