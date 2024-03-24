document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('searchButton').addEventListener('click', buscar);
    document.getElementById('addButton').addEventListener('click', agregar);
});

function buscar() {
    const apellido = document.getElementById('apellido').value;
    const resultados = document.getElementById('resultado');
    if (apellido) {
        fetch(`/buscar?apellido=${encodeURIComponent(apellido)}`)
            .then(response => response.json())
            .then(data => {
                resultados.innerHTML = '';
                if (data && data.length > 0) {
                    data.forEach(fallecido => {
                        resultados.innerHTML += `<p>${fallecido.nombre} ${fallecido.apellido} - <a href="${fallecido.direccion}" target="_blank">Ver en Mapa</a></p>`;
                    });
                } else {
                    resultados.innerHTML = '<p>No se encontraron resultados.</p>';
                }
            })
            .catch(error => {
                console.error('Error al buscar:', error);
                resultados.innerHTML = '<p>Hubo un error al realizar la búsqueda.</p>';
            });
    } else {
        resultados.innerHTML = '<p>Por favor, ingrese un apellido para buscar.</p>';
    }
}

function agregar() {
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellidoNuevo').value;
    const direccion = document.getElementById('direccion').value;
    
    if (nombre && apellido && direccion) {
        fetch('/agregar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, apellido, direccion }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert('Error al agregar el registro: ' + data.error);
                } else {
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
        alert('Por favor, complete todos los campos para agregar un registro.');
    }
}
