const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

let items = [];
let recetas = [];
let itemIdCounter = 1;
let recetaIdCounter = 1;

app.get('/items', (req, res) => {
  res.json(items);
});

app.post('/items', (req, res) => {
  const newItem = req.body;
  newItem.id = itemIdCounter++;
  items.push(newItem);
  res.status(201).json(newItem);
});

app.get('/items/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  const item = items.find((item) => item.id === itemId);

  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ error: 'Item no encontrado' });
  }
});

app.get('/recetas', (req, res) => {
  res.json(recetas);
});

app.post('/recetas', (req, res) => {
  const newReceta = req.body;
  newReceta.id = recetaIdCounter++;
  recetas.push(newReceta);
  res.status(201).json(newReceta);
});

app.put('/items/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  const updatedItem = req.body;
  const itemIndex = items.findIndex((item) => item.id === itemId);
  if (itemIndex !== -1) {
    updatedItem.id = itemId;
    items[itemIndex] = updatedItem;
    res.json(updatedItem);
  } else {
    res.status(404).json({ error: 'Item no encontrado' });
  }
});

app.delete('/items/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  const itemIndex = items.findIndex((item) => item.id === itemId);
  if (itemIndex !== -1) {
    items.splice(itemIndex, 1);
    res.sendStatus(204);
  } else {
    res.status(404).json({ error: 'Item no encontrado' });
  }
});

app.get('/recetas-paciente/:nombre', (req, res) => {
  const nombre = req.params.nombre;
  const recetasPaciente = recetas.filter((receta) => receta.paciente === nombre);
  res.json(recetasPaciente);
});

app.listen(3000, () => {
  console.log('API REST escuchando en el puerto 3000');
});
