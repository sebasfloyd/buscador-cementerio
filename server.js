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

// Importa los módulos necesarios
const express = require('express');
const app = express();

// Configura el middleware para analizar JSON en las solicitudes POST
app.use(express.json());

// Controlador para manejar las solicitudes POST en la ruta '/agregar'
app.post('/agregar', (req, res) => {
    // Lógica para procesar la solicitud POST y agregar el nuevo registro
    // Extrae los datos del cuerpo de la solicitud
    const { nombre, apellido, direccion } = req.body;
    
    // Aquí debes agregar la lógica para agregar el registro a la base de datos o donde sea necesario
    
    // Envía una respuesta al cliente
    res.json({ message: 'Registro agregado correctamente' });
});

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});


// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor en ejecución en http://localhost:${port}`);
});

+
