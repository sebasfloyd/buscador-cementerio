const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3009; // El puerto que prefieras.

// Conectar a la base de datos SQLite
const db = new sqlite3.Database('./database.sqlite', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS fallecidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      apellido TEXT,
      direccion TEXT
    )`, (err) => {
      if (err) {
        // La tabla ya está creada
        console.log("Table already created or some error occurred");
      } else {
        console.log("Table just created");
      }
    });
  }
});

// Middleware para parsear el cuerpo de las solicitudes POST y para servir archivos estáticos
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Asegúrate de que tus archivos estáticos estén en el directorio correcto.

// Ruta raíz para servir el archivo index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para buscar fallecidos por apellido
app.get('/buscar', (req, res) => {
  const apellido = req.query.apellido;
  db.all('SELECT * FROM fallecidos WHERE apellido LIKE ?', [`%${apellido}%`], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Ruta para agregar un nuevo fallecido
app.post('/agregar', (req, res) => {
  const { nombre, apellido, direccion } = req.body;
  db.run('INSERT INTO fallecidos (nombre, apellido, direccion) VALUES (?, ?, ?)', [nombre, apellido, direccion], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, message: 'Fallecido agregado con éxito.' });
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
