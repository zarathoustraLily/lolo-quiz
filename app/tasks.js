const express = require('express');
const router = express.Router();
const Task = require('./models/Task'); // Importer le modèle Task

// Route pour créer une nouvelle tâche
router.post('/tasks', async (req, res) => {
  const { title, description } = req.body; // Récupérer les données de la requête
  const newTask = new Task({ title, description }); // Créer une nouvelle tâche
  await newTask.save(); // Sauvegarder la tâche dans la base de données
  res.send('Task created'); // Envoyer une réponse indiquant que la tâche a été créée
});

// Route pour obtenir toutes les tâches
router.get('/tasks', async (req, res) => {
  const tasks = await Task.find(); // Récupérer toutes les tâches de la base de données
  res.json(tasks); // Envoyer les tâches en réponse sous forme de JSON
});

module.exports = router; // Exporter le routeur