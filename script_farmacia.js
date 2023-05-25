document.addEventListener('DOMContentLoaded', function() {
  // Obtener referencia al formulario
  const form = document.getElementById('myForm');
  const itemsTableBody = document.querySelector('#items tbody');

  // Agregar evento al formulario cuando se envíe
  form.addEventListener('submit', handleFormSubmit);

  // Función para manejar el envío del formulario
  function handleFormSubmit(event) {
    event.preventDefault(); // Prevenir el envío del formulario por defecto

    // Obtener los valores del formulario
    const nombre = document.getElementById('nombre').value;
    const cantidad = document.getElementById('cantidad').value;
    const descripcion = document.getElementById('descripcion').value;

    // Obtener el ID del item a editar (si existe)
    const itemId = parseInt(form.dataset.itemId);

    if (itemId) {
      // Si existe un ID, se trata de una edición
      // Realizar la solicitud PUT a la API REST para actualizar el elemento
      console.log(itemId)
      fetch(`http://localhost:3000/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, cantidad, descripcion })
      })
        .then(response => {
          if (response.ok) {
            // Actualizar el item en el Local Storage
            let items = JSON.parse(localStorage.getItem('items')) || [];
            const itemIndex = items.findIndex(item => item.id === itemId);
            if (itemIndex !== -1) {
              items[itemIndex] = { id: itemId, nombre, cantidad, descripcion };
              localStorage.setItem('items', JSON.stringify(items));

              // Limpiar el formulario
              form.reset();

              // Cambiar el evento del formulario nuevamente para guardar un nuevo item
              form.removeEventListener('submit', handleFormSubmit);
              form.addEventListener('submit', handleFormSubmit);

              // Limpiar la tabla
              itemsTableBody.innerHTML = '';

              // Volver a cargar los datos en la grilla
              loadItemsData();

              // Mostrar un mensaje de éxito
              showMessage('Item actualizado correctamente.');
            } else {
              showMessage('Error al actualizar el item.');
            }
          } else {
            showMessage('Error al actualizar el item.');
            console.error(`Error ${response.status}: ${response.statusText}`);
          }
        })
        .catch(error => {
          showMessage('Error al actualizar el item.');
          console.error(error);
        });
    } else {
      // Si no existe un ID, se trata de un nuevo item
      // Realizar la solicitud POST a la API REST para guardar el elemento
      fetch('http://localhost:3000/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, cantidad, descripcion })
      })
        .then(response => response.json())
        .then(result => {
          // Obtener los datos existentes del Local Storage
          let items = JSON.parse(localStorage.getItem('items')) || [];

          // Agregar el nuevo dato al arreglo con el ID autoincremental
          const newItem = { id: result.id, nombre, cantidad, descripcion };
          items.push(newItem);

          // Guardar el arreglo actualizado en el Local Storage
          localStorage.setItem('items', JSON.stringify(items));

          // Limpiar el formulario
          form.reset();

          // Cambiar el evento del formulario nuevamente para guardar un nuevo item
          form.removeEventListener('submit', handleFormSubmit);
          form.addEventListener('submit', handleFormSubmit);

          // Limpiar la tabla
          itemsTableBody.innerHTML = '';

          // Volver a cargar los datos en la grilla
          loadItemsData();

          // Mostrar un mensaje de éxito
          showMessage('Item guardado correctamente.');
        })
        .catch(error => {
          showMessage('Error al guardar el item.');
          console.error(error);
        });
    }
  }

  // Función para cargar los datos en la grilla
  function loadItemsData() {
    // Realizar la solicitud GET a la API REST para obtener los elementos
    fetch('http://localhost:3000/items')
      .then(response => response.json())
      .then(items => {
        // Generar filas en la tabla con los datos de los items
        items.forEach(item => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.nombre}</td>
            <td>${item.cantidad}</td>
            <td>${item.descripcion}</td>
            <td>
              <button style="width: 200px;" onclick="editItem(${item.id})">Editar</button>
              <button style="background-color: red; color: white;; width: 200px;" onclick="deleteItem(${item.id})">Eliminar</button>
            </td>
          `;
          itemsTableBody.appendChild(row);
        });
      })
      .catch(error => {
        showMessage('Error al cargar los items.');
        console.error(error);
      });
  }

  // Función para editar un item
  window.editItem = function(itemId) {
    // Obtener los datos existentes del Local Storage
    let items = JSON.parse(localStorage.getItem('items')) || [];

    // Encontrar el item con el ID correspondiente
    const item = items.find(item => item.id === itemId);

    if (item) {
      // Llenar el formulario con los datos del item a editar
      document.getElementById('nombre').value = item.nombre;
      document.getElementById('cantidad').value = item.cantidad;
      document.getElementById('descripcion').value = item.descripcion;

      // Actualizar el atributo "data-item-id" del formulario con el ID del item
      form.dataset.itemId = itemId;

      // Cambiar el evento del formulario para realizar la edición en lugar de guardar
      form.removeEventListener('submit', handleFormSubmit);
      form.addEventListener('submit', handleFormSubmit);
    }
  };

  // Función para eliminar un item
  window.deleteItem = function(itemId) {
    // Realizar la solicitud DELETE a la API REST para eliminar el elemento
    fetch(`http://localhost:3000/items/${itemId}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.ok) {
          // Eliminar el item del Local Storage
          let items = JSON.parse(localStorage.getItem('items')) || [];
          items = items.filter(item => item.id !== itemId);
          localStorage.setItem('items', JSON.stringify(items));

          // Limpiar la tabla
          itemsTableBody.innerHTML = '';

          // Volver a cargar los datos en la grilla
          loadItemsData();

          // Mostrar un mensaje de éxito
          showMessage('Item eliminado correctamente.');
        } else {
          showMessage('Error al eliminar el item.');
          console.error(`Error ${response.status}: ${response.statusText}`);
        }
      })
      .catch(error => {
        showMessage('Error al eliminar el item.');
        console.error(error);
      });
  };

  // Función para mostrar un mensaje en el DOM
  function showMessage(message) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
  }

  // Cargar los datos iniciales en la grilla
  loadItemsData();
});
