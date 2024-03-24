const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = process.env.PORT || 3009; // Utiliza el puerto proporcionado por el entorno de alojamiento o 3009 por defecto.

// Conectar a la base de datos SQLite
const db = new sqlite3.Database('./database.sqlite', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos SQLite:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
        // Crear la tabla si no existe
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
app.use(express.static(path.join(__dirname, 'public'))); // Asegúrate de que tus archivos estáticos estén en el directorio "public".

// Ruta raíz para servir el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Controlador para manejar las solicitudes POST en la ruta '/agregar'
app.post('/agregar', (req, res) => {
    // Extrae los datos del cuerpo de la solicitud
    const { nombre, apellido, direccion } = req.body;
    
    // Verifica si se proporcionaron todos los datos necesarios
    if (!nombre || !apellido || !direccion) {
        return res.status(400).json({ error: 'Por favor, complete todos los campos para agregar un registro.' });
    }
    
    // Inserta el nuevo registro en la base de datos
    db.run('INSERT INTO fallecidos (nombre, apellido, direccion) VALUES (?, ?, ?)', [nombre, apellido, direccion], function(err) {
        if (err) {
            console.error('Error al agregar el registro:', err.message);
            return res.status(500).json({ error: 'Hubo un error al agregar el registro.' });
        }
        
        // Devuelve la ID del registro recién agregado
        res.json({ id: this.lastID });
    });
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor en ejecución en http://localhost:${port}`);
});
