const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = process.env.PORT || 3009; // Utiliza el puerto proporcionado por el entorno de alojamiento o 3009 por defecto.

// Conectar a la base de datos SQLite
const db = new sqlite3.Database('./database.sqlite', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
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
app.use(express.static(path.join(__dirname, 'public'))); // Asegúrate de que tus archivos estáticos estén en el directorio "public".

// Ruta raíz para servir el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Resto de las rutas de tu API...

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor en ejecución en http://localhost:${port}`);
});
+
