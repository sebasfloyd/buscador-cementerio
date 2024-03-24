document.addEventListener('DOMContentLoaded', function() {
    // Agrega event listeners una vez que el DOM esté completamente cargado
    document.getElementById('searchButton').addEventListener('click', buscar);
    document.getElementById('addButton').addEventListener('click', agregar);
});

function buscar() {
    const apellido = document.getElementById('apellido').value;
    const resultados = document.getElementById('resultado');
    
    // Verifica si se ingresó un apellido antes de realizar la búsqueda
    if (apellido.trim() !== '') { // Verifica si el campo de apellido no está vacío
        // Realiza una solicitud GET al servidor para buscar fallecidos por apellido
        fetch(`/buscar?apellido=${encodeURIComponent(apellido)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Respuesta no válida del servidor');
                }
                return response.json();
            })
            .then(data => {
                resultados.innerHTML = ''; // Borra los resultados anteriores
                if (data && data.length > 0) {
                    // Si se encuentran resultados, muestra cada fallecido encontrado
                    data.forEach(fallecido => {
                        resultados.innerHTML += `<p>${fallecido.nombre} ${fallecido.apellido} - <a href="${fallecido.direccion}" target="_blank">Ver en Mapa</a></p>`;
                    });
                } else {
                    // Si no se encuentran resultados, muestra un mensaje
                    resultados.innerHTML = '<p>No se encontraron resultados.</p>';
                }
            })
            .catch(error => {
                console.error('Error al buscar:', error);
                resultados.innerHTML = '<p>Hubo un error al realizar la búsqueda.</p>';
            });
    } else {
        // Si no se ingresa un apellido, muestra un mensaje de advertencia
        resultados.innerHTML = '<p>Por favor, ingrese un apellido para buscar.</p>';
    }
}

function agregar() {
    // Obtiene los valores de los campos de entrada
    const nombre = document.getElementById('nombre').value.trim(); // Elimina espacios en blanco al inicio y al final
    const apellido = document.getElementById('apellidoNuevo').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    
    // Verifica si se completaron todos los campos antes de agregar un registro
    if (nombre && apellido && direccion) {
        // Realiza una solicitud POST al servidor para agregar un nuevo registro
        fetch('/agregar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, apellido, direccion }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Respuesta no válida del servidor');
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    // Si hay un error al agregar el registro, muestra un mensaje de error
                    alert('Error al agregar el registro: ' + data.error);
                } else {
                    // Si el registro se agrega con éxito, muestra un mensaje de éxito y limpia los campos de entrada
                    alert('Registro agregado con éxito. ID: ' + data.id);
                    document.getElementById('nombre').value = '';
                    document.getElementById('apellidoNuevo').value = '';
                    document.getElementById('direccion').value = '';
                }
            })
            .catch(error => {
                console.error('Error al agregar:', error);
                alert('Hubo un error al agregar el registro.');
            });
    } else {
        // Si no se completan todos los campos, muestra un mensaje de advertencia
        alert('Por favor, complete todos los campos para agregar un registro.');
    }
}
