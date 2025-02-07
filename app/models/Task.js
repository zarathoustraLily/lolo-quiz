const mongoose = require('mongoose');

// Définir le schéma de la tâche
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Titre de la tâche
  description: { type: String, required: true }, // Description de la tâche
  createdAt: { type: Date, default: Date.now } // Date de création de la tâche
});

// Créer le modèle Task basé sur le schéma
const Task = mongoose.model('Task', taskSchema);

module.exports = Task; // Exporter le modèle Task