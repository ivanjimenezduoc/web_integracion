// Obtener recetas del servidor
fetch('http://localhost:3000/recetas-paciente/Jean Pierre Castro')
    .then(response => response.json())
    .then(recetas => {
        const recetasGrid = document.getElementById('recetas-grid').getElementsByTagName('tbody')[0];
        recetas.forEach(receta => {
            const items = receta.recetas;
            items.forEach(item => {
                const itemRow = document.createElement('tr');
                const itemColumns = Object.values(item).map(value => {
                    const column = document.createElement('td');
                    column.textContent = value === 'error' ? 'sin stock' : value;
                    return column;
                });
                itemColumns.forEach(column => {
                    itemRow.appendChild(column);
                });
                recetasGrid.appendChild(itemRow);
            });
        });
    })
    .catch(error => console.error('Error al obtener las recetas:', error));
