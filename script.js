<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Geolocalización de Familiares</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>Geolocalización de Familiares</h1>
    
    <!-- Formulario de búsqueda -->
    <div>
        <label for="apellido">Buscar por Apellido:</label>
        <input type="text" id="apellido" name="apellido" placeholder="Ingrese el apellido">
        <button id="searchButton">Buscar</button>
    </div>
    <div id="resultado"></div>

    <!-- Formulario de agregar registro -->
    <div>
        <h2>Agregar Nuevo Registro</h2>
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" name="nombre" placeholder="Ingrese el nombre">
        <label for="apellidoNuevo">Apellido:</label>
        <input type="text" id="apellidoNuevo" name="apellidoNuevo" placeholder="Ingrese el apellido">
        <label for="direccion">Dirección (URL de Google Maps):</label>
        <input type="text" id="direccion" name="direccion" placeholder="Ingrese la dirección de Google Maps">
        <button id="addButton">Agregar</button>
    </div>

    <script src="script.js"></script>
</body>
</html>

