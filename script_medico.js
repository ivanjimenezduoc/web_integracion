document.addEventListener('DOMContentLoaded', function() {
  const pacienteSelect = document.getElementById('paciente');
  const itemSelect = document.getElementById('item');
  const cantidadInput = document.getElementById('cantidad');
  const observacionInput = document.getElementById('observacion');
  const grillaBody = document.getElementById('grilla-body');
  const agregarButton = document.getElementById('agregar');
  const crearRecetaButton = document.getElementById('crearReceta');

  fetch('http://localhost:3000/items')
    .then(response => response.json())
    .then(data => {
      data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.nombre;
        itemSelect.appendChild(option);
      });
    })
    .catch(error => console.error(error));

  agregarButton.addEventListener('click', function() {
    const itemId = itemSelect.value;
    const cantidad = cantidadInput.value;
    const observacion = observacionInput.value;

    fetch(`http://localhost:3000/items/${itemId}`)
      .then(response => response.json())
      .then(item => {
        const cantidadExistente = parseInt(item.cantidad);
        const row = document.createElement('tr');
        const cantidadCell = document.createElement('td');

        if (parseInt(cantidad) > cantidadExistente) {
          alert('La cantidad ingresada es mayor a la cantidad existente del medicamento.');
          cantidadCell.style.backgroundColor = 'red';
          cantidadCell.style.color = 'white';
          cantidadCell.textContent = cantidad;
        } else {
          cantidadCell.textContent = cantidad;
        }

        const itemCell = document.createElement('td');
        itemCell.textContent = itemSelect.options[itemSelect.selectedIndex].textContent;

        const observacionCell = document.createElement('td');
        observacionCell.textContent = observacion;

        row.appendChild(itemCell);
        row.appendChild(cantidadCell);
        row.appendChild(observacionCell);

        row.dataset.stock = parseInt(cantidad) > cantidadExistente ? 'error' : 'OK';

        grillaBody.appendChild(row);

        cantidadInput.value = '';
        observacionInput.value = '';
      })
      .catch(error => console.error(error));
  });

  crearRecetaButton.addEventListener('click', function() {
    const paciente = pacienteSelect.options[pacienteSelect.selectedIndex].textContent;
    const rows = grillaBody.getElementsByTagName('tr');

    if (rows.length === 0) {
      alert('No se han agregado recetas.');
      return;
    }

    const recetas = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const itemCell = row.cells[0];
      const cantidadCell = row.cells[1];
      const observacionCell = row.cells[2];
      const stock = row.dataset.stock || 'OK';

      const receta = {
        item: itemCell.textContent,
        cantidad: cantidadCell.textContent,
        observacion: observacionCell.textContent,
        stock: stock,
      };

      recetas.push(receta);
    }

    const result = {
      paciente: paciente,
      recetas: recetas,
    };

    fetch('http://localhost:3000/recetas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la respuesta de la API');
        }
        return response.json();
      })
      .then(result => {
        const recetasGuardadas = JSON.parse(localStorage.getItem('recetas')) || [];
        recetasGuardadas.push(result);
        localStorage.setItem('recetas', JSON.stringify(recetasGuardadas));

        grillaBody.innerHTML = '';
      })
      .catch(error => console.error(error));
  });
});
